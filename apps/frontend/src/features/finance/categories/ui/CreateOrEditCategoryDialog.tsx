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
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { cn } from "@/shared/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { CategorySchema, type CategoryFormData } from "../model/schemas"
import { useCreateCategory } from "../model/useCreateCategory"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CategoryIcons,
  CategoryTypes,
  CategoryTypesRu,
  type Category,
} from "@/entities/finance/category/model/types"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

type CreateOrEditWalletProps = {
  category?: Category
  children?: ReactNode
}

export function CreateOrEditCategoryDialog({
  category,
  children,
}: CreateOrEditWalletProps) {
  const isEdit = !!category

  const { mutate: createWallet, isPending, error } = useCreateCategory()
  const [open, setOpen] = useState(false)
  const defaultValues = {
    name: category?.name || undefined,
    type: category?.type || undefined,
    icon: category?.icon || undefined,
  }
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues,
    resolver: zodResolver(CategorySchema),
  })

  const onSubmit = async (data: CategoryFormData) => {
    createWallet(data, { onSuccess: () => setOpen(false) })
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
                  ? `Редактирование категории ${category?.name}`
                  : "Создание категории"}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Измените" : "Создайте"} свою категорию здесь. Нажмите
                «Сохранить», когда закончите.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Назание</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Транспорт"
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
                          {Object.entries(CategoryTypes).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {
                                CategoryTypesRu[
                                  key as keyof typeof CategoryTypes
                                ]
                              }
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
                <Label htmlFor="icon">Изображение</Label>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger
                        id="icon"
                        className={cn(
                          "w-full",
                          errors.icon && "border-destructive"
                        )}
                      >
                        <SelectValue placeholder="Выберите изображение" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(CategoryIcons).map(([key, Value]) => (
                            <SelectItem key={key} value={key}>
                              <Value />
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

              {error && (
                <p className="text-left text-xs text-destructive">
                  Ошибка при {isEdit ? "редактировании" : "создании"} категории.
                  Попробуйте снова.
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Отмена</Button>
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
