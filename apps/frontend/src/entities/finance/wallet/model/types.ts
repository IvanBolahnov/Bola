export const WalletTypes = {
  CASH: "cash",
  CARD: "card",
  SAVINGS: "savings",
  INVESTMENT: "investment",
} as const

export const WalletTypesRu = {
  CASH: "Наличные",
  CARD: "Карта",
  SAVINGS: "Сбережения",
  INVESTMENT: "Инвестиции",
} as const

export type WalletTypeEnum = (typeof WalletTypes)[keyof typeof WalletTypes]

export const Currencies = {
  EUR: "EUR",
  USD: "USD",
  RUB: "RUB",
  GBP: "GBP",
} as const

export const CurrencySymbols = {
  EUR: "€",
  USD: "$",
  RUB: "₽",
  GBP: "£",
} as const

export type CurrencyEnum = (typeof Currencies)[keyof typeof Currencies]

export interface Wallet {
  id: string
  userId: string
  name: string
  type: WalletTypeEnum
  currency: CurrencyEnum
  balance: number
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
