import { Controller, Patch, Body, Req, UseGuards } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { UserRequest } from "../common/types/UserRequest.type"

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Patch("me")
	updateMe(@Req() req: UserRequest, @Body() dto: UpdateUserDto) {
		return this.usersService.updateUser(req.user.id, dto)
	}
}
