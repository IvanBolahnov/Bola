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
import { type Wallet } from "@/entities/finance/wallet/model/types"
import { useDeleteWallet } from "../model/useDeleteWallet"
import { useNavigate } from "react-router-dom"

type DeleteWalletDialogProps = {
  wallet: Wallet
  children?: ReactNode
  onDelete?: (wallet: Wallet) => void
}

export function DeleteWalletDialog({
  wallet,
  children,
  onDelete,
}: DeleteWalletDialogProps) {
  const { mutate: deleteWallet, isPending } = useDeleteWallet()
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()
  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    deleteWallet(wallet, {
      onSuccess: () => {
        setOpen(false)
        if (!onDelete) {
          navigate("/finance")
          return
        }
        onDelete(wallet)
      },
    })
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-dvh sm:max-w-sm">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{`Удаление счёта ${wallet.name}`}</DialogTitle>
            <DialogDescription>
              Вы уверены что хотите удалить счёт {wallet.name}? Нажмите
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
