import { useAuthStore } from "@/entities/user/model/authStore"
import { useLogout } from "@/features/auth/model/useLogout"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { RiPencilLine } from "@remixicon/react"
import { EditNameDialog } from "@/features/user/ui/EditNameDialog"
import { SessionsList } from "@/features/auth/ui/SessionsList"
import { Badge } from "@/components/ui/badge"
import { UserRoles } from "@/entities/user/model/types"
import { getUserRoleRuByValue } from "@/shared/lib/roleHalpers"
import { Link } from "react-router-dom"
import { AdminSvg } from "@/assets/AdminSvg"

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout, isPending } = useLogout()

  return (
    <div className="mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium">Профиль</h1>
        <div className="flex items-center gap-1">
          <p className="text-sm text-muted-foreground">Управление аккаунтом</p>
          {(user?.role ?? UserRoles.USER) !== UserRoles.USER && (
            <>
              <Separator orientation="vertical" />
              <Badge>{getUserRoleRuByValue(user!.role)}</Badge>
              {user?.role === UserRoles.ADMIN && (
                <Button asChild size={"icon"} variant={"ghost"}>
                  <Link to="/admin">
                    <AdminSvg />
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">Имя</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <EditNameDialog>
              <Button size={"icon"} variant={"outline"}>
                <RiPencilLine />
              </Button>
            </EditNameDialog>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">Email</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
        </div>
      </div>
      <Separator />
      <Button
        variant="destructive"
        onClick={() => logout()}
        disabled={isPending}
        className="w-max"
      >
        {isPending ? [<Spinner />, "Выход..."] : "Выйти из аккаунта"}
      </Button>
      <SessionsList />
    </div>
  )
}
