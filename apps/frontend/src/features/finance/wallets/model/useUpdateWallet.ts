import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  walletsApi,
  type UpdateWalletPayload,
} from "@/shared/api/finance/wallets"
import { toast } from "sonner"
import type { Wallet } from "@/entities/finance/wallet/model/types"

export function useUpdateWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateWalletPayload }) =>
      walletsApi.update(payload.id, payload.data),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["wallets"] })

      const previousWallets = queryClient.getQueryData<Wallet[]>(["wallets"])
      const previousWallet = queryClient.getQueryData<Wallet>([
        "wallets",
        payload.id,
      ])

      queryClient.setQueryData<Wallet[]>(
        ["wallets"],
        (old) =>
          old?.map((w) =>
            w.id !== payload.id ? w : { ...w, ...payload.data }
          ) ?? []
      )
      queryClient.setQueryData<Wallet>(["wallets", payload.id], (old) =>
        old ? { ...old, ...payload.data } : old
      )

      return { previousWallets, previousWallet }
    },
    onSuccess: ({ data }) => {
      toast.success(`Счет ${data.name} изменен`)
    },
    onError: (_error, payload, context) => {
      if (context?.previousWallets) {
        queryClient.setQueryData(["wallets"], context.previousWallets)
      }
      if (context?.previousWallet) {
        queryClient.setQueryData(
          ["wallets", payload.id],
          context.previousWallet
        )
      }
      toast.error(`Не удалось создать счет`)
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
    },
  })
}
