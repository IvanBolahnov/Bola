import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	Query,
	UseGuards,
	Req,
	HttpCode,
	HttpStatus
} from "@nestjs/common"
import { TransactionsService } from "./transactions.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { CreateTransactionDto } from "../dto/transaction/create-transaction.dto"
import { UpdateTransactionDto } from "../dto/transaction/update-transaction.dto"
import { GetTransactionsDto } from "../dto/transaction/get-transactions.dto"
import { UserRequest } from "../../common/types/UserRequest.type"

@Controller("finance/transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
	constructor(private transactionsService: TransactionsService) {}

	@Post()
	create(@Req() req: UserRequest, @Body() dto: CreateTransactionDto) {
		return this.transactionsService.create(req.user.id, dto)
	}

	@Get()
	findAll(@Req() req: UserRequest, @Query() dto: GetTransactionsDto) {
		return this.transactionsService.findAll(req.user.id, dto)
	}

	@Patch(":id")
	update(
		@Req() req: UserRequest,
		@Param("id") id: string,
		@Body() dto: UpdateTransactionDto
	) {
		return this.transactionsService.update(req.user.id, id, dto)
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Req() req: UserRequest, @Param("id") id: string) {
		return this.transactionsService.remove(req.user.id, id)
	}
}
