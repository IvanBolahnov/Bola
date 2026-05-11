import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	UseGuards,
	Req,
	HttpCode,
	HttpStatus,
	Query
} from "@nestjs/common"
import { RecurringService } from "./recurring.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { CreateRecurringDto } from "../dto/recurring-transaction/create-recurring.dto"
import { UpdateRecurringDto } from "../dto/recurring-transaction/update-recurring.dto"
import { UserRequest } from "../../common/types/UserRequest.type"
import { GetRecurringTransactionsDto } from "../dto/recurring-transaction/get-recurring.dto"

@Controller("finance/recurring")
@UseGuards(JwtAuthGuard)
export class RecurringController {
	constructor(private recurringService: RecurringService) {}

	@Post()
	create(@Req() req: UserRequest, @Body() dto: CreateRecurringDto) {
		return this.recurringService.create(req.user.id, dto)
	}

	@Get()
	findAll(@Req() req: UserRequest, @Query() dto: GetRecurringTransactionsDto) {
		return this.recurringService.findAll(req.user.id, dto)
	}

	@Patch(":id")
	update(
		@Req() req: UserRequest,
		@Param("id") id: string,
		@Body() dto: UpdateRecurringDto
	) {
		return this.recurringService.update(req.user.id, id, dto)
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Req() req: UserRequest, @Param("id") id: string) {
		return this.recurringService.remove(req.user.id, id)
	}
}
