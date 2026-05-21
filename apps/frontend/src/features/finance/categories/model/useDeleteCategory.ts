import { useMutation, useQueryClient } from "@tanstack/react-query"
import { categoriesApi } from "@/shared/api/finance/categories"
import { toast } from "sonner"
import type { Category } from "@/entities/finance/category/model/types"

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onMutate: (id) => {
      const previousCategories = queryClient.getQueryData<Category[]>([
        "categories",
      ])

      queryClient.setQueryData<Category[]>(
        ["categories"],
        (old) => old?.filter((c) => c.id !== id) ?? []
      )

      return { previousCategories }
    },
    onSuccess: ({ data }) => {
      toast.success(`Категория ${data.name} удалена`)
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
