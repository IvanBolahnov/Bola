export interface User {
  id: string
  email: string
  name: string
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
