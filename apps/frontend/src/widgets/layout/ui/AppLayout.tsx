import { Sidebar } from "./Sidebar"
import { BottomNav } from "./BottomNav"
import { Skeleton } from "@/components/ui/skeleton"
interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-svh w-full overflow-hidden">
      {/* Sidebar — скрыт на мобильных */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Основной контент */}
      <div className="overflow flex flex-1 flex-col">
        <main className="flex-1 overflow-auto px-4 md:px-6">
          <div className="h-full py-4 md:py-6">{children}</div>
        </main>

        {/* Bottom nav — только на мобильных */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}

export const AppLayoutSkeleton = () => (
  <AppLayout>
    <div className="flex gap-2">
      <div className="w-full">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 grow" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="mt-4 box-border h-4 w-full" />
          <Skeleton className="box-border h-4 w-[70%]" />
        </div>
      </div>
      <div className="hidden w-full md:flex">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
    <div className="mt-4 flex gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="hidden h-32 w-full md:block" />
      <Skeleton className="hidden h-32 w-full md:block" />
    </div>
  </AppLayout>
)
