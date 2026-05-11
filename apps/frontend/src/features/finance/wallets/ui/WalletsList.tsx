import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetWallets } from "../../wallets/model/useGetWallets"
import { Button } from "@/components/ui/button"
import { RiAddLine, RiWalletLine } from "@remixicon/react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CreateOrEditWalletDialog } from "./CreateOrEditWalletDialog"
import { Link } from "react-router-dom"
import { getCurrencySymbolByValue } from "@/shared/lib/currencyHalpers"

export function WalletsList() {
  const { data: wallets, isPending } = useGetWallets()

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {wallets?.map((wallet) => (
          <Link to={`/finance/${wallet.id}`} key={wallet.id}>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="truncate">{wallet.name}</CardTitle>
                <CardDescription>{`${wallet.balance} ${getCurrencySymbolByValue(
                  wallet.currency
                )}`}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        {wallets?.length !== 0 && (
          <CreateOrEditWalletDialog>
            <Button
              variant="ghost"
              className="h-full min-h-12 w-full border border-border bg-card"
            >
              <RiAddLine size={50} />
            </Button>
          </CreateOrEditWalletDialog>
        )}
      </div>
      {!isPending && wallets?.length === 0 && <WalletsEmptyList />}
    </>
  )
}

function WalletsEmptyList() {
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
