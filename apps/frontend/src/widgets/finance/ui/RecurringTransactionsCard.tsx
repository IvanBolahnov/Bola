import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiArrowLeftRightLine,
  RiLoopRightLine,
} from "@remixicon/react"
import type { RecurringTransaction } from "@/entities/finance/transactions/model/types"
import {
  TransactionTypes,
  TransactionTypesRu,
} from "@/entities/finance/transactions/model/types"
import { numberToMoney } from "@/shared/lib/moneyHandlers"
import { getCurrencySymbolByValue } from "@/shared/lib/currencyHalpers"
import { cn } from "@/shared/lib/utils"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { getRecurringIntervalRuByValue } from "@/shared/lib/reccuringHalpers"

type RecurringTransactionsCardProps = {
  recurringTransactions: RecurringTransaction[]
}

const typeConfig = {
  [TransactionTypes.INCOME]: {
    icon: RiArrowDownLine,
    className: "text-green-500",
    amountClassName: "text-green-500",
    prefix: "+",
  },
  [TransactionTypes.EXPENSE]: {
    icon: RiArrowUpLine,
    className: "text-red-500",
    amountClassName: "text-red-500",
    prefix: "-",
  },
  [TransactionTypes.TRANSFER]: {
    icon: RiArrowLeftRightLine,
    className: "text-blue-500",
    amountClassName: "text-foreground",
    prefix: "",
  },
}

export function RecurringTransactionsCard({
  recurringTransactions,
}: RecurringTransactionsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xs/relaxed font-semibold text-muted-foreground">
          Подписки
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full overflow-auto">
        {recurringTransactions.length === 0 ? (
          <Empty className="flex h-full items-center justify-center p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <RiLoopRightLine />
              </EmptyMedia>
              <EmptyTitle>Подписок нет</EmptyTitle>
              <EmptyDescription>
                Вы еще не создали ни одного подписки.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="h-full">
            <ul className="flex flex-col gap-2">
              {recurringTransactions.map((transaction) => {
                const config = typeConfig[transaction.type]
                const Icon = config.icon
                const currency = getCurrencySymbolByValue(
                  transaction.wallet.currency
                )

                return (
                  <li
                    key={transaction.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                  >
                    <div className={cn("shrink-0", config.className)}>
                      <Icon size={18} />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                      <span className="truncate text-sm font-medium">
                        {transaction.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {transaction.category?.name ??
                          TransactionTypesRu[
                            transaction.type.toUpperCase() as keyof typeof TransactionTypesRu
                          ]}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          config.amountClassName
                        )}
                      >
                        {getRecurringIntervalRuByValue(transaction.interval)}{" "}
                        {config.prefix}
                        {numberToMoney(transaction.amount)} {currency}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.nextDate).toLocaleDateString(
                          "ru-RU"
                        )}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export function RecurringTransactionsCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xs/relaxed font-semibold text-muted-foreground">
          <Spinner />
          Подписки
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-4.5 w-4.5 rounded-full" />
            <div className="flex flex-1 flex-col gap-0.5">
              <Skeleton className="h-5 w-[60%]" />
              <Skeleton className="h-4 w-[40%]" />
            </div>
            <div className="flex flex-col items-end">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-0.75 h-3.5 w-18" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

type RecurringTransactionsCardErrorProps = {
  status?: string | number
  message?: string
  isRetrying?: boolean
  onRetry?: () => void
}
export function RecurringTransactionsCardError({
  status,
  message,
}: RecurringTransactionsCardErrorProps) {
  return (
    <Card className="h-full">
      <CardHeader>
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
    </Card>
  )
}
