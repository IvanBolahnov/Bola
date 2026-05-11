import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "./entities/user.entity"
import { UpdateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepo: Repository<User>
	) {}

	async updateUser(userId: string, dto: UpdateUserDto) {
		const user = await this.usersRepo.findOne({ where: { id: userId } })
		if (!user) throw new NotFoundException("User not found")
		user.name = dto.name
		return this.usersRepo.save(user)
	}
}
