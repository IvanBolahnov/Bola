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
import { useState, type ReactNode } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { cn } from "@/shared/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { WalletSchema, type WalletFormData } from "../../wallets/model/schemas"
import { useCreateWallet } from "../../wallets/model/useCreateWallet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Currencies,
  WalletTypes,
  WalletTypesRu,
  type Wallet,
} from "@/entities/finance/wallet/model/types"
import { Label } from "@/components/ui/label"
import { MoneyInput } from "@/shared/ui/MoneyInput"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCurrencySymbolByValue } from "@/shared/lib/currencyHalpers"
import { useUpdateWallet } from "../model/useUpdateWallet"

type CreateOrEditWalletDialogProps = {
  wallet?: Wallet
  children?: ReactNode
}

export function CreateOrEditWalletDialog({
  wallet,
  children,
}: CreateOrEditWalletDialogProps) {
  const isEdit = !!wallet

  const {
    mutate: createWallet,
    isPending: isPendingCreate,
    error: errorCreate,
  } = useCreateWallet()
  const {
    mutate: updateWallet,
    isPending: isPendingUpdate,
    error: errorUpdate,
  } = useUpdateWallet()
  const [open, setOpen] = useState(false)
  const defaultValues = {
    name: wallet?.name || undefined,
    type: wallet?.type || undefined,
    currency: wallet?.currency || Currencies.RUB,
    balance: wallet?.balance || 0,
    description: wallet?.description || undefined,
  }
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WalletFormData>({
    defaultValues,
    resolver: zodResolver(WalletSchema),
  })

  const currency = useWatch({ name: "currency", control })

  const onSubmit = async (data: WalletFormData) => {
    if (isEdit) {
      updateWallet(
        { id: wallet!.id, data },
        { onSuccess: () => setOpen(false) }
      )
    } else {
      createWallet(data, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-dvh sm:max-w-sm">
        <ScrollArea className="max-h-[calc(100dvh-8*var(--spacing))]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {isEdit
                  ? `Редактирование счёта ${wallet?.name}`
                  : "Создание счета"}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Измените" : "Создайте"} свой счет здесь. Нажмите
                «Сохранить», когда закончите.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Назание</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Копилка"
                  autoComplete="email"
                  {...register("name")}
                  className={cn(errors.name && "border-destructive")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="type">Тип</Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Тип обязателен" }}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger
                        id="type"
                        className={cn(
                          "w-full",
                          errors.type && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(WalletTypes).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {WalletTypesRu[key as keyof typeof WalletTypes]}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-xs text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currency">Валюта</Label>
                <Controller
                  name="currency"
                  control={control}
                  rules={{ required: "Валюта обязателена" }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onValueChange={onChange}
                      defaultValue={defaultValues.currency}
                    >
                      <SelectTrigger
                        id="currency"
                        className={cn(
                          "w-full",
                          errors.currency && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(Currencies).map((currency) => (
                            <SelectItem value={currency} key={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.currency && (
                  <p className="text-xs text-destructive">
                    {errors.currency.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="balance">
                  {isEdit ? "Текущий" : "Начальный"} баланс
                </Label>
                <Controller
                  control={control}
                  name="balance"
                  render={({ field: { onChange, value } }) => (
                    <MoneyInput
                      value={value}
                      onChange={onChange}
                      id="balance"
                      currencySymbol={getCurrencySymbolByValue(currency)}
                    />
                  )}
                />
                {errors.balance && (
                  <p className="text-xs text-destructive">
                    {errors.balance.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">
                  Описание{" "}
                  <span className="text-muted-foreground">(необязательно)</span>
                </Label>

                <Textarea
                  {...register("description")}
                  rows={5}
                  id="description"
                  placeholder="Цель, особенности или любые заметки"
                  className="max-w-full overflow-x-hidden"
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {(errorCreate || errorUpdate) && (
                <p className="text-left text-xs text-destructive">
                  Ошибка при {isEdit ? "редактировании" : "создании"} счета.
                  Попробуйте снова.
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Отмена</Button>
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
