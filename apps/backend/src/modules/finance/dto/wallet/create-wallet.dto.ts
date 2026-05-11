import { IsEnum, IsString, IsOptional, IsNumber, Min } from "class-validator"
import { WalletTypeEnum } from "../../enums/wallet-type.enum"
import { CurrencyEnum } from "../../enums/currency.enum"

export class CreateWalletDto {
	@IsString()
	name!: string

	@IsEnum(WalletTypeEnum)
	type!: WalletTypeEnum

	@IsEnum(CurrencyEnum)
	@IsOptional()
	currency?: CurrencyEnum

	@IsNumber()
	@Min(0)
	@IsOptional()
	balance?: number

	@IsString()
	@IsOptional()
	description?: string
}
