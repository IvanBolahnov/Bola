import { useEffect, useState, type ReactNode } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/shared/lib/utils"

import {
  RecurringIntervals,
  RecurringIntervalsRu,
  TransactionTypes,
  type RecurringTransaction,
} from "@/entities/finance/transactions/model/types"
import { CategoryTypes } from "@/entities/finance/category/model/types"
import {
  RecurringTransactionSchema,
  type RecurringTransactionFormData,
} from "../model/schemas"
import { useGetCategories } from "../../categories/model/useGetCategories"
import { MoneyInput } from "@/shared/ui/MoneyInput"
import { useCreateRecurringTransaction } from "../model/useCreateRecurringTransaction"
import { CategoryIcon } from "@/shared/lib/categoryHalpers"
import { useUpdateRecurringTransaction } from "../model/useUpdateRecurringTransaction"
import { DateTimeInput } from "@/shared/ui/DateTimeInput"

type Props = {
  walletId: string
  recurringTransaction?: RecurringTransaction
  children?: ReactNode
}

export function CreateOrEditRecurringTransactionDialog({
  walletId,
  recurringTransaction,
  children,
}: Props) {
  const isEdit = !!recurringTransaction
  const [open, setOpen] = useState(false)

  const { data: categories = [] } = useGetCategories()

  const defaultValues = {
    title: recurringTransaction?.title ?? "",
    type: recurringTransaction?.type ?? TransactionTypes.EXPENSE,
    amount: recurringTransaction?.amount ?? undefined,
    categoryId: recurringTransaction?.categoryId ?? undefined,
    startDate: recurringTransaction?.nextDate
      ? new Date(recurringTransaction.nextDate)
      : new Date(),
    interval: recurringTransaction?.interval,
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<RecurringTransactionFormData>({
    resolver: zodResolver(RecurringTransactionSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const type = useWatch({ control, name: "type" })
  useEffect(() => {
    setValue("categoryId", undefined)
  }, [type, setValue, reset])
  // для категорий фильтруем по типу транзакции
  const filteredCategories = categories.filter((c) =>
    type === TransactionTypes.INCOME
      ? c.type === CategoryTypes.INCOME
      : c.type === CategoryTypes.EXPENSE
  )

  const {
    mutate: createRecurringTransaction,
    isPending: isPendingCreate,
    error: errorCreate,
  } = useCreateRecurringTransaction()

  const {
    mutate: updateRecurringTransaction,
    isPending: isPendingUpdate,
    error: errorUpdate,
  } = useUpdateRecurringTransaction()

  const onSubmit = (data: RecurringTransactionFormData) => {
    if (isEdit) {
      updateRecurringTransaction(
        { id: recurringTransaction!.id, data: { ...data, walletId } },
        {
          onSuccess: () => {
            setOpen(false)
            reset()
          },
        }
      )
    } else {
      createRecurringTransaction(
        { ...data, walletId },
        {
          onSuccess: () => {
            setOpen(false)
            reset()
          },
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-dvh sm:max-w-sm">
        <ScrollArea className="max-h-[calc(100dvh-4rem)]">
          <form onSubmit={handleSubmit(onSubmit)} className="px-1">
            <DialogHeader>
              <DialogTitle>
                {isEdit
                  ? `Редактирование: ${recurringTransaction.title}`
                  : "Новая подписка"}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Измените" : "Заполните"} данные и нажмите
                «Сохранить».
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              {/* Название */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  placeholder="Продукты, зарплата..."
                  {...register("title")}
                  className={cn(errors.title && "border-destructive")}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Сумма */}
              <div className="flex flex-col gap-1.5">
                <Label>Сумма</Label>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <MoneyInput
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      disabled
                      // currencySymbol={getCurrencySymbolByValue(.currency)}
                    />
                  )}
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Дата */}
              <div className="flex flex-col gap-1.5">
                <Label>Дата</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DateTimeInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Направление</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value={TransactionTypes.EXPENSE}
                          id="type-expense"
                        />
                        <Label
                          htmlFor="type-expense"
                          className="cursor-pointer font-normal"
                        >
                          Расход
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem
                          value={TransactionTypes.INCOME}
                          id="type-income"
                        />
                        <Label
                          htmlFor="type-income"
                          className="cursor-pointer font-normal"
                        >
                          Доход
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Категория</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      disabled={filteredCategories.length === 0}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          filteredCategories.length === 0 &&
                            "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Без категории" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.length === 0 && (
                          <SelectItem value="__none" disabled>
                            Нет таких категорий
                          </SelectItem>
                        )}
                        {filteredCategories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            <CategoryIcon icon={c.icon || ""}></CategoryIcon>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-xs text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
                {filteredCategories.length === 0 && (
                  <p className="text-xs text-destructive">
                    Нет таких категорий
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Частота</Label>
                <Controller
                  control={control}
                  name="interval"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          errors.interval && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Без категории" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(RecurringIntervals).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {
                                RecurringIntervalsRu[
                                  key as keyof typeof RecurringIntervals
                                ]
                              }
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-xs text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
                {filteredCategories.length === 0 && (
                  <p className="text-xs text-destructive">
                    Нет таких категорий
                  </p>
                )}
              </div>

              {(errorCreate || errorUpdate) && (
                <p className="text-xs text-destructive">
                  Ошибка при {isEdit ? "редактировании" : "создании"}{" "}
                  транзакции. Попробуйте снова.
                </p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Отмена
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPendingCreate || isPendingUpdate}
              >
                {isPendingCreate || isPendingUpdate ? (
                  <>
                    <Spinner />
                    Сохраняется...
                  </>
                ) : (
                  "Сохранить"
                )}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
