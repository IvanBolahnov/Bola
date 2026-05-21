import { Controller, Patch, Body, Req, UseGuards, Get } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { UserRequest } from "../common/types/user-request.type"
import { RolesGuard } from "../../guards/roles.guard"
import { Roles } from "../../decorators/roles.decorator"
import { UserRoleEnum } from "./enums/user-role.enum"

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Patch("me")
	updateMe(@Req() req: UserRequest, @Body() dto: UpdateUserDto) {
		return this.usersService.updateUser(req.user.id, dto)
	}

	@Roles(UserRoleEnum.ADMIN)
	@Get()
	getAll() {
		return this.usersService.getAll()
	}

	@Roles(UserRoleEnum.ADMIN)
	@Get("analytics")
	analytics() {
		return this.usersService.analytics()
	}
}
