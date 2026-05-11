import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { WalletsList } from "@/features/finance/wallets/ui/WalletsList"
import { FinanceTabsNav } from "@/pages/finance/FinanceTabsNav"

export default function FinancePage() {
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
        <WalletsList />
      </div>
    </div>
  )
}
