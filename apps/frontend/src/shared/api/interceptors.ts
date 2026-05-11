import { useAuthStore } from "@/entities/user/model/authStore"
import { apiInstance } from "./instance"
// import axios from "axios"

let refreshPromise: Promise<string> | null = null

export function setupInterceptors() {
  apiInstance.interceptors.request.use(async (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers["ngrok-skip-browser-warning"] = "true"
    return config
  })

  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config

      console.error(error.response?.data)

      if (error.response?.status === 429 && !error.response?.data?.isHandled) {
        error.response.data.message =
          "Слишком много запросов. Попробуйте позже."
        error.response.data.isHandled = true
        return Promise.reject(error)
      }

      if (
        error.response?.status === 401 &&
        !original._retry &&
        original.url !== "/auth/refresh" &&
        error.response?.data?.message === "Unauthorized"
      ) {
        original._retry = true
        try {
          if (!refreshPromise) {
            refreshPromise = apiInstance
              .post<{ accessToken: string }>("/auth/refresh")
              .then(({ data }) => {
                useAuthStore.getState().setAccessToken(data.accessToken)
                return data.accessToken
              })
              .finally(() => {
                refreshPromise = null
              })
          }

          const accessToken = await refreshPromise
          original.headers.Authorization = `Bearer ${accessToken}`
          return apiInstance(original)
        } catch {
          useAuthStore.getState().logout()
          window.location.href = "/login"
        }
      }

      return Promise.reject(error)
    }
  )
}
