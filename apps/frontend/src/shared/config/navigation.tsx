import {
  RiTaskLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiMusicLine,
  RiMessage2Line,
  RiUserLine,
  RiAppsLine,
} from "@remixicon/react"

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export const sidebarItems: NavItem[] = [
  { label: "Задачи", href: "/tasks", icon: <RiTaskLine size={18} /> },
  {
    label: "Финансы",
    href: "/finance",
    icon: <RiMoneyDollarCircleLine size={18} />,
  },
  {
    label: "Расписание",
    href: "/schedule",
    icon: <RiCalendarLine size={18} />,
  },
  { label: "Музыка", href: "/music", icon: <RiMusicLine size={18} /> },
  { label: "Чат", href: "/chat", icon: <RiMessage2Line size={18} /> },
]

export const sidebarBottomItems: NavItem[] = [
  { label: "Профиль", href: "/profile", icon: <RiUserLine size={18} /> },
]

export const organizationItems: NavItem[] = [
  { label: "Задачи", href: "/tasks", icon: <RiTaskLine size={18} /> },
  {
    label: "Финансы",
    href: "/finance",
    icon: <RiMoneyDollarCircleLine size={18} />,
  },
  {
    label: "Расписание",
    href: "/schedule",
    icon: <RiCalendarLine size={18} />,
  },
]

export const bottomNavItems = [
  { label: "Организация", icon: <RiAppsLine size={22} />, isOrg: true },
  { label: "Музыка", href: "/music", icon: <RiMusicLine size={22} /> },
  { label: "Чат", href: "/chat", icon: <RiMessage2Line size={22} /> },
  { label: "Профиль", href: "/profile", icon: <RiUserLine size={22} /> },
]
