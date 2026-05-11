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
	HttpStatus
} from "@nestjs/common"
import { CategoriesService } from "./categories.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { CreateCategoryDto } from "../dto/category/create-category.dto"
import { UpdateCategoryDto } from "../dto/category/update-category.dto"
import { UserRequest } from "../../common/types/UserRequest.type"

@Controller("finance/categories")
@UseGuards(JwtAuthGuard)
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	@Post()
	create(@Req() req: UserRequest, @Body() dto: CreateCategoryDto) {
		return this.categoriesService.create(req.user.id, dto)
	}

	@Get()
	findAll(@Req() req: UserRequest) {
		return this.categoriesService.findAll(req.user.id)
	}

	@Patch(":id")
	update(
		@Req() req: UserRequest,
		@Param("id") id: string,
		@Body() dto: UpdateCategoryDto
	) {
		return this.categoriesService.update(req.user.id, id, dto)
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Req() req: UserRequest, @Param("id") id: string) {
		return this.categoriesService.remove(req.user.id, id)
	}
}
