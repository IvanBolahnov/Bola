import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Wallet } from "./entities/wallet.entity"
import { Category } from "./entities/category.entity"
import { Transaction } from "./entities/transaction.entity"
import { RecurringTransaction } from "./entities/recurring-transaction.entity"
import { Budget } from "./entities/budget.entity"
import { WalletsService } from "./wallets/wallets.service"
import { WalletsController } from "./wallets/wallets.controller"
import { CategoriesService } from "./categories/categories.service"
import { CategoriesController } from "./categories/categories.controller"
import { TransactionsService } from "./transactions/transactions.service"
import { TransactionsController } from "./transactions/transactions.controller"
import { RecurringService } from "./recurring/recurring.service"
import { RecurringController } from "./recurring/recurring.controller"
import { AnalyticsService } from "./analytics/analytics.service"
import { AnalyticsController } from "./analytics/analytics.controller"

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Wallet,
			Category,
			Transaction,
			RecurringTransaction,
			Budget
		])
	],
	providers: [
		WalletsService,
		CategoriesService,
		TransactionsService,
		RecurringService,
		AnalyticsService
	],
	controllers: [
		WalletsController,
		CategoriesController,
		TransactionsController,
		RecurringController,
		AnalyticsController
	]
})
export class FinanceModule {}
