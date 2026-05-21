import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Category } from "../entities/category.entity"
import { CreateCategoryDto } from "../dto/category/create-category.dto"
import { UpdateCategoryDto } from "../dto/category/update-category.dto"

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private categoriesRepo: Repository<Category>
	) {}

	async create(userId: string, dto: CreateCategoryDto) {
		const category = this.categoriesRepo.create({ ...dto, userId })
		return this.categoriesRepo.save(category)
	}

	async findAll(userId: string) {
		return this.categoriesRepo.find({
			where: { userId },
			order: { name: "ASC" }
		})
	}

	async update(userId: string, id: string, dto: UpdateCategoryDto) {
		const category = await this.findOneOrFail(userId, id)
		Object.assign(category, dto)
		return this.categoriesRepo.save(category)
	}

	async remove(userId: string, id: string) {
		const category = await this.findOneOrFail(userId, id)
		await this.categoriesRepo.remove(category)
		return category
	}

	async findOneOrFail(userId: string, id: string) {
		const category = await this.categoriesRepo.findOne({
			where: { userId, id }
		})
		if (!category) throw new NotFoundException("Category not found")
		return category
	}
}
