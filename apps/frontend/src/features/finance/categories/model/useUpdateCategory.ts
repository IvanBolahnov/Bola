import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  categoriesApi,
  type UpdateCategoryPayload,
} from "@/shared/api/finance/categories"
import { toast } from "sonner"

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateCategoryPayload }) =>
      categoriesApi.updateCategory(payload.id, payload.data),
    onSuccess: ({ data }) => {
      toast.success(`Категория ${data.name} изменена`)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: () => {
      toast.success(`Не удалось изменить категорию`)
    },
  })
}
