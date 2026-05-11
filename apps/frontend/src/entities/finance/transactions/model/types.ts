import type { Category } from "../../category/model/types"
import type { Wallet } from "../../wallet/model/types"

export const TransactionTypes = {
  INCOME: "income",
  EXPENSE: "expense",
  TRANSFER: "transfer",
} as const

export const TransactionTypesRu = {
  INCOME: "Доход",
  EXPENSE: "Расход",
  TRANSFER: "Перевод",
} as const

export type TransactionTypeEnum =
  (typeof TransactionTypes)[keyof typeof TransactionTypes]

export interface Transaction {
  id: string
  userId: string
  title: string
  type: TransactionTypeEnum
  amount: number
  walletId: string
  wallet: Wallet
  toWalletId: string | null
  categoryId: string
  category: Category
  note: string
  date: string
  createdAt: string
  updatedAt: string
}

export const RecurringIntervals = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const

export const RecurringIntervalsRu = {
  DAILY: "Ежедневно",
  WEEKLY: "Еженедельно",
  MONTHLY: "Ежемесячно",
  YEARLY: "Ежегодно",
} as const

export type RecurringIntervalEnum =
  (typeof RecurringIntervals)[keyof typeof RecurringIntervals]

export interface RecurringTransaction {
  id: string
  userId: string
  title: string
  type: TransactionTypeEnum
  amount: number
  wallet: Wallet
  walletId: string
  // toWalletId: string | null
  category: Category | null
  categoryId: string | null
  interval: RecurringIntervalEnum
  startDate: string
  endDate: string | null
  nextDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
