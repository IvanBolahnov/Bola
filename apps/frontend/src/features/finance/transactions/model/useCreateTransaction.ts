import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  transactionsApi,
  type CreateTransactionPayload,
} from "@/shared/api/finance/transactions"
import { toast } from "sonner"

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionPayload) =>
      transactionsApi.createTransaction(data),
    onSuccess: ({ data }) => {
      toast.success(`Перевод ${data.title} создан`)
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["wallets", data.walletId] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
      if (data.toWalletId) {
        queryClient.invalidateQueries({
          queryKey: ["wallets", data.toWalletId],
        })
      }
    },
    onError: () => {
      toast.success(`Не удалось создать перевод`)
    },
  })
}
