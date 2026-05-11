import { IsUUID, IsNotEmpty } from "class-validator"

export class FindWalletParams {
	@IsNotEmpty()
	@IsUUID()
	id!: string
}
