import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/shared/api/auth"
import { useAuthStore } from "@/entities/user/model/authStore"
import type { LoginPayload } from "@/shared/api/auth"
import { AxiosError } from "axios"

export function useLogin() {
  const setAuth = useAuthStore().setAuth

  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      try {
        const response = await authApi.login(data)
        return response
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            throw {
              message: "Неверный email или пароль",
              status: 401,
            }
          }

          if (error.response?.status === 429) {
            throw {
              message: "Слишком много запросов. Попробуйте позже",
              status: 429,
            }
          }
        }

        throw {
          message: "Непредвиденная ошибка",
          status: 500,
        }
      }
    },
    onSuccess: ({ data }) => {
      setAuth(data.user, data.accessToken)
    },
  })
}
