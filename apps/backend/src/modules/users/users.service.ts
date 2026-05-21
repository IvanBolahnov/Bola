import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { MoreThan, MoreThanOrEqual, Repository } from "typeorm"
import { User } from "./entities/user.entity"
import { UpdateUserDto } from "./dto/update-user.dto"
import { Session } from "../auth/entities/session.entity"
import { RevokedReasonEnum } from "../auth/enums/revokedReason.enum"

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepo: Repository<User>,
		@InjectRepository(Session)
		private sessionRepo: Repository<Session>
	) {}

	async getAll() {
		return this.usersRepo.find({
			where: { sessions: { isRevoked: false } },
			relations: ["sessions"]
		})
	}

	async updateUser(userId: string, dto: UpdateUserDto) {
		const user = await this.usersRepo.findOne({ where: { id: userId } })
		if (!user) throw new NotFoundException("User not found")
		user.name = dto.name
		return this.usersRepo.save(user)
	}

	async analytics() {
		const userRepo = this.usersRepo
		const sessionRepo = this.sessionRepo

		const now = new Date()
		const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
		const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
		const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

		const [
			totalUsers,
			newUsersLast24h,
			newUsersLast7d,
			newUsersLast30d,
			totalSessions,
			activeSessions,
			revokedSessions,
			securityRevokes,
			recentSessions,
			topDevices,
			registrationsRaw
		] = await Promise.all([
			// --- Users ---
			userRepo.count(),

			userRepo.count({ where: { createdAt: MoreThanOrEqual(last24h) } }),
			userRepo.count({ where: { createdAt: MoreThanOrEqual(last7d) } }),
			userRepo.count({ where: { createdAt: MoreThanOrEqual(last30d) } }),

			// --- Sessions ---
			sessionRepo.count(),

			sessionRepo.count({
				where: {
					isRevoked: false,
					expiresAt: MoreThan(now)
				}
			}),

			sessionRepo.count({ where: { isRevoked: true } }),

			// Отозванные по причине безопасности (reuse attack)
			sessionRepo.count({
				where: { revokedReason: RevokedReasonEnum.REUSE_ATTACK } // замените на актуальный enum
			}),

			// Последние 10 сессий
			sessionRepo.find({
				order: { createdAt: "DESC" },
				take: 10,
				relations: ["user"],
				select: {
					id: true,
					userId: true,
					ip: true,
					deviceName: true,
					userAgent: true,
					isRevoked: true,
					revokedReason: true,
					createdAt: true,
					expiresAt: true,
					user: {
						id: true,
						email: true,
						name: true
					}
				}
			}),

			// Топ устройств
			sessionRepo
				.createQueryBuilder("s")
				.select("s.deviceName", "deviceName")
				.addSelect("COUNT(*)", "count")
				.where("s.deviceName IS NOT NULL")
				.groupBy("s.deviceName")
				.orderBy("count", "DESC")
				.limit(10)
				.getRawMany<{ deviceName: string; count: string }>(),

			// Регистрации по дням за последние 30 дней
			userRepo
				.createQueryBuilder("u")
				.select("DATE(u.createdAt)", "date")
				.addSelect("COUNT(*)", "count")
				.where("u.createdAt >= :from", { from: last30d })
				.groupBy("DATE(u.createdAt)")
				.orderBy("date", "ASC")
				.getRawMany<{ date: string; count: string }>()
		])

		const acceptanceRate =
			totalSessions > 0
				? ((totalSessions - revokedSessions) / totalSessions) * 100
				: 0

		const registrationsMap = new Map(
			registrationsRaw.map((r) => [
				`${new Date(r.date).getMonth()}.${new Date(r.date).getDate()}`,
				Number(r.count)
			])
		)

		const registrationsByDay = Array.from({ length: 30 }, (_, i) => {
			const date = new Date(last30d)
			date.setDate(date.getDate() + i)
			const key = `${new Date(date).getMonth()}.${new Date(date).getDate()}`
			return {
				date: key,
				count: registrationsMap.get(key) ?? 0
			}
		})

		return {
			users: {
				total: totalUsers,
				new: {
					last24h: newUsersLast24h,
					last7d: newUsersLast7d,
					last30d: newUsersLast30d
				},
				registrationsByDay: registrationsByDay
			},
			sessions: {
				total: totalSessions,
				active: activeSessions,
				revoked: revokedSessions,
				securityRevokes,
				acceptanceRate: Math.round(acceptanceRate * 100) / 100,
				topDevices: topDevices.map((d) => ({
					deviceName: d.deviceName,
					count: Number(d.count)
				})),
				recent: recentSessions
			}
		}
	}
}
