import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { transactionsApi } from "@/shared/api/finance/transactions"
import type { RecurringTransaction } from "@/entities/finance/transactions/model/types"

export function useDeleteRecurringTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionsApi.deleteRecurring(id),
    onMutate: (id) => {
      // Находим все кэши с ключом начинающимся на "recurring"
      const previousData = queryClient.getQueriesData({
        queryKey: ["recurring"],
      })

      queryClient.setQueriesData<{
        items: RecurringTransaction[]
        total: number
        page: number
        limit: number
        pages: number
      }>({ queryKey: ["recurring"] }, (old) =>
        old
          ? {
              ...old,
              items: old.items.filter((r) => r.id !== id),
              total: old.total - 1,
            }
          : old
      )

      return { previousData }
    },
    onSuccess: ({ data }) => {
      toast.success(`Подписка ${data.title} удалена`)
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: (_error, _payload, context) => {
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toast.success(`Не удалось удалить подписку`)
      queryClient.invalidateQueries({ queryKey: ["recurring"] })
    },
  })
}
