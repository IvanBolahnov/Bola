import { Controller, Get, Query, UseGuards, Req } from "@nestjs/common"
import { AnalyticsService } from "./analytics.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { UserRequest } from "../../common/types/UserRequest.type"

@Controller("finance/analytics")
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
	constructor(private analyticsService: AnalyticsService) {}

	// Суммарная статистика по доходам, расходам и балансу за период
	@Get("summary")
	getSummary(
		@Req() req: UserRequest,
		@Query("dateFrom") dateFrom: string,
		@Query("dateTo") dateTo: string
	) {
		return this.analyticsService.getSummary(req.user.id, dateFrom, dateTo)
	}

	@Get("by-category")
	getByCategory(
		@Req() req: UserRequest,
		@Query("dateFrom") dateFrom: string,
		@Query("dateTo") dateTo: string
	) {
		return this.analyticsService.getByCategory(req.user.id, dateFrom, dateTo)
	}

	@Get("balance-history")
	getBalanceHistory(
		@Req() req: UserRequest,
		@Query("dateFrom") dateFrom: string,
		@Query("dateTo") dateTo: string
	) {
		return this.analyticsService.getBalanceHistory(
			req.user.id,
			dateFrom,
			dateTo
		)
	}
}
