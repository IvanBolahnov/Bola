import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/entities/user/model/authStore"
import { userApi, type UpdateUserPayload } from "@/shared/api/user"
import { toast } from "sonner"

export function useUpdateUser() {
  const { setAuth, accessToken } = useAuthStore()

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => {
      return userApi.update(data)
    },
    onSuccess: ({ data }) => {
      setAuth(data, accessToken!)
      toast.success("Профиль изменён")
    },
    onError: () => {
      toast.success("Ошибка изменения профиля")
    },
  })
}
