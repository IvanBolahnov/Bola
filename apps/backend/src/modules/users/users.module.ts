import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./entities/user.entity"
import { UsersService } from "./users.service"
import { UsersController } from "./users.controller"
import { Session } from "../auth/entities/session.entity"

@Module({
	imports: [TypeOrmModule.forFeature([User, Session])],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [TypeOrmModule]
})
export class UsersModule {}
