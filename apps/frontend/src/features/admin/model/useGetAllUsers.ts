import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/entities/user/model/authStore"
import { AxiosError } from "axios"
import type { UserWithSessions } from "@/entities/user/model/types"
import { adminApi } from "@/shared/api/admin"

export function useGetAllUsers() {
  return useQuery<UserWithSessions[], { message: string; status: number }>({
    queryFn: async () => {
      try {
        const response = await adminApi.users.getAll()
        return response.data
      } catch (error: unknown) {
        // Обработка разных типов ошибок
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            throw {
              message: "Пользователи не найдены",
              status: 404,
            }
          }

          if (error.response?.status === 403) {
            throw {
              message: "Нет доступа к пользователям",
              status: 403,
            }
          }

          throw {
            message:
              error.response?.data?.message || "Ошибка загрузки пользователей",
            status: error.response?.status || 500,
          }
        }

        throw {
          message: "Непредвиденная ошибка загрузки пользователей",
          status: 500,
        }
      }
    },
    queryKey: ["usersByAdmin"],
    enabled: useAuthStore.getState().isAuthenticated,
  })
}
