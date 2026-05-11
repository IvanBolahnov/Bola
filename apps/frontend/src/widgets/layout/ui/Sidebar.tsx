import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/shared/lib/utils"
import { sidebarItems, sidebarBottomItems } from "@/shared/config/navigation"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import { useLayoutStore } from "@/entities/user/model/layoutStore"

export function Sidebar() {
  const { isSidebarOpen: collapsed, toggleSidebarOpen } = useLayoutStore()
  const navigate = useNavigate()
  const location = useLocation()

  const renderItem = (item: (typeof sidebarItems)[0]) => {
    const active = location.pathname.startsWith(item.href)

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <Button
              variant={active ? "secondary" : "ghost"}
              size="icon"
              onClick={() => navigate(item.href)}
              className="h-10 w-10"
            >
              {item.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      )
    }

    return (
      <Tooltip key={item.href}>
        <TooltipTrigger asChild></TooltipTrigger>
        <Button
          key={item.href}
          variant={active ? "secondary" : "ghost"}
          className="ai-center h-10 w-full justify-start gap-4 pr-3 pl-3"
          onClick={() => navigate(item.href)}
        >
          {item.icon}
          {item.label}
        </Button>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden border-r bg-background transition-all duration-200",
        collapsed ? "w-14" : "w-52"
      )}
    >
      <div className="flex flex-1 flex-col gap-1 p-2">
        {sidebarItems.map(renderItem)}
      </div>
      <div className="flex flex-col gap-1 p-2">
        {sidebarBottomItems.map(renderItem)}
      </div>

      <Separator />

      <div className="flex w-full flex-col items-end gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={toggleSidebarOpen}
            >
              {collapsed ? (
                <RiArrowRightSLine size={18} />
              ) : (
                <RiArrowLeftSLine size={18} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? "Развернуть" : "Свернуть"}
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  )
}
