import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Spinner } from "@/components/ui/spinner"
import { useGetRecurringTransactions } from "@/features/finance/transactions/model/useGetRecurringTransactions"
import { useGetTransactions } from "@/features/finance/transactions/model/useGetTransactions"
import { useGetWallet } from "@/features/finance/wallets/model/useGetWallet"
import {
  RecurringTransactionsCard,
  RecurringTransactionsCardError,
  RecurringTransactionsCardSkeleton,
} from "@/widgets/finance/ui/RecurringTransactionsCard"
import {
  TransactionsCard,
  TransactionsCardError,
  TransactionsCardSkeleton,
} from "@/widgets/finance/ui/TransactionsCard"
import {
  WalletCard,
  WalletCardError,
  WalletCardSkeleton,
} from "@/widgets/finance/ui/WalletCard"
import { RiErrorWarningLine } from "@remixicon/react"
import { Link, useParams } from "react-router-dom"

export default function WalletPage() {
  const params = useParams<{ id: string }>()

  const id = params.id as string

  const {
    data: wallet,
    isFetching: isFetchingWallet,
    error: errorWallet,
    refetch: refetchWallet,
  } = useGetWallet(id)

  const {
    data: transactions,
    isFetching: isFetchingTransactions,
    error: errorTransactions,
    refetch: refetchTransactions,
  } = useGetTransactions({ walletId: id })

  const {
    data: recurringTransactions,
    isFetching: isFetchingRecurringTransactions,
    error: errorRecurringTransactions,
    refetch: refetchRecurringTransactions,
  } = useGetRecurringTransactions({ walletId: id })

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="flex h-full w-full flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/finance">Финансы</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <div className="flex items-center gap-1">
                  {(errorWallet || errorTransactions) && (
                    <RiErrorWarningLine size={16} />
                  )}
                  {(isFetchingWallet || isFetchingTransactions) && <Spinner />}
                  {wallet && wallet.name}
                </div>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wallet && (
            <WalletCard wallet={wallet} refetchWallet={refetchWallet} />
          )}
          {isFetchingWallet && !wallet && <WalletCardSkeleton />}
          {errorWallet && (
            <WalletCardError
              status={errorWallet.status}
              message={errorWallet.message}
              isRetrying={isFetchingWallet}
              onRetry={refetchWallet}
            />
          )}
          <div className="max-h-60">
            {transactions && (
              <TransactionsCard transactions={transactions.items} />
            )}
            {isFetchingTransactions && !transactions && (
              <TransactionsCardSkeleton />
            )}
            {errorTransactions && (
              <TransactionsCardError
                status={errorTransactions.status}
                message={errorTransactions.message}
                isRetrying={isFetchingTransactions}
                onRetry={refetchTransactions}
              />
            )}
          </div>
          <div className="max-h-60">
            {recurringTransactions && (
              <RecurringTransactionsCard
                recurringTransactions={recurringTransactions.items}
              />
            )}
            {isFetchingRecurringTransactions && !recurringTransactions && (
              <RecurringTransactionsCardSkeleton />
            )}
            {errorRecurringTransactions && (
              <RecurringTransactionsCardError
                status={errorRecurringTransactions.status}
                message={errorRecurringTransactions.message}
                isRetrying={isFetchingRecurringTransactions}
                onRetry={refetchRecurringTransactions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
