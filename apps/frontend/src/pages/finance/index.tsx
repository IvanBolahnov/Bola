import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  WalletListSkeleton,
  WalletsCardError,
  WalletsList,
} from "@/widgets/finance/ui/WalletsList"
import { FinanceTabsNav } from "@/pages/finance/FinanceTabsNav"
import { useGetWallets } from "@/features/finance/wallets/model/useGetWallets"

export default function FinancePage() {
  const {
    data: wallets,
    isFetching: isFetchingWallets,
    error: errorWallets,
    refetch: refetchWallets,
  } = useGetWallets()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="flex h-full w-full flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Финансы</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <FinanceTabsNav />
        {wallets && <WalletsList wallets={wallets} />}
        {isFetchingWallets && !wallets && <WalletListSkeleton />}
        {errorWallets && !wallets && (
          <WalletsCardError
            status={errorWallets.status}
            message={errorWallets.message}
            isRetrying={isFetchingWallets}
            onRetry={refetchWallets}
          />
        )}
      </div>
    </div>
  )
}
