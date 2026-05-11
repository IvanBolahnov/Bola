import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { User } from "../users/entities/user.entity"
import { Session } from "./entities/session.entity"

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Session]),
		PassportModule,
		JwtModule.register({})
	],
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController]
})
export class AuthModule {}
