import {
  UserRoles,
  UserRolesRu,
  type UserRoleEnum,
} from "@/entities/user/model/types"

export const getUserRoleRuByKey = (key: keyof typeof UserRolesRu) =>
  UserRolesRu?.[key]

export const getUserRoleKeyByValue = (value: UserRoleEnum) =>
  Object.keys(UserRoles)[
    Object.values(UserRoles).indexOf(value)
  ] as keyof typeof UserRoles

export const getUserRoleRuByValue = (value: UserRoleEnum) =>
  getUserRoleRuByKey(getUserRoleKeyByValue(value))
