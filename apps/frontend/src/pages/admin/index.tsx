import { Separator } from "@/components/ui/separator"
import { useGetUsersAnalytics } from "@/features/admin/model/useGetUsersAnalytics"
import {
  UsersAnalyticsCard,
  UsersAnalyticsCardError,
  UsersAnalyticsCardSkeleton,
} from "@/widgets/admin/ui/AnalyticsCard"
import { Link } from "react-router-dom"

export default function AdminPage() {
  // const { data: users, isLoading } = useGetAllUsers()
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    isError,
    error,
  } = useGetUsersAnalytics()
  console.log(analytics)

  return (
    <div className="mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium">Администрирование</h1>
        <p className="text-sm text-muted-foreground">
          Управление{" "}
          <Link
            to={"https://bolahnov.ru"}
            target="_blank"
            className="underline"
          >
            bolahnov.ru
          </Link>
        </p>
      </div>
      <Separator />
      {/* {isLoading && <UsersEmptyList />}
      {!!users?.length && <UsersList users={users} />} */}

      {isLoadingAnalytics && <UsersAnalyticsCardSkeleton />}
      {isError && (
        <UsersAnalyticsCardError
          status={error?.status}
          message={error?.message}
        />
      )}
      {!!analytics && <UsersAnalyticsCard data={analytics} />}
    </div>
  )
}
