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
import type { RecurringTransaction } from "@/entities/finance/transactions/model/types"
import { useDeleteRecurringTransaction } from "../model/useDeleteRecurringTransaction"

type DeleteRecurringTransactionDialogProps = {
  recurringTransaction: RecurringTransaction
  children?: ReactNode
  onDelete?: (wallet: RecurringTransaction) => void
}

export function DeleteRecurringTransactionDialog({
  recurringTransaction,
  children,
  onDelete,
}: DeleteRecurringTransactionDialogProps) {
  const { mutate: deleteRecurringTransaction, isPending } =
    useDeleteRecurringTransaction()
  const [open, setOpen] = useState(false)

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    deleteRecurringTransaction(recurringTransaction.id, {
      onSuccess: () => {
        setOpen(false)
        if (!onDelete) {
          return
        }
        onDelete(recurringTransaction)
      },
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-dvh sm:max-w-sm">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{`Удаление подписки ${recurringTransaction.title}`}</DialogTitle>
            <DialogDescription>
              Вы уверены что хотите удалить подписку{" "}
              {recurringTransaction.title}? Нажмите «Удалить», чтобы
              подтвердить.
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
