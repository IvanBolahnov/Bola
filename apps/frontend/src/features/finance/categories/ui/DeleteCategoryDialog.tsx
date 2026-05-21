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
import { useState, type ReactNode, type SubmitEvent } from "react"
import { Spinner } from "@/components/ui/spinner"
import { type Category } from "@/entities/finance/category/model/types"
import { useDeleteCategory } from "../model/useDeleteCategory"

type DeleteWalletDialogProps = {
  category: Category
  children?: ReactNode
  onDelete?: (category: Category) => void
}

export function DeleteCategoryDialog({
  category,
  children,
  onDelete,
}: DeleteWalletDialogProps) {
  const { mutate: deleteCategory, isPending } = useDeleteCategory()
  const [open, setOpen] = useState(false)

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    deleteCategory(category.id, {
      onSuccess: () => {
        setOpen(false)
        if (!onDelete) {
          return
        }
        onDelete(category)
      },
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-dvh sm:max-w-sm">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{`Удаление счёта ${category.name}`}</DialogTitle>
            <DialogDescription>
              Вы уверены что хотите удалить категорию {category.name}? Нажмите
              «Удалить», чтобы подтвердить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending} variant="destructive">
              {isPending ? (
                <>
                  <Spinner />
                  Удаляется...
                </>
              ) : (
                "Удалить"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
