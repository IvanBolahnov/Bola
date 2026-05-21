import {
	Injectable,
	UnauthorizedException,
	ConflictException,
	ForbiddenException,
	Logger,
	NotFoundException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
import { UAParser } from "ua-parser-js"
import { User } from "../users/entities/user.entity"
import { Session } from "./entities/session.entity"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { JwtPayload } from "./strategies/jwt.strategy"
import { RevokedReasonEnum } from "./enums/revokedReason.enum"

@Injectable()
export class AuthService {
	private logger = new Logger(AuthService.name)

	constructor(
		@InjectRepository(User)
		private usersRepo: Repository<User>,
		@InjectRepository(Session)
		private sessionsRepo: Repository<Session>,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async register(dto: RegisterDto, userAgent: string, ip: string) {
		const exists = await this.usersRepo.findOne({ where: { email: dto.email } })
		if (exists) throw new ConflictException("Email already in use")

		const passwordHash = await bcrypt.hash(dto.password, 12)
		const user = this.usersRepo.create({ ...dto, password: passwordHash })
		await this.usersRepo.save(user)

		return this.createSession(user, userAgent, ip)
	}

	async login(dto: LoginDto, userAgent: string, ip: string) {
		const user = await this.usersRepo.findOne({
			where: { email: dto.email },
			select: [
				"id",
				"email",
				"name",
				"password",
				"createdAt",
				"updatedAt",
				"role"
			]
		})

		if (!user) throw new UnauthorizedException("Invalid credentials")

		const valid = await bcrypt.compare(dto.password, user.password)
		if (!valid) throw new UnauthorizedException("Invalid credentials")

		return this.createSession(user, userAgent, ip)
	}

	async refresh(refreshToken: string, userAgent: string, ip: string) {
		const tokenHash = this.hashToken(refreshToken)
		this.logger.debug(`Refresh attempt, tokenHash: ${tokenHash.slice(0, 8)}...`)

		return await this.sessionsRepo.manager.transaction(async (manager) => {
			const sessionRepo = manager.getRepository(Session)
			const userRepo = manager.getRepository(User)

			let session = await sessionRepo.findOne({
				where: {
					refreshTokenHash: tokenHash,
					isRevoked: false,
					isAccepted: true
				},
				lock: { mode: "pessimistic_write" }
			})

			if (!session) {
				session = await sessionRepo.findOne({
					where: {
						parentTokenHash: tokenHash,
						isRevoked: false,
						isAccepted: false
					},
					lock: { mode: "pessimistic_write" }
				})
				if (!session) {
					this.logger.error("Invalid token")
					throw new UnauthorizedException("Invalid token")
				}
			}

			if (session.deviceName !== this.parseDeviceName(userAgent)) {
				await sessionRepo.save({
					...session,
					isRevoked: true,
					revokedAt: new Date(),
					revokedReason: RevokedReasonEnum.REUSE_ATTACK
				})
				this.logger.error(`User agent mismatch. UserId: ${session.userId}`)
				throw new ForbiddenException("User agent mismatch. Session revoked.")
			}

			const newRefreshToken = crypto.randomBytes(64).toString("hex")
			const newRefreshTokenHash = this.hashToken(newRefreshToken)

			session.parentTokenHash = session.refreshTokenHash
			session.refreshTokenHash = newRefreshTokenHash
			session.ip = ip
			session.expiresAt = this.getRefreshExpiry()
			session.isAccepted = false // Новый токен не принимаем до подтверждения клиентом
			await sessionRepo.save(session)

			const user = await userRepo.findOne({ where: { id: session.userId } })

			if (!user) {
				this.logger.error(`User not found. UserId: ${session.userId}`)
				throw new NotFoundException("User not found.")
			}

			const accessToken = this.generateAccessToken(user, session.id)
			return { accessToken, refreshToken: newRefreshToken }
		})
	}

	async logout(sessionId: string) {
		const session = await this.sessionsRepo.findOne({
			where: { id: sessionId }
		})
		if (session) {
			await this.revokeSession(session, RevokedReasonEnum.LOGOUT)
		}
	}

	async getSessions(userId: string) {
		return this.sessionsRepo.find({
			where: { userId, isRevoked: false },
			select: [
				"id",
				"deviceName",
				"ip",
				"userAgent",
				"createdAt",
				"lastUsedAt",
				"expiresAt"
			],
			order: { lastUsedAt: "DESC" }
		})
	}

	async revokeSession(session: Session, reason: RevokedReasonEnum) {
		session.isRevoked = true
		session.revokedAt = new Date()
		session.revokedReason = reason
		await this.sessionsRepo.save(session)
	}

	async revokeSessionById(sessionId: string, userId: string) {
		const session = await this.sessionsRepo.findOne({
			where: { id: sessionId, userId }
		})
		if (!session) throw new UnauthorizedException("Session not found")
		await this.revokeSession(session, RevokedReasonEnum.MANUAL)

		return session
	}

	async revokeAllUserSessions(userId: string, reason: RevokedReasonEnum) {
		const sessions = await this.sessionsRepo.find({
			where: { userId, isRevoked: false }
		})
		await Promise.all(sessions.map((s) => this.revokeSession(s, reason)))
	}

	async acceptToken(refreshToken: string) {
		const tokenHash = this.hashToken(refreshToken)
		this.logger.debug(
			`Accept token attempt, tokenHash: ${tokenHash.slice(0, 8)}...`
		)

		const session = await this.sessionsRepo.findOne({
			where: { refreshTokenHash: tokenHash, isRevoked: false }
		})

		if (!session) {
			this.logger.error("Invalid token for acceptance")
			return
		}

		session.isAccepted = true
		await this.sessionsRepo.save(session)
	}

	/**
	 * Создаёт новую сессию в БД
	 * @param user - пользователь для которого создаётся сессия
	 * @param userAgent - строка User-Agent из заголовков запроса
	 * @param ip - IP адрес клиента
	 * @param options.tokenAccepted - пометить refresh token как подтверждённый сразу после создания.
	 * По умолчанию true (при логине/регистрации токен сразу валиден).
	 * Передавай false при rotation — токен становится валидным только после подтверждения клиентом
	 */
	private async createSession(
		user: User,
		userAgent: string,
		ip: string,
		options = { tokenAccepted: true }
	) {
		const refreshToken = crypto.randomBytes(64).toString("hex")
		const refreshTokenHash = this.hashToken(refreshToken)
		const deviceName = this.parseDeviceName(userAgent)

		const session = this.sessionsRepo.create({
			userId: user.id,
			refreshTokenHash,
			userAgent,
			ip,
			deviceName,
			isAccepted: options.tokenAccepted,
			expiresAt: this.getRefreshExpiry()
		})
		await this.sessionsRepo.save(session)

		const accessToken = this.generateAccessToken(user, session.id)

		return {
			accessToken,
			refreshToken,
			user: { id: user.id, email: user.email, name: user.name, role: user.role }
		}
	}

	private generateAccessToken(user: User, sessionId: string) {
		const payload: JwtPayload = { sub: user.id, email: user.email, sessionId }
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>("JWT_SECRET"),
			expiresIn: this.configService.get<string>(
				"JWT_ACCESS_EXPIRES"
			) as `${number}`
		})
	}

	private hashToken(token: string): string {
		return crypto.createHash("sha256").update(token).digest("hex")
	}

	private parseDeviceName(userAgent: string): string {
		const parser = new UAParser(userAgent)
		const browser = parser.getBrowser().name ?? "Unknown browser"
		const os = parser.getOS().name ?? "Unknown OS"
		return `${browser} on ${os}`
	}

	private getRefreshExpiry(): Date {
		const days = 7
		const expiry = new Date()
		expiry.setDate(expiry.getDate() + days)
		return expiry
	}
}
