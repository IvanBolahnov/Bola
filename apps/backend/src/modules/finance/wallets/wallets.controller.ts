import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	UseGuards,
	Req
} from "@nestjs/common"
import { WalletsService } from "./wallets.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { CreateWalletDto } from "../dto/wallet/create-wallet.dto"
import { UpdateWalletDto } from "../dto/wallet/update-wallet.dto"
import { UserRequest } from "../../common/types/user-request.type"
import { FindWalletParams } from "../dto/wallet/find-wallet.dto"

@Controller("finance/wallets")
@UseGuards(JwtAuthGuard)
export class WalletsController {
	constructor(private walletsService: WalletsService) {}

	@Post()
	create(@Req() req: UserRequest, @Body() dto: CreateWalletDto) {
		return this.walletsService.create(req.user.id, dto)
	}

	@Get()
	findAll(@Req() req: UserRequest) {
		return this.walletsService.findAll(req.user.id)
	}

	@Get(":id")
	findOne(@Req() req: UserRequest, @Param() params: FindWalletParams) {
		return this.walletsService.findOneOrFail(req.user.id, params.id)
	}

	@Patch(":id")
	update(
		@Req() req: UserRequest,
		@Param("id") id: string,
		@Body() dto: UpdateWalletDto
	) {
		return this.walletsService.update(req.user.id, id, dto)
	}

	@Delete(":id")
	remove(@Req() req: UserRequest, @Param("id") id: string) {
		return this.walletsService.remove(req.user.id, id)
	}
}
