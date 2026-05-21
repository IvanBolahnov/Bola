import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiAddLine, RiRefreshLine, RiWalletLine } from "@remixicon/react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CreateOrEditWalletDialog } from "@/features/finance/wallets/ui/CreateOrEditWalletDialog"
import { Link } from "react-router-dom"
import { getCurrencySymbolByValue } from "@/shared/lib/currencyHalpers"
import { numberToMoney } from "@/shared/lib/moneyHandlers"
import type { Wallet } from "@/entities/finance/wallet/model/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

type WalletsListProps = {
  wallets: Wallet[]
}

export function WalletsList({ wallets }: WalletsListProps) {
  if (wallets.length === 0) {
    return <WalletsEmptyList />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {wallets?.map((wallet) => (
        <Link to={`/finance/${wallet.id}`} key={wallet.id}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="truncate">{wallet.name}</CardTitle>
              <CardDescription className="truncate">
                {numberToMoney(wallet.balance, {
                  minimumFractionDigits: 2,
                })}{" "}
                {getCurrencySymbolByValue(wallet.currency)}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
      <CreateOrEditWalletDialog>
        <Button variant="outline" className="h-full min-h-12 w-full">
          <RiAddLine size={50} />
        </Button>
      </CreateOrEditWalletDialog>
    </div>
  )
}

export function WalletsEmptyList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiWalletLine />
        </EmptyMedia>
        <EmptyTitle>Счетов нет</EmptyTitle>
        <EmptyDescription>
          Вы еще не создали ни одного счёта. Начните с создания своего первого
          счёта.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <CreateOrEditWalletDialog>
          <Button>Создать счёт</Button>
        </CreateOrEditWalletDialog>
      </EmptyContent>
    </Empty>
  )
}

export function WalletListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-[40%]" />
          </CardTitle>
          <CardDescription className="truncate">
            <Skeleton className="h-3.5 w-[30%]" />
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-[30%]" />
          </CardTitle>
          <CardDescription className="truncate">
            <Skeleton className="h-3.5 w-[20%]" />
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

type WalletsCardErrorProps = {
  status?: number
  message?: string
  isRetrying?: boolean
  onRetry?: () => void
}
export function WalletsCardError({
  status,
  message,
  isRetrying,
  onRetry,
}: WalletsCardErrorProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiWalletLine />
        </EmptyMedia>
        <EmptyTitle>{status}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <CreateOrEditWalletDialog>
          <Button disabled={isRetrying} onClick={onRetry}>
            {isRetrying && <Spinner />}
            {!isRetrying && <RiRefreshLine />}
          </Button>
        </CreateOrEditWalletDialog>
      </EmptyContent>
    </Empty>
  )
}
