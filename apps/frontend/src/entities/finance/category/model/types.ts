import {
  RiBeerLine,
  RiBookLine,
  RiBriefcaseLine,
  RiCarLine,
  RiComputerLine,
  RiEmotionLine,
  RiGamepadLine,
  RiHeart2Line,
  RiHome5Line,
  RiRestaurantLine,
  RiShirtLine,
  RiWifiLine,
} from "@remixicon/react"

export const CategoryTypes = {
  INCOME: "income",
  EXPENSE: "expense",
} as const

export const CategoryTypesRu = {
  INCOME: "Доход",
  EXPENSE: "Расход",
} as const

export type CategoryTypeEnum =
  (typeof CategoryTypes)[keyof typeof CategoryTypes]

export const CategoryIcons = {
  car: RiCarLine,
  home: RiHome5Line,
  restaurant: RiRestaurantLine,
  beer: RiBeerLine,
  heart: RiHeart2Line,
  wifi: RiWifiLine,
  book: RiBookLine,
  shirt: RiShirtLine,
  briefcase: RiBriefcaseLine,
  gamepad: RiGamepadLine,
  computer: RiComputerLine,
  emotion: RiEmotionLine,
} as const

export interface Category {
  id: string
  userId: string
  name: string
  type: CategoryTypeEnum
  icon?: keyof typeof CategoryIcons
  color?: string
  createdAt: string
  updatedAt: string
}
