import { Currencies, WalletTypes } from "@/entities/finance/wallet/model/types"
import { z } from "zod"

export const WalletSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
  type: z.enum(Object.values(WalletTypes), "Выберите тип счёта"),
  currency: z.enum(Object.values(Currencies), "Выберите подходящую валюту"),
  balance: z.number(),
  description: z.string().max(250, "Максимум 250 символов").nullable(),
})

export type WalletFormData = z.infer<typeof WalletSchema>
