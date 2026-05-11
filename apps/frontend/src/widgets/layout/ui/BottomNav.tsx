import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// import { cn } from "@/shared/lib/utils"
import { bottomNavItems, organizationItems } from "@/shared/config/navigation"

export function BottomNav() {
  const [orgOpen, setOrgOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isOrg = ["/tasks", "/finance", "/schedule"].some((p) =>
    location.pathname.startsWith(p)
  )

  return (
    <nav className="flex h-16 items-center justify-around border-t bg-background px-4">
      {bottomNavItems.map((tab) => {
        if (tab.isOrg) {
          return (
            <Popover key="org" open={orgOpen} onOpenChange={setOrgOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={isOrg ? "secondary" : "ghost"}
                  size="icon"
                  className="h-12 w-14 flex-col gap-0.5"
                >
                  {tab.icon}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                className="m-1 w-48 border p-1 shadow-none ring-0"
              >
                <div className="flex flex-col gap-1">
                  {organizationItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={
                        location.pathname.startsWith(item.href)
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        navigate(item.href)
                        setOrgOpen(false)
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )
        }

        const active = location.pathname.startsWith(tab.href!)

        return (
          <Button
            key={tab.href}
            variant={active ? "secondary" : "ghost"}
            size="icon"
            className="h-12 w-14 flex-col gap-0.5"
            onClick={() => navigate(tab.href!)}
          >
            {tab.icon}
          </Button>
        )
      })}
    </nav>
  )
}
