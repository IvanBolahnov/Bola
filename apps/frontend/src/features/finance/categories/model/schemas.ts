import {
  CategoryIcons,
  CategoryTypes,
} from "@/entities/finance/category/model/types"
import { z } from "zod"

const categoryIconKeys = Object.keys(CategoryIcons) as [
  keyof typeof CategoryIcons,
  ...Array<keyof typeof CategoryIcons>,
]

export const CategorySchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
  type: z.enum(Object.values(CategoryTypes), "Выберите тип счёта"),
  icon: z.enum(categoryIconKeys).optional(),
})

export type CategoryFormData = z.infer<typeof CategorySchema>
