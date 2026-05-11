import { useEffect, useState, type ReactNode } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
// import { CalendarIcon } from "lucide-react"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/shared/lib/utils"

import {
  TransactionTypes,
  type Transaction,
} from "@/entities/finance/transactions/model/types"
import { CategoryTypes } from "@/entities/finance/category/model/types"
import { TransactionSchema, type TransactionFormData } from "../model/schemas"
import { useCreateTransaction } from "../model/useCreateTransaction"
import { useGetWallets } from "../../wallets/model/useGetWallets"
import { useGetCategories } from "../../categories/model/useGetCategories"
import { MoneyInput } from "@/shared/ui/MoneyInput"
import { CategoryIcon } from "@/shared/lib/categoryHalpers"

type Props = {
  walletId: string
  transaction?: Transaction
  children?: ReactNode
}

export function CreateOrEditTransactionDialog({
  walletId,
  transaction,
  children,
}: Props) {
  const isEdit = !!transaction
  const [open, setOpen] = useState(false)

  const { mutate: createTransaction, isPending, error } = useCreateTransaction()
  const { data: wallets = [] } = useGetWallets()
  const { data: categories = [] } = useGetCategories()

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      title: transaction?.title ?? "",
      type: transaction?.type ?? TransactionTypes.EXPENSE,
      amount: transaction?.amount ?? undefined,
      date: transaction?.date ? new Date(transaction.date) : new Date(),
      categoryId: transaction?.categoryId ?? undefined,
      toWalletId: transaction?.toWalletId ?? undefined,
      note: transaction?.note ?? "",
    },
  })

  // следим за типом чтобы показывать нужные поля
  const type = useWatch({ control, name: "type" })
  const isTransfer = type === TransactionTypes.TRANSFER

  // для категорий фильтруем по типу транзакции
  const filteredCategories = categories.filter((c) =>
    type === TransactionTypes.INCOME
      ? c.type === CategoryTypes.INCOME
      : c.type === CategoryTypes.EXPENSE
  )

  // кошельки-получатели — все кроме текущего
  const targetWallets = wallets.filter((w) => w.id !== walletId)

  useEffect(() => {
    setValue("toWalletId", undefined)
    setValue("categoryId", undefined)
  }, [type, setValue])

  const onSubmit = (data: TransactionFormData) => {
    createTransaction(
      { ...data, walletId },
      {
        onSuccess: () => {
          setOpen(false)
          reset()
        },
      }
    )
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
                  ? `Редактирование: ${transaction.title}`
                  : "Новая транзакция"}
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
                      // currencySymbol={getCurrencySymbolByValue(wallet.currency)}
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
                  name="date"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            errors.date && "border-destructive"
                          )}
                        >
                          {/* <CalendarIcon className="mr-2 size-4" /> */}
                          {field.value
                            ? format(field.value, "d MMMM yyyy", { locale: ru })
                            : "Выберите дату"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={ru}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && (
                  <p className="text-xs text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Тип транзакции */}
              <div className="flex flex-col gap-2">
                <Label>Тип</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <RadioGroup
                      value={
                        field.value === TransactionTypes.TRANSFER
                          ? "transfer"
                          : "payment"
                      }
                      onValueChange={(val) => {
                        field.onChange(
                          val === "transfer"
                            ? TransactionTypes.TRANSFER
                            : TransactionTypes.EXPENSE
                        )
                      }}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="payment" id="type-payment" />
                        <Label
                          htmlFor="type-payment"
                          className="cursor-pointer font-normal"
                        >
                          Платёж
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="transfer" id="type-transfer" />
                        <Label
                          htmlFor="type-transfer"
                          className="cursor-pointer font-normal"
                        >
                          Перевод
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.type && (
                  <p className="text-xs text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {!isTransfer && (
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
              )}

              {/* Кошелёк-получатель — только для transfer */}
              {isTransfer && (
                <div className="flex flex-col gap-1.5">
                  <Label>Кошелёк получателя</Label>
                  <Controller
                    control={control}
                    name="toWalletId"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        disabled={targetWallets.length === 0}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.toWalletId && "border-destructive",
                            targetWallets.length === 0 && "border-destructive"
                          )}
                        >
                          <SelectValue placeholder="Выберите кошелёк" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetWallets.length === 0 ? (
                            <SelectItem value="__none" disabled>
                              Нет других кошельков
                            </SelectItem>
                          ) : (
                            targetWallets.map((w) => (
                              <SelectItem key={w.id} value={w.id}>
                                {w.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.toWalletId && (
                    <p className="text-xs text-destructive">
                      {errors.toWalletId.message}
                    </p>
                  )}
                  {targetWallets.length === 0 && (
                    <p className="text-xs text-destructive">
                      Нет других кошельков
                    </p>
                  )}
                </div>
              )}

              {/* Категория — только для income/expense */}
              {!isTransfer && (
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
                            errors.toWalletId && "border-destructive",
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
              )}

              {/* Заметка */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="note">
                  Заметка{" "}
                  <span className="text-muted-foreground">(необязательно)</span>
                </Label>
                <Textarea
                  id="note"
                  placeholder="Дополнительная информация..."
                  rows={2}
                  {...register("note")}
                  className={cn(errors.note && "border-destructive")}
                />
                {errors.note && (
                  <p className="text-xs text-destructive">
                    {errors.note.message}
                  </p>
                )}
              </div>

              {error && (
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
              <Button type="submit" disabled={isPending}>
                {isPending ? (
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
