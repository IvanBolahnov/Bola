import { IsEnum, IsString, IsOptional } from "class-validator"
import { TransactionTypeEnum } from "../../enums/transaction-type.enum"

export class CreateCategoryDto {
	@IsString()
	name!: string

	@IsEnum(TransactionTypeEnum)
	type!: TransactionTypeEnum

	@IsString()
	@IsOptional()
	icon?: string

	@IsString()
	@IsOptional()
	color?: string
}
