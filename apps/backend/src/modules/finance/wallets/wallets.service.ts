import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Wallet } from "../entities/wallet.entity"
import { CreateWalletDto } from "../dto/wallet/create-wallet.dto"
import { UpdateWalletDto } from "../dto/wallet/update-wallet.dto"

@Injectable()
export class WalletsService {
	constructor(
		@InjectRepository(Wallet)
		private walletsRepo: Repository<Wallet>
	) {}

	async create(userId: string, dto: CreateWalletDto) {
		const wallet = this.walletsRepo.create({ ...dto, userId })
		return this.walletsRepo.save(wallet)
	}

	async findAll(userId: string) {
		return this.walletsRepo.find({
			where: { userId, isActive: true },
			order: { createdAt: "ASC" }
		})
	}

	async findOneOrFail(userId: string, id: string) {
		const wallet = await this.walletsRepo.findOne({ where: { id, userId } })
		if (!wallet) throw new NotFoundException("Wallet not found")
		return wallet
	}

	async update(userId: string, id: string, dto: UpdateWalletDto) {
		const wallet = await this.findOneOrFail(userId, id)
		Object.assign(wallet, dto)
		return this.walletsRepo.save(wallet)
	}

	async remove(userId: string, id: string) {
		const wallet = await this.findOneOrFail(userId, id)
		wallet.isActive = false
		await this.walletsRepo.save(wallet)
		return wallet
	}
}
