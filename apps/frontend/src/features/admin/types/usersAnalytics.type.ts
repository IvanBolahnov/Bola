import type { Session } from "@/entities/user/model/types"

export type UsersAndSessionsAnalytics = {
  users: UsersAnalytics
  sessions: SessionsAnalytics
}

export type UsersAnalytics = {
  total: number
  new: {
    last24h: number
    last7d: number
    last30d: number
  }
  registrationsByDay: {
    date: string
    count: number
  }[]
}

export type SessionsAnalytics = {
  total: number
  active: number
  revoked: number
  securityRevokes: number
  acceptanceRate: number
  topDevices: {
    deviceName: string
    count: number
  }[]
  recent: Session[]
}
