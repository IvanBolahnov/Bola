import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useGetSessions } from "../model/useGetSessions"
import { Button } from "@/components/ui/button"
import { RiLogoutBoxRLine } from "@remixicon/react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRevokeSession } from "../model/useRevokeSession"

export function SessionsList() {
  const { data: sessions, isPending } = useGetSessions()

  const { mutate: revokeSession } = useRevokeSession()

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Активные сессии</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {sessions?.map((session) => (
          <Card className="w-full" key={session.id}>
            <CardHeader>
              <CardTitle className="truncate">{session.deviceName}</CardTitle>
              <CardDescription>
                {new Date(session.lastUsedAt).toLocaleString()}
              </CardDescription>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size={"icon"}
                      onClick={() => revokeSession(session.id)}
                    >
                      <RiLogoutBoxRLine />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Удалить сессию</p>
                  </TooltipContent>
                </Tooltip>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>
      {!isPending && sessions?.length === 0 && (
        <p className="text-sm text-muted-foreground">Нет активных сессий</p>
      )}
    </div>
  )
}
