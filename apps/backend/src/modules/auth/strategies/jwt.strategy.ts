import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../../users/entities/user.entity"

export interface JwtPayload {
	sub: string
	email: string
	sessionId: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		@InjectRepository(User)
		private usersRepo: Repository<User>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>("JWT_SECRET")!
		})
	}

	async validate(payload: JwtPayload) {
		const user = await this.usersRepo.findOne({ where: { id: payload.sub } })
		if (!user) throw new UnauthorizedException()
		return { ...user, sessionId: payload.sessionId }
	}
}
