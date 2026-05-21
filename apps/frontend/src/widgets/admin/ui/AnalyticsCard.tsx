import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { RiBarChartLine } from "@remixicon/react"
import type { UsersAndSessionsAnalytics } from "@/features/admin/types/usersAnalytics.type"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, Cell, Pie, PieChart, XAxis } from "recharts"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

type UsersAnalyticsCardProps = {
  data: UsersAndSessionsAnalytics
}

const chartConfig = {
  count: {
    label: "Пользователи",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

export function UsersAnalyticsCard({ data }: UsersAnalyticsCardProps) {
  console.log(data)

  const { users, sessions } = data

  const chartData: {
    date: string
    count: number
  }[] = []
  users.registrationsByDay.forEach((item, index) =>
    chartData.push({
      date: item.date,
      count:
        index <= 0
          ? users.total - users.new.last30d + item.count
          : chartData[index - 1].count + item.count,
    })
  )
  console.log(chartData)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="w-full">
        <CardHeader>
          <CardDescription>Всего пользователей</CardDescription>
          <CardTitle className="text-3xl">
            {users.total}{" "}
            <span className="text-base text-emerald-400">
              +{Math.floor((users.new.last30d / users.total) * 100)}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>За 24ч: {users.new.last24h}</p>
          <p>За 7 дней: {users.new.last7d}</p>
          <p>За 30 дней: {users.new.last30d}</p>
        </CardContent>
        <CardFooter>
          <ChartContainer
            config={chartConfig}
            className="h-full max-h-50 w-full"
          >
            <BarChart data={chartData}>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  format(new Date(value), "d MMM", { locale: ru })
                }
                interval="preserveStartEnd"
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      format(new Date(value), "d MMMM yyyy", { locale: ru })
                    }
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardFooter>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="h-full w-full">
          <CardHeader>
            <CardDescription>Сессии</CardDescription>
            <CardTitle className="text-3xl">{sessions.total}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>Активных: {sessions.active}</p>
            <p>Отозвано: {sessions.revoked}</p>
            <p>Reuse-атаки: {sessions.securityRevokes}</p>
          </CardContent>
        </Card>

        <Card className="w-full shrink-0">
          <CardHeader>
            <CardDescription>Процент не отозванных сессий</CardDescription>
            <CardTitle className="text-3xl">
              {sessions.acceptanceRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ChartContainer config={chartConfig} className="h-25 w-full">
              <PieChart>
                <Pie
                  data={[
                    { name: "Принято", value: sessions.acceptanceRate },
                    { name: "Отозвано", value: 100 - sessions.acceptanceRate },
                  ]}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  cx="50%"
                  cy="100%"
                  outerRadius={80}
                  innerRadius={50}
                  strokeWidth={0}
                >
                  <Cell fill="var(--color-chart-2)" />
                  <Cell fill="var(--color-sidebar-ring)" />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardDescription>Топ устройств</CardDescription>
          <CardTitle className="truncate text-3xl">
            {sessions.topDevices[0]?.deviceName ?? "—"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {sessions.topDevices.map((d) => (
            <p key={d.deviceName} className="flex justify-between gap-2">
              <span className="truncate">{d.deviceName}</span>
              <span className="shrink-0">{d.count}</span>
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function UsersAnalyticsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="w-full">
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-3.5 w-[50%]" />
            </CardDescription>
            <CardTitle>
              <Skeleton className="h-8 w-[40%]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3.5 w-[70%]" />
            <Skeleton className="h-3.5 w-[55%]" />
            <Skeleton className="h-3.5 w-[60%]" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function UsersAnalyticsCardError({
  message,
  status,
}: {
  message?: string
  status?: number
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiBarChartLine />
        </EmptyMedia>
        <EmptyTitle>{status ?? "Ошибка"}</EmptyTitle>
        <EmptyDescription>
          {message ?? "Не удалось загрузить аналитику"}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
