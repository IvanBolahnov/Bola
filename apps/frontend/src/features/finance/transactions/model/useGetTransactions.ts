import { useQuery } from "@tanstack/react-query"
import {
  transactionsApi,
  type GetTransactionsParams,
} from "@/shared/api/finance/transactions"
import { useAuthStore } from "@/entities/user/model/authStore"
import { AxiosError } from "axios"
import type { Transaction } from "@/entities/finance/transactions/model/types"

export function useGetTransactions(params?: GetTransactionsParams) {
  return useQuery<
    {
      items: Transaction[]
      total: number
      page: number
      limit: number
      pages: number
    },
    { message: string; status: number }
  >({
    queryFn: async () => {
      try {
        const response = await transactionsApi.getTransactions(params)
        return response.data
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            throw {
              message: "Транзакции не найдены",
              status: 404,
            }
          }

          if (error.response?.status === 403) {
            throw {
              message: "Нет доступа к транзакциям",
              status: 403,
            }
          }

          throw {
            message:
              error.response?.data?.message || "Ошибка загрузки транзакций",
            status: error.response?.status || 500,
          }
        }

        throw {
          message: "Непредвиденная ошибка загрузки транзакций",
          status: 500,
        }
      }
    },
    queryKey: ["transactions", params],
    enabled: useAuthStore.getState().isAuthenticated,
  })
}
