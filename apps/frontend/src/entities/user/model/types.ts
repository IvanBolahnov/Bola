export const UserRoles = {
  USER: "user",
  ADMIN: "admin",
  BANNED: "deleted",
} as const

export const UserRolesRu = {
  USER: "Пользователь",
  ADMIN: "Администратор",
  BANNED: "Заблокирован",
} as const

export type UserRoleEnum = (typeof UserRoles)[keyof typeof UserRoles]

export interface User {
  id: string
  email: string
  name: string
  role: UserRoleEnum
}

export interface Session {
  id: string
  userAgent: string
  ip: string
  deviceName: string
  expiresAt: string
  createdAt: string
  lastUsedAt: string
}

export interface UserWithSessions extends User {
  sessions: (Session & {
    refreshTokenHash: string
    parentTokenHash: string

    isRevoked: false
    isAccepted: true
    revokedAt: null
    revokedReason: null | "reuse_attack" | "logout" | "expired" | "manual"
  })[]
}
