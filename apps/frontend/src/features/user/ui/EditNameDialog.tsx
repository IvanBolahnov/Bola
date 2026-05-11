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
import { useForm } from "react-hook-form"
import { UpdateUserSchema, type UpdateUserFormData } from "../model/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { cn } from "@/shared/lib/utils"
import { useUpdateUser } from "../model/useUpdateUser"
import { useAuthStore } from "@/entities/user/model/authStore"
import { Spinner } from "@/components/ui/spinner"

type EditNameDialogProps = {
  children?: ReactNode
}

export function EditNameDialog({ children }: EditNameDialogProps) {
  const { mutate: updateUser, isPending, error } = useUpdateUser()
  const [open, setOpen] = useState(false)

  const user = useAuthStore((s) => s.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    defaultValues: {
      name: user?.name || "",
    },
    resolver: zodResolver(UpdateUserSchema),
  })

  const onSubmit = async (data: UpdateUserFormData) => {
    updateUser(data, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Сменить имя</DialogTitle>
            <DialogDescription>
              Внесите изменения в свой профиль здесь. Нажмите «Сохранить», когда
              закончите.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5 py-2">
            <Input
              id="name"
              type="name"
              placeholder="Иван"
              autoComplete="email"
              {...register("name")}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
            {error && (
              <p className="text-left text-xs text-destructive">
                Ошибка при изменении профиля. Попробуйте снова.
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
      </DialogContent>
    </Dialog>
  )
}
