import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, Between } from "typeorm"
import { Transaction } from "../entities/transaction.entity"
import { TransactionTypeEnum } from "../enums/transaction-type.enum"

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectRepository(Transaction)
		private transactionsRepo: Repository<Transaction>
	) {}

	async getSummary(userId: string, dateFrom: string, dateTo: string) {
		const transactions = await this.transactionsRepo.find({
			where: {
				userId,
				date: Between(new Date(dateFrom), new Date(dateTo)),
				wallet: {
					isActive: true
				}
			}
		})

		const income = transactions
			.filter((t) => t.type === TransactionTypeEnum.INCOME)
			.reduce((sum, t) => sum + Number(t.amount), 0)

		const expense = transactions
			.filter((t) => t.type === TransactionTypeEnum.EXPENSE)
			.reduce((sum, t) => sum + Number(t.amount), 0)

		return { income, expense, balance: income - expense }
	}

	async getByCategory(userId: string, dateFrom: string, dateTo: string) {
		return this.transactionsRepo
			.createQueryBuilder("t")
			.select("c.name", "category")
			.addSelect("c.color", "color")
			.addSelect("c.icon", "icon")
			.addSelect("SUM(t.amount)", "total")
			.addSelect("COUNT(t.id)", "count")
			.leftJoin("t.category", "c")
			.where("t.userId = :userId", { userId })
			.andWhere("t.type = :type", { type: TransactionTypeEnum.EXPENSE })
			.andWhere("t.date BETWEEN :dateFrom AND :dateTo", { dateFrom, dateTo })
			.groupBy("c.id")
			.addGroupBy("c.name")
			.addGroupBy("c.color")
			.addGroupBy("c.icon")
			.orderBy("total", "DESC")
			.getRawMany()
	}

	async getBalanceHistory(userId: string, dateFrom: string, dateTo: string) {
		return this.transactionsRepo
			.createQueryBuilder("t")
			.select(`DATE_TRUNC('day', t.date)`, "day")
			.addSelect(
				`SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END)`,
				"delta"
			)
			.where("t.userId = :userId", { userId })
			.andWhere(`t.type != 'transfer'`)
			.andWhere("t.date BETWEEN :dateFrom AND :dateTo", { dateFrom, dateTo })
			.groupBy(`DATE_TRUNC('day', t.date)`)
			.orderBy(`DATE_TRUNC('day', t.date)`, "ASC")
			.getRawMany()
	}
}
