import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FinanceTabsNav } from "../FinanceTabsNav"
import { Link } from "react-router-dom"
import { CategoriesList } from "@/widgets/finance/ui/СategoriesList"

export default function CategoriesPage() {
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
              <BreadcrumbPage>Категории</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <FinanceTabsNav />
        <CategoriesList />
      </div>
    </div>
  )
}
