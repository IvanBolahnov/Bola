import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  transactionsApi,
  type CreateRecurringTransactionPayload,
} from "@/shared/api/finance/transactions"
import { toast } from "sonner"

export function useCreateRecurringTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRecurringTransactionPayload) =>
      transactionsApi.createRecurringTransaction(data),
    onSuccess: async ({ data }) => {
      toast.success(`Подписка ${data.title} создана`)
      queryClient.invalidateQueries({ queryKey: ["recurring"] })
      await queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
    },
    onError: () => {
      toast.success(`Не удалось создать Подписку`)
    },
  })
}
