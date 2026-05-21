import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  transactionsApi,
  type UpdateTransactionPayload,
} from "@/shared/api/finance/transactions"
import type { Transaction } from "@/entities/finance/transactions/model/types"

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateTransactionPayload }) =>
      transactionsApi.update(payload.id, payload.data),
    onMutate: (payload) => {
      const previousData = queryClient.getQueriesData({
        queryKey: ["transactions"],
      })

      queryClient.setQueriesData<{
        items: Transaction[]
        total: number
        page: number
        limit: number
        pages: number
      }>({ queryKey: ["transactions"] }, (old) =>
        old
          ? {
              ...old,
              items: old.items.map((r) =>
                r.id !== payload.id
                  ? r
                  : {
                      ...r,
                      ...payload.data,
                      date: payload.data.date?.toISOString() ?? r.date,
                    }
              ),
            }
          : old
      )

      return { previousData }
    },
    onSuccess: ({ data }) => {
      toast.success(`Транзакция ${data.title} изменена`)
    },
    onError: (_error, _payload, context) => {
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toast.success(`Не удалось изменить транзакцию`)
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
