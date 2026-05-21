import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  categoriesApi,
  type UpdateCategoryPayload,
} from "@/shared/api/finance/categories"
import { toast } from "sonner"
import type { Category } from "@/entities/finance/category/model/types"

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateCategoryPayload }) =>
      categoriesApi.update(payload.id, payload.data),
    onMutate: (payload) => {
      const previousCategories = queryClient.getQueryData<Category[]>([
        "categories",
      ])

      queryClient.setQueryData<Category[]>(
        ["categories"],
        (old) =>
          old?.map((c) =>
            c.id !== payload.id ? c : { ...c, ...payload.data }
          ) ?? []
      )

      return { previousCategories }
    },
    onSuccess: ({ data }) => {
      toast.success(`Категория ${data.name} изменена`)
    },
    onError: (_error, _payload, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories)
      }
      toast.success(`Не удалось изменить категорию`)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
