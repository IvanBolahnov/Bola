import {
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { RecurringTransaction } from "../entities/recurring-transaction.entity"
import { CreateRecurringDto } from "../dto/recurring-transaction/create-recurring.dto"
import { UpdateRecurringDto } from "../dto/recurring-transaction/update-recurring.dto"
import { RecurringIntervalEnum } from "../enums/recurring-interval.enum"
import { TransactionsService } from "../transactions/transactions.service"
import { GetRecurringTransactionsDto } from "../dto/recurring-transaction/get-recurring.dto"
import { Transaction } from "../entities/transaction.entity"

@Injectable()
export class RecurringService {
	constructor(
		@InjectRepository(RecurringTransaction)
		private recurringRepo: Repository<RecurringTransaction>,
		@Inject(forwardRef(() => TransactionsService))
		private transactionsService: TransactionsService
	) {}

	async create(userId: string, dto: CreateRecurringDto) {
		const nextDate = new Date(dto.startDate)
		const recurring = this.recurringRepo.create({ ...dto, userId, nextDate })
		return this.recurringRepo.save(recurring)
	}

	async findAll(userId: string, dto: GetRecurringTransactionsDto) {
		const qb = this.recurringRepo
			.createQueryBuilder("r")
			.leftJoinAndSelect("r.category", "category")
			.leftJoinAndSelect("r.wallet", "wallet")
			.where("r.userId = :userId", { userId })
			.andWhere("r.isActive = true")

		if (dto.type) qb.andWhere("r.type = :type", { type: dto.type })
		if (dto.walletId) {
			qb.andWhere("r.walletId = :walletId", {
				walletId: dto.walletId
			})
		}
		if (dto.categoryId)
			qb.andWhere("r.categoryId = :categoryId", { categoryId: dto.categoryId })

		const page = dto.page ?? 1
		const limit = dto.limit ?? 20

		qb.orderBy("r.nextDate", "DESC")
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

	async update(userId: string, id: string, dto: UpdateRecurringDto) {
		const recurring = await this.findOneOrFail(userId, id)
		Object.assign(recurring, dto)
		return this.recurringRepo.save(recurring)
	}

	async remove(userId: string, id: string) {
		const recurring = await this.findOneOrFail(userId, id)
		recurring.isActive = false
		await this.recurringRepo.save(recurring)
		return recurring
	}

	async findOneOrFail(userId: string, id: string) {
		const recurring = await this.recurringRepo.findOne({
			where: { userId, id }
		})
		if (!recurring)
			throw new NotFoundException("Recurring transaction not found")
		return recurring
	}

	/** Обрабатывает повторяющиеся транзакции (подписки), возвращает список созданных транзакций */
	async processRecurring(userId: string) {
		const now = new Date()
		const due = await this.recurringRepo.find({
			where: { isActive: true, userId }
		})

		const transactions: Transaction[] = []
		for (const r of due.filter((r) => r.nextDate <= now)) {
			while (r.nextDate <= now) {
				transactions.push(
					await this.transactionsService.create(r.userId, {
						title: r.title,
						type: r.type,
						amount: Number(r.amount),
						walletId: r.walletId,
						categoryId: r.categoryId ?? undefined,
						date: r.nextDate.toISOString()
					})
				)

				r.nextDate = this.calculateNextDate(r.nextDate, r.interval)
				await this.recurringRepo.save(r)
			}
		}

		return transactions
	}

	private calculateNextDate(from: Date, interval: RecurringIntervalEnum): Date {
		const next = new Date(from)
		switch (interval) {
			case RecurringIntervalEnum.DAILY:
				next.setDate(next.getDate() + 1)
				break
			case RecurringIntervalEnum.WEEKLY:
				next.setDate(next.getDate() + 7)
				break
			case RecurringIntervalEnum.MONTHLY:
				next.setMonth(next.getMonth() + 1)
				break
			case RecurringIntervalEnum.YEARLY:
				next.setFullYear(next.getFullYear() + 1)
				break
		}
		return next
	}
}
