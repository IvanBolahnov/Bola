import { useQuery } from "@tanstack/react-query"
import { walletsApi } from "@/shared/api/finance/wallets"
import { useAuthStore } from "@/entities/user/model/authStore"

export function useGetWallets() {
  return useQuery({
    queryFn: () => walletsApi.getAll().then((res) => res.data),
    queryKey: ["wallets"],
    enabled: useAuthStore.getState().isAuthenticated,
  })
}
