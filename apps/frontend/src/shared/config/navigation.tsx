import { AdminSvg } from "@/assets/AdminSvg"
import { LogoSvg } from "@/assets/LogoSvg"
import { useAuthStore } from "@/entities/user/model/authStore"
import {
  RiTaskLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiMusicLine,
  RiMessage2Line,
  // RiUserLine,
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
  useAuthStore.getState().user?.role === "admin"
    ? {
        label: "Администрирование",
        href: "/admin",
        icon: <AdminSvg id="sidebar" />,
      }
    : undefined,
  {
    label: "Профиль",
    href: "/profile",
    icon: <LogoSvg id="sidebar" />,
  },
].filter((item) => item !== undefined)

const BOTTOM_NAV_ICON_SIZE = "size-4"

export const organizationItems: NavItem[] = [
  {
    label: "Задачи",
    href: "/tasks",
    icon: <RiTaskLine className={BOTTOM_NAV_ICON_SIZE} />,
  },
  {
    label: "Финансы",
    href: "/finance",
    icon: <RiMoneyDollarCircleLine className={BOTTOM_NAV_ICON_SIZE} />,
  },
  {
    label: "Расписание",
    href: "/schedule",
    icon: <RiCalendarLine className={BOTTOM_NAV_ICON_SIZE} />,
  },
]

export const bottomNavItems = [
  {
    label: "Организация",
    icon: <RiAppsLine className={BOTTOM_NAV_ICON_SIZE} />,
    isOrg: true,
  },
  {
    label: "Музыка",
    href: "/music",
    icon: <RiMusicLine className={BOTTOM_NAV_ICON_SIZE} />,
  },
  {
    label: "Чат",
    href: "/chat",
    icon: <RiMessage2Line className={BOTTOM_NAV_ICON_SIZE} />,
  },
  // { label: "Профиль", href: "/profile", icon: <RiUserLine size={22} /> },
  {
    label: "Профиль",
    href: "/profile",
    icon: <LogoSvg id="bottom__nav" className={BOTTOM_NAV_ICON_SIZE} />,
  },
]
