import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  transactionsApi,
  type UpdateRecurringTransactionPayload,
} from "@/shared/api/finance/transactions"
import type { RecurringTransaction } from "@/entities/finance/transactions/model/types"

export function useUpdateRecurringTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      id: string
      data: UpdateRecurringTransactionPayload
    }) => transactionsApi.updateRecurring(payload.id, payload.data),
    onMutate: (payload) => {
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
              items: old.items.map((r) =>
                r.id !== payload.id
                  ? r
                  : {
                      ...r,
                      ...payload.data,
                      startDate:
                        payload.data.startDate?.toISOString() ?? r.startDate,
                      endDate: payload.data.endDate?.toISOString() ?? r.endDate,
                    }
              ),
            }
          : old
      )

      return { previousData }
    },
    onSuccess: ({ data }) => {
      toast.success(`Подписка ${data.title} изменена`)
    },
    onError: (_error, _payload, context) => {
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toast.success(`Не удалось изменить подписку`)
      queryClient.invalidateQueries({ queryKey: ["recurring"] })
    },
  })
}
