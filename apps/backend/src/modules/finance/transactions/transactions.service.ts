import {
	Injectable,
	NotFoundException,
	BadRequestException,
	Inject,
	forwardRef
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Transaction } from "../entities/transaction.entity"
import { Wallet } from "../entities/wallet.entity"
import { CreateTransactionDto } from "../dto/transaction/create-transaction.dto"
import { UpdateTransactionDto } from "../dto/transaction/update-transaction.dto"
import { GetTransactionsDto } from "../dto/transaction/get-transactions.dto"
import { TransactionTypeEnum } from "../enums/transaction-type.enum"
import { WalletsService } from "../wallets/wallets.service"
import { RecurringService } from "../recurring/recurring.service"

@Injectable()
export class TransactionsService {
	constructor(
		@InjectRepository(Transaction)
		private transactionsRepo: Repository<Transaction>,
		@InjectRepository(Wallet)
		private walletsRepo: Repository<Wallet>,
		private walletsService: WalletsService,
		@Inject(forwardRef(() => RecurringService))
		private recurringService: RecurringService
	) {}

	async create(userId: string, dto: CreateTransactionDto) {
		if (dto.type === TransactionTypeEnum.TRANSFER && !dto.toWalletId) {
			throw new BadRequestException("toWalletId is required for transfer")
		}

		const wallet = await this.walletsService.findOneOrFail(userId, dto.walletId)

		if (
			dto.type === TransactionTypeEnum.EXPENSE ||
			dto.type === TransactionTypeEnum.TRANSFER
		) {
			wallet.balance = Number(wallet.balance) - Number(dto.amount)
			await this.walletsRepo.save(wallet)
		}

		if (dto.type === TransactionTypeEnum.INCOME) {
			wallet.balance = Number(wallet.balance) + Number(dto.amount)
			await this.walletsRepo.save(wallet)
		}

		if (dto.type === TransactionTypeEnum.TRANSFER && dto.toWalletId) {
			const toWallet = await this.walletsService.findOneOrFail(
				userId,
				dto.toWalletId
			)
			toWallet.balance = Number(toWallet.balance) + Number(dto.amount)
			await this.walletsRepo.save(toWallet)
		}

		const transaction = this.transactionsRepo.create({ ...dto, userId })
		return this.transactionsRepo.save(transaction)
	}

	async findAll(userId: string, dto: GetTransactionsDto) {
		await this.recurringService.processRecurring(userId)
		const qb = this.transactionsRepo
			.createQueryBuilder("t")
			.leftJoinAndSelect("t.category", "category")
			.leftJoinAndSelect("t.wallet", "wallet")
			.where("t.userId = :userId", { userId })

		if (dto.type) qb.andWhere("t.type = :type", { type: dto.type })
		if (dto.walletId) {
			qb.andWhere("(t.walletId = :walletId OR t.toWalletId = :walletId)", {
				walletId: dto.walletId
			})
		}
		if (dto.categoryId)
			qb.andWhere("t.categoryId = :categoryId", { categoryId: dto.categoryId })
		if (dto.dateFrom && dto.dateTo) {
			qb.andWhere("t.date BETWEEN :from AND :to", {
				from: dto.dateFrom,
				to: dto.dateTo
			})
		}

		const page = dto.page ?? 1
		const limit = dto.limit ?? 20

		qb.orderBy("t.date", "DESC")
			.skip((page - 1) * limit)
			.take(limit)

		const [items, total] = await qb.getManyAndCount()

		return {
			items,
			total,
			page,
			limit,
			pages: Math.ceil(total / limit)
		}
	}

	async update(userId: string, id: string, dto: UpdateTransactionDto) {
		const transaction = await this.findOneOrFail(userId, id)
		Object.assign(transaction, dto)
		return this.transactionsRepo.save(transaction)
	}

	async remove(userId: string, id: string) {
		const transaction = await this.findOneOrFail(id, userId)

		const wallet = await this.walletsRepo.findOne({
			where: { id: transaction.walletId }
		})

		if (wallet) {
			if (
				transaction.type === TransactionTypeEnum.EXPENSE ||
				transaction.type === TransactionTypeEnum.TRANSFER
			) {
				wallet.balance = Number(wallet.balance) + Number(transaction.amount)
			} else if (transaction.type === TransactionTypeEnum.INCOME) {
				wallet.balance = Number(wallet.balance) - Number(transaction.amount)
			}
			await this.walletsRepo.save(wallet)
		}

		await this.transactionsRepo.remove(transaction)
	}

	async findOneOrFail(userId: string, id: string) {
		const transaction = await this.transactionsRepo.findOne({
			where: { userId, id }
		})
		if (!transaction) throw new NotFoundException("Transaction not found")
		return transaction
	}
}
