import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authApi } from "@/shared/api/auth"
import { useAuthStore } from "@/entities/user/model/authStore"

export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout()
      navigate("/login", { replace: true })
    },
    onError: () => {
      // даже если бек вернул ошибку — разлогиниваем локально
      logout()
      navigate("/login", { replace: true })
    },
  })
}
