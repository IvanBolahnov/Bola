import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/shared/api/auth"
import { useAuthStore } from "@/entities/user/model/authStore"
import type { RegisterPayload } from "@/shared/api/auth"

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: ({ data }) => {
      setAuth(data.user, data.accessToken)
    },
  })
}
