import {
	Controller,
	Post,
	Get,
	Delete,
	Body,
	Req,
	Res,
	UseGuards,
	Param,
	HttpCode,
	HttpStatus,
	UnauthorizedException
} from "@nestjs/common"
import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { UserRequest } from "../common/types/user-request.type"
import { RevokedReasonEnum } from "./enums/revokedReason.enum"
import { ConfigService } from "@nestjs/config"
import { Throttle } from "@nestjs/throttler"

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	@Post("register")
	async register(
		@Body() dto: RegisterDto,
		@Req() req: Request,
		@Res() res: Response
	) {
		const userAgent = req.headers["user-agent"] ?? ""
		const ip = req.ip ?? ""
		const result = await this.authService.register(dto, userAgent, ip)
		this.setRefreshCookie(res, result.refreshToken)
		return res.json({ accessToken: result.accessToken, user: result.user })
	}

	@Throttle({ default: { ttl: 60_000, limit: 10 } })
	@Post("login")
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() dto: LoginDto,
		@Req() req: Request,
		@Res() res: Response
	) {
		const userAgent = req.headers["user-agent"] ?? ""
		const ip = req.ip ?? ""
		const result = await this.authService.login(dto, userAgent, ip)
		this.setRefreshCookie(res, result.refreshToken)
		return res.json({ accessToken: result.accessToken, user: result.user })
	}

	@Throttle({ default: { ttl: 60_000, limit: 20 } })
	@Post("refresh")
	@HttpCode(HttpStatus.OK)
	async refresh(@Req() req: Request, @Res() res: Response) {
		const refreshToken = req.cookies?.["refreshToken"] as string | undefined
		if (!refreshToken) throw new UnauthorizedException("No refresh token")

		const userAgent = req.headers["user-agent"] ?? ""
		const ip = req.ip ?? ""

		const result = await this.authService.refresh(refreshToken, userAgent, ip)

		res.once("finish", () => {
			void this.authService.acceptToken(result.refreshToken)
		})

		this.setRefreshCookie(res, result.refreshToken)
		return res.json({ accessToken: result.accessToken })
	}

	@Post("logout")
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	async logout(@Req() req: UserRequest, @Res() res: Response) {
		await this.authService.logout(req.user.sessionId)
		res.clearCookie("refreshToken")
		return res.json({ message: "Logged out" })
	}

	@Get("sessions")
	@UseGuards(JwtAuthGuard)
	getSessions(@Req() req: UserRequest) {
		return this.authService.getSessions(req.user.id)
	}

	@Delete("sessions")
	@UseGuards(JwtAuthGuard)
	async revokeAllSessions(@Req() req: UserRequest, @Res() res: Response) {
		await this.authService.revokeAllUserSessions(
			req.user.id,
			RevokedReasonEnum.MANUAL
		)
		res.clearCookie("refreshToken")
		return res.json({ message: "All sessions revoked" })
	}

	@Delete("sessions/:id")
	@UseGuards(JwtAuthGuard)
	revokeSession(@Param("id") id: string, @Req() req: UserRequest) {
		return this.authService.revokeSessionById(id, req.user.id)
	}

	private setRefreshCookie(res: Response, token: string) {
		res.cookie("refreshToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
			path: this.configService.get<string>("JWT_REFRESH_COOKIE_PATH")
		})
	}
}
