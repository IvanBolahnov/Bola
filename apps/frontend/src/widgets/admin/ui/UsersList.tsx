import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiRefreshLine, RiUserLine, RiWalletLine } from "@remixicon/react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CreateOrEditWalletDialog } from "@/features/finance/wallets/ui/CreateOrEditWalletDialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import type { UserWithSessions } from "@/entities/user/model/types"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

type UsersListProps = {
  users: UserWithSessions[]
}

// TODO

export function UsersList({ users }: UsersListProps) {
  if (users.length === 0) {
    return <UsersEmptyList />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {users.map((user) => (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="truncate">{user.name}</CardTitle>
            <CardDescription className="truncate" title={user.email}>
              {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Сессии: {user.sessions.length}</p>
            <p>
              В Сети:{" "}
              {user.sessions
                .sort(
                  (sessionA, sessionB) =>
                    new Date(sessionB.lastUsedAt).getTime() -
                    new Date(sessionA.lastUsedAt).getTime()
                )
                .map(
                  (session) =>
                    format(session.lastUsedAt, "PPP HH:mm", { locale: ru }) +
                    " "
                )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function UsersEmptyList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiUserLine />
        </EmptyMedia>
        <EmptyTitle>Пользователей нет</EmptyTitle>
      </EmptyHeader>
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
