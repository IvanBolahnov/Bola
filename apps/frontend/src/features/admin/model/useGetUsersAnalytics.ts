import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/entities/user/model/authStore"
import { AxiosError } from "axios"
import { adminApi } from "@/shared/api/admin"
import type { UsersAndSessionsAnalytics } from "../types/usersAnalytics.type"

export function useGetUsersAnalytics() {
  return useQuery<
    UsersAndSessionsAnalytics,
    { message: string; status: number }
  >({
    queryFn: async () => {
      try {
        const response = await adminApi.users.getAnalytics()
        return response.data
      } catch (error: unknown) {
        // Обработка разных типов ошибок
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            throw {
              message: "Аналитика не найдена",
              status: 404,
            }
          }

          if (error.response?.status === 403) {
            throw {
              message: "Нет доступа к аналитике",
              status: 403,
            }
          }

          throw {
            message:
              error.response?.data?.message || "Ошибка загрузки аналитики",
            status: error.response?.status || 500,
          }
        }

        throw {
          message: "Непредвиденная ошибка загрузки аналитики",
          status: 500,
        }
      }
    },
    queryKey: ["usersAnalytics"],
    enabled: useAuthStore.getState().isAuthenticated,
  })
}
