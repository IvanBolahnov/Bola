import type {
  RecurringTransaction,
  Transaction,
  TransactionTypeEnum,
} from "@/entities/finance/transactions/model/types"
import { apiInstance } from "../instance"

export interface CreateTransactionPayload {
  title: string
  type: TransactionTypeEnum
  amount: number
  walletId: string
  toWalletId?: string
  categoryId?: string
  note?: string
  date?: Date
}

export interface GetTransactionsParams {
  type?: TransactionTypeEnum
  walletId?: string
  categoryId?: string
  dateFrom?: Date
  dateTo?: Date
  page?: number
  limit?: number
}

export interface CreateRecurringTransactionPayload {
  title: string
  type: TransactionTypeEnum
  amount: number
  walletId: string
  categoryId?: string
  startDate: Date
  endDate?: Date
}

export interface GetRecurringTransactionsParams {
  type?: TransactionTypeEnum
  walletId?: string
  categoryId?: string
  page?: number
  limit?: number
}

export const transactionsApi = {
  createTransaction: (data: CreateTransactionPayload) =>
    apiInstance.post<Transaction>("/finance/transactions", data),
  getTransactions: (params?: GetTransactionsParams) =>
    apiInstance.get<{
      items: Transaction[]
      total: number
      page: number
      limit: number
      pages: number
    }>("/finance/transactions", { params }),
  createRecurringTransaction: (data: CreateRecurringTransactionPayload) =>
    apiInstance.post<RecurringTransaction>("/finance/recurring", data),
  getRecurringTransactions: (params?: GetRecurringTransactionsParams) =>
    apiInstance.get<{
      items: RecurringTransaction[]
      total: number
      page: number
      limit: number
      pages: number
    }>("/finance/recurring", { params }),
}
