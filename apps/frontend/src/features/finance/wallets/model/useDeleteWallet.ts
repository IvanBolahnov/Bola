import { useMutation, useQueryClient } from "@tanstack/react-query"
import { walletsApi } from "@/shared/api/finance/wallets"
import { toast } from "sonner"
import type { Wallet } from "@/entities/finance/wallet/model/types"

export function useDeleteWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (wallet: Wallet) => walletsApi.delete(wallet.id),
    onMutate: async (wallet) => {
      // Отменяем текущие запросы чтобы не перезаписали оптимистичное обновление
      await queryClient.cancelQueries({ queryKey: ["wallets"] })

      // Сохраняем текущее состояние для отката
      const previousWallets = queryClient.getQueryData<Wallet[]>(["wallets"])

      // Оптимистично убираем счёт из кэша
      queryClient.setQueryData<Wallet[]>(
        ["wallets"],
        (old) => old?.filter((w) => w.id !== wallet.id) ?? []
      )

      return { previousWallets }
    },
    onSuccess: ({ data }) => {
      toast.success(`Счёт ${data.name} удален`)
    },
    onError: (_error, _wallet, context) => {
      if (context?.previousWallets) {
        queryClient.setQueryData(["wallets"], context.previousWallets)
      }
      toast.error(`Не удалось удалить счёт`)
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
    },
  })
}
