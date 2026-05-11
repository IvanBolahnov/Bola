import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  categoriesApi,
  type CreateCategoryPayload,
} from "@/shared/api/finance/categories"
import { toast } from "sonner"

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryPayload) =>
      categoriesApi.createCategory(data),
    onSuccess: ({ data }) => {
      toast.success(`Категория ${data.name} создана`)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: () => {
      toast.success(`Не удалось создать категорию`)
    },
  })
}
