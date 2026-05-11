import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/shared/api/auth"
import { useAuthStore } from "@/entities/user/model/authStore"

export function useGetSessions() {
  return useQuery({
    queryFn: () => authApi.getSessions().then((res) => res.data),
    queryKey: ["sessions"],
    enabled: useAuthStore.getState().isAuthenticated,
  })
}
