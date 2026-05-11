import type {
  CurrencyEnum,
  Wallet,
  WalletTypeEnum,
} from "@/entities/finance/wallet/model/types"
import { apiInstance } from "../instance"

export interface CreateWalletPayload {
  name: string
  type: WalletTypeEnum
  currency: CurrencyEnum
  balance: number
  description: string | null
}

export interface UpdateWalletPayload {
  name?: string
  type?: WalletTypeEnum
  currency?: CurrencyEnum
  balance?: number
  description?: string | null
}

export const walletsApi = {
  getAll: () => apiInstance.get<Wallet[]>("/finance/wallets"),
  create: (data: CreateWalletPayload) =>
    apiInstance.post<Wallet>("/finance/wallets", data),
  get: (id: string) => apiInstance.get<Wallet>(`/finance/wallets/${id}`),
  update: (id: string, data: UpdateWalletPayload) =>
    apiInstance.patch<Wallet>(`/finance/wallets/${id}`, data),
  delete: (id: string) => apiInstance.delete<Wallet>(`/finance/wallets/${id}`),
}
