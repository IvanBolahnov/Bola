import {
  Currencies,
  CurrencySymbols,
  type CurrencyEnum,
} from "@/entities/finance/wallet/model/types"

export const getCurrencySymbolByKey = (key: keyof typeof CurrencySymbols) =>
  CurrencySymbols?.[key]

export const getCurrencyKeyByValue = (value: CurrencyEnum) =>
  Object.keys(Currencies)[
    Object.values(Currencies).indexOf(value)
  ] as keyof typeof Currencies

export const getCurrencySymbolByValue = (value: CurrencyEnum) =>
  getCurrencySymbolByKey(getCurrencyKeyByValue(value))
