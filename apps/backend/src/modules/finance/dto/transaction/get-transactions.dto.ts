import {
	IsEnum,
	IsOptional,
	IsUUID,
	IsDateString,
	IsInt,
	Min,
	Max
} from "class-validator"
import { Type } from "class-transformer"
import { TransactionTypeEnum } from "../../enums/transaction-type.enum"

export class GetTransactionsDto {
	@IsOptional()
	@IsEnum(TransactionTypeEnum)
	type?: TransactionTypeEnum

	@IsOptional()
	@IsUUID()
	walletId?: string

	@IsOptional()
	@IsUUID()
	categoryId?: string

	@IsOptional()
	@IsDateString()
	dateFrom?: string

	@IsOptional()
	@IsDateString()
	dateTo?: string

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number = 1

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	limit?: number = 50
}
