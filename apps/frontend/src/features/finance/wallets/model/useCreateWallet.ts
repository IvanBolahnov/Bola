import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  walletsApi,
  type CreateWalletPayload,
} from "@/shared/api/finance/wallets"
import { toast } from "sonner"

export function useCreateWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWalletPayload) => walletsApi.create(data),
    onSuccess: ({ data }) => {
      toast.success(`Счет ${data.name} создан`)
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
    },
    onError: () => {
      toast.error(`Не удалось создать счет`)
    },
  })
}
