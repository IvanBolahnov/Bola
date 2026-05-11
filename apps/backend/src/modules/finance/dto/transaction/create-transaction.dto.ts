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

export class CreateTransactionDto {
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
		(o: CreateTransactionDto) => o.type === TransactionTypeEnum.TRANSFER
	)
	@IsUUID()
	toWalletId?: string

	@IsUUID()
	@IsOptional()
	categoryId?: string

	@IsString()
	@IsOptional()
	note?: string

	@IsDateString()
	@IsOptional()
	date?: string
}
