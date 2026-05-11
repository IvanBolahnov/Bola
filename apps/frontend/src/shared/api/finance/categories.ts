import { apiInstance } from "../instance"
import type {
  Category,
  CategoryTypeEnum,
} from "@/entities/finance/category/model/types"

export interface CreateCategoryPayload {
  name: string
  type: CategoryTypeEnum
  icon?: string
  color?: string
}

export interface UpdateCategoryPayload {
  name?: string
  type?: CategoryTypeEnum
  icon?: string
  color?: string
}

export const categoriesApi = {
  getCategories: () => apiInstance.get<Category[]>("/finance/categories"),
  createCategory: (data: CreateCategoryPayload) =>
    apiInstance.post<Category>("/finance/categories", data),
  updateCategory: (id: string, data: UpdateCategoryPayload) =>
    apiInstance.patch<Category>(`/finance/categories/${id}`, data),
}
