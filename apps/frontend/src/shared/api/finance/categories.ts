import { apiInstance } from "../instance"
import type {
  Category,
  CategoryIcons,
  CategoryTypeEnum,
} from "@/entities/finance/category/model/types"

export interface CreateCategoryPayload {
  name: string
  type: CategoryTypeEnum
  icon?: keyof typeof CategoryIcons
  color?: string
}

export interface UpdateCategoryPayload {
  name?: string
  type?: CategoryTypeEnum
  icon?: keyof typeof CategoryIcons
  color?: string
}

export const categoriesApi = {
  getAll: () => apiInstance.get<Category[]>("/finance/categories"),
  create: (data: CreateCategoryPayload) =>
    apiInstance.post<Category>("/finance/categories", data),
  update: (id: string, data: UpdateCategoryPayload) =>
    apiInstance.patch<Category>(`/finance/categories/${id}`, data),
  delete: (id: string) =>
    apiInstance.delete<Category>(`/finance/categories/${id}`),
}
