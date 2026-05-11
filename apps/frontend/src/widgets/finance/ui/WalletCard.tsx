import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrencySymbolByValue } from "@/shared/lib/currencyHalpers"
import type { Wallet } from "@/entities/finance/wallet/model/types"
import { CreateOrEditTransactionDialog } from "../../../features/finance/transactions/ui/CreateOrEditTransactionDialog"
import {
  RiArrowRightUpLine,
  RiDeleteBinLine,
  RiLoopRightLine,
  RiMoreLine,
  RiPencilLine,
  RiRefreshLine,
} from "@remixicon/react"
import { numberToMoney } from "@/shared/lib/moneyHandlers"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { MenuItems, type MenuItem } from "@/shared/ui/MenuItems"
import { DeleteWalletDialog } from "../../../features/finance/wallets/ui/DeleteWalletDialog"
import { CreateOrEditWalletDialog } from "../../../features/finance/wallets/ui/CreateOrEditWalletDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { CreateOrEditRecurringTransactionDialog } from "@/features/finance/transactions/ui/CreateOrEditRecurringTransactionDialog"

type WalletCardProps = {
  wallet: Wallet
  refetchWallet?: () => void
}

export function WalletCard({ wallet, refetchWallet }: WalletCardProps) {
  const walletMenuItems: MenuItem[] = [
    {
      dropdownItem: (
        <CreateOrEditTransactionDialog walletId={wallet.id}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <RiArrowRightUpLine />
            Перевод
          </DropdownMenuItem>
        </CreateOrEditTransactionDialog>
      ),
      contextItem: (
        <CreateOrEditTransactionDialog walletId={wallet.id}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            <RiArrowRightUpLine />
            Перевод
          </ContextMenuItem>
        </CreateOrEditTransactionDialog>
      ),
    },
    {
      dropdownItem: (
        <CreateOrEditWalletDialog wallet={wallet}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <RiPencilLine />
            Редактировать
          </DropdownMenuItem>
        </CreateOrEditWalletDialog>
      ),
      contextItem: (
        <CreateOrEditWalletDialog wallet={wallet}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            <RiPencilLine />
            Редактировать
          </ContextMenuItem>
        </CreateOrEditWalletDialog>
      ),
    },
    refetchWallet
      ? {
          dropdownItem: (
            <DropdownMenuItem onClick={refetchWallet}>
              <RiRefreshLine />
              Обновить
            </DropdownMenuItem>
          ),
          contextItem: (
            <ContextMenuItem onClick={refetchWallet}>
              <RiRefreshLine />
              Обновить
            </ContextMenuItem>
          ),
        }
      : undefined,
    {
      dropdownItem: <DropdownMenuSeparator />,
      contextItem: <ContextMenuSeparator />,
    },
    {
      dropdownItem: (
        <DeleteWalletDialog wallet={wallet}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <RiDeleteBinLine />
            Удалить
          </DropdownMenuItem>
        </DeleteWalletDialog>
      ),
      contextItem: (
        <DeleteWalletDialog wallet={wallet}>
          <ContextMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <RiDeleteBinLine />
            Удалить
          </ContextMenuItem>
        </DeleteWalletDialog>
      ),
    },
  ]
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="h-full">
            <CardHeader className="text-lg font-semibold">
              <CardTitle
                title={wallet.name}
                className="line-clamp-2 max-w-prose text-lg font-semibold"
              >
                {wallet.name}
              </CardTitle>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <RiMoreLine />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <MenuItems
                      type="dropdown"
                      items={walletMenuItems}
                    ></MenuItems>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
              {wallet.description && (
                <CardDescription
                  className="line-clamp-2 max-w-prose"
                  title={wallet.description}
                >
                  {wallet.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-semibold">
                {numberToMoney(wallet.balance, {
                  minimumFractionDigits: 2,
                })}
                &nbsp;
                {getCurrencySymbolByValue(wallet.currency)}
              </span>
            </CardContent>
            <CardFooter>
              <CreateOrEditTransactionDialog walletId={wallet.id}>
                <Button>
                  <RiArrowRightUpLine />
                  Перевод
                </Button>
              </CreateOrEditTransactionDialog>
              <CreateOrEditRecurringTransactionDialog walletId={wallet.id}>
                <Button>
                  <RiLoopRightLine />
                  Подписка
                </Button>
              </CreateOrEditRecurringTransactionDialog>
            </CardFooter>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <MenuItems items={walletMenuItems} type="context"></MenuItems>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export function WalletCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-7 w-[50%]" />
        </CardTitle>
        <CardAction>
          <Button variant="ghost" disabled>
            <Spinner />
          </Button>
        </CardAction>
        <CardDescription>
          <Skeleton className="h-4.25 w-full" />
          <Skeleton className="mt-1 h-4.25 w-[80%]" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="inline-block h-10 w-[70%]" />
      </CardContent>
    </Card>
  )
}

type WalletCardErrorProps = {
  status?: string | number
  message?: string
  isRetrying?: boolean
  onRetry?: () => void
}
export function WalletCardError({
  status,
  message,
  isRetrying,
  onRetry,
}: WalletCardErrorProps) {
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">
        {status && (
          <CardTitle className="line-clamp-2 max-w-prose text-lg font-semibold">
            {status}
          </CardTitle>
        )}
        {message && (
          <CardDescription className="line-clamp-2 max-w-prose" title={message}>
            {message}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {onRetry && (
          <Button
            size={"icon"}
            variant={"ghost"}
            disabled={isRetrying}
            onClick={onRetry}
          >
            {isRetrying && <Spinner />}
            {!isRetrying && <RiRefreshLine />}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
