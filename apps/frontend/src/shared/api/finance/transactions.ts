import type {
  RecurringTransaction,
  Transaction,
  TransactionTypeEnum,
} from "@/entities/finance/transactions/model/types"
import { apiInstance } from "../instance"

export interface GetTransactionsParams {
  type?: TransactionTypeEnum
  walletId?: string
  categoryId?: string
  dateFrom?: Date
  dateTo?: Date
  page?: number
  limit?: number
}

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

export interface UpdateTransactionPayload {
  title?: string
  type?: TransactionTypeEnum
  amount?: number
  walletId?: string
  toWalletId?: string
  categoryId?: string
  note?: string
  date?: Date
}

export interface GetRecurringTransactionsParams {
  type?: TransactionTypeEnum
  walletId?: string
  categoryId?: string
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

export interface UpdateRecurringTransactionPayload {
  title?: string
  type?: TransactionTypeEnum
  amount?: number
  walletId?: string
  categoryId?: string
  startDate: Date
  endDate?: Date
}

export const transactionsApi = {
  get: (params?: GetTransactionsParams) =>
    apiInstance.get<{
      items: Transaction[]
      total: number
      page: number
      limit: number
      pages: number
    }>("/finance/transactions", { params }),
  create: (data: CreateTransactionPayload) =>
    apiInstance.post<Transaction>("/finance/transactions", data),
  update: (id: string, data: UpdateTransactionPayload) =>
    apiInstance.patch<Transaction>(`/finance/transactions/${id}`, data),
  getRecurring: (params?: GetRecurringTransactionsParams) =>
    apiInstance.get<{
      items: RecurringTransaction[]
      total: number
      page: number
      limit: number
      pages: number
    }>("/finance/recurring", { params }),
  createRecurring: (data: CreateRecurringTransactionPayload) =>
    apiInstance.post<RecurringTransaction>("/finance/recurring", data),
  updateRecurring: (id: string, data: UpdateRecurringTransactionPayload) =>
    apiInstance.patch<RecurringTransaction>(`/finance/recurring/${id}`, data),
  deleteRecurring: (id: string) =>
    apiInstance.delete(`/finance/recurring/${id}`),
}
