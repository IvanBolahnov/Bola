import type { UsersAndSessionsAnalytics } from "@/features/admin/types/usersAnalytics.type"
import { apiInstance } from "../instance"
import type { UserWithSessions } from "@/entities/user/model/types"

export interface getAllUsersParams {
  // TODO
  empty?: ""
}

export const adminUsersApi = {
  getAll: (params?: getAllUsersParams) =>
    apiInstance.get<UserWithSessions[]>("/users/", { params }),
  getAnalytics: () =>
    apiInstance.get<UsersAndSessionsAnalytics>("/users/analytics"),
}
