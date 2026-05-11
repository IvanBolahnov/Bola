import { useQuery } from "@tanstack/react-query"
import {
  transactionsApi,
  type GetRecurringTransactionsParams,
} from "@/shared/api/finance/transactions"
import { useAuthStore } from "@/entities/user/model/authStore"
import { AxiosError } from "axios"
import type { RecurringTransaction } from "@/entities/finance/transactions/model/types"

export function useGetRecurringTransactions(
  params?: GetRecurringTransactionsParams
) {
  return useQuery<
    {
      items: RecurringTransaction[]
      total: number
      page: number
      limit: number
      pages: number
    },
    { message: string; status: number }
  >({
    queryFn: async () => {
      try {
        const response = await transactionsApi.getRecurringTransactions(params)
        return response.data
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            throw {
              message: "Подписки не найдены",
              status: 404,
            }
          }

          if (error.response?.status === 403) {
            throw {
              message: "Нет доступа к подпискам",
              status: 403,
            }
          }

          throw {
            message:
              error.response?.data?.message || "Ошибка загрузки подписок",
            status: error.response?.status || 500,
          }
        }

        throw {
          message: "Непредвиденная ошибка загрузки подписок",
          status: 500,
        }
      }
    },
    queryKey: ["recurring", params],
    enabled: useAuthStore.getState().isAuthenticated,
  })
}
