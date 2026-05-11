import { apiInstance } from "./instance"
import type { User } from "@/entities/user/model/types"

export interface UpdateUserPayload {
  name: string
}

export const userApi = {
  update: (data: UpdateUserPayload) =>
    apiInstance.patch<User>("/users/me", data),
}
