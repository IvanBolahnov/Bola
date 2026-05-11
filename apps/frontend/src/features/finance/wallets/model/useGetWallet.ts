import { useQuery } from "@tanstack/react-query"
import { walletsApi } from "@/shared/api/finance/wallets"
import { useAuthStore } from "@/entities/user/model/authStore"
import { AxiosError } from "axios"
import type { Wallet } from "@/entities/finance/wallet/model/types"

export function useGetWallet(id: string) {
  return useQuery<Wallet, { message: string; status: number }>({
    queryFn: async () => {
      try {
        const response = await walletsApi.get(id)
        return response.data
      } catch (error: unknown) {
        // Обработка разных типов ошибок
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            throw {
              message: "Кошелек не найден",
              status: 404,
            }
          }

          if (error.response?.status === 403) {
            throw {
              message: "Нет доступа к кошельку",
              status: 403,
            }
          }

          throw {
            message:
              error.response?.data?.message || "Ошибка загрузки кошелька",
            status: error.response?.status || 500,
          }
        }

        throw {
          message: "Непредвиденная ошибка загрузки кошелька",
          status: 500,
        }
      }
    },
    queryKey: ["wallets", id],
    enabled: useAuthStore.getState().isAuthenticated && !!id,
  })
}
