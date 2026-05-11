import {
	IsEnum,
	IsString,
	IsOptional,
	IsNumber,
	IsUUID,
	IsDateString,
	Min,
	ValidateIf
} from "class-validator"
import { TransactionTypeEnum } from "../../enums/transaction-type.enum"
import { RecurringIntervalEnum } from "../../enums/recurring-interval.enum"

export class CreateRecurringDto {
	@IsString()
	title!: string

	@IsEnum(TransactionTypeEnum)
	type!: TransactionTypeEnum

	@IsNumber()
	@Min(0.01)
	amount!: number

	@IsUUID()
	walletId!: string

	// обязателен только для transfer
	@ValidateIf(
		(o: CreateRecurringDto) => o.type === TransactionTypeEnum.TRANSFER
	)
	@IsUUID()
	toWalletId?: string

	@IsUUID()
	@IsOptional()
	categoryId?: string

	@IsEnum(RecurringIntervalEnum)
	interval!: RecurringIntervalEnum

	@IsDateString()
	startDate!: string

	@IsDateString()
	@IsOptional()
	endDate?: string
}
