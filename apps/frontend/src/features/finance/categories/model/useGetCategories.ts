import { useQuery } from "@tanstack/react-query"
import { categoriesApi } from "@/shared/api/finance/categories"
import { useAuthStore } from "@/entities/user/model/authStore"

export function useGetCategories() {
  return useQuery({
    queryFn: () => categoriesApi.getCategories().then((res) => res.data),
    queryKey: ["categories"],
    enabled: useAuthStore.getState().isAuthenticated,
  })
}
