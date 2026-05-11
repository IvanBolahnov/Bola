import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocation, useNavigate } from "react-router"

const TABS = [
  { label: "Счета", path: "/finance" },
  { label: "Категории", path: "/finance/categories" },
]

export function FinanceTabsNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const activeTab = TABS.find((t) => t.path === pathname)?.path ?? TABS[0].path

  return (
    <Tabs value={activeTab} onValueChange={(path) => navigate(path)}>
      <TabsList variant="line">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.path} value={tab.path}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
