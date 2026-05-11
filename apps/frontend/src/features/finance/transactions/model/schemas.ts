import {
  RecurringIntervals,
  TransactionTypes,
} from "@/entities/finance/transactions/model/types"
import { z } from "zod"

export const TransactionSchema = z
  .object({
    title: z
      .string()
      .min(2, "Минимум 2 символа")
      .max(50, "Максимум 50 символов"),
    type: z.enum(TransactionTypes),
    amount: z.number({ error: "Введите сумму" }).min(0.01, "Минимум 0.01"),
    toWalletId: z.string().optional(),
    categoryId: z.string().optional(),
    note: z.string().max(250, "Максимум 250 символов").optional(),
    date: z.date(),
  })
  .superRefine((data, ctx) => {
    if (data.type === TransactionTypes.TRANSFER && !data.toWalletId) {
      ctx.addIssue({
        code: "custom",
        message: "Выберите кошелёк получателя",
        path: ["toWalletId"],
      })
    }
  })

export type TransactionFormData = z.infer<typeof TransactionSchema>

export const RecurringTransactionSchema = z.object({
  title: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
  type: z.enum(TransactionTypes),
  amount: z.number({ error: "Введите сумму" }).min(0.01, "Минимум 0.01"),
  categoryId: z.string("Введите категорию").optional(),
  interval: z.enum(RecurringIntervals),
  startDate: z.date(),
  endDate: z.date().optional(),
})
export type RecurringTransactionFormData = z.infer<
  typeof RecurringTransactionSchema
>
