import { apiInstance } from "./instance"
import type { Session, User } from "@/entities/user/model/types"

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  register: (data: RegisterPayload) =>
    apiInstance.post<AuthResponse>("/auth/register", data),

  login: (data: LoginPayload) =>
    apiInstance.post<AuthResponse>("/auth/login", data),

  logout: () => apiInstance.post("/auth/logout"),

  refresh: () => apiInstance.post("/auth/refresh"),

  getSessions: () => apiInstance.get<Session[]>("/auth/sessions"),

  revokeSession: (sessionId: string) =>
    apiInstance.delete<Session>(`/auth/sessions/${sessionId}`),

  revokeAllSessions: () => apiInstance.delete(`/auth/sessions`),
}
