import { CategoryIcons } from "@/entities/finance/category/model/types"

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string
  className?: string
}) {
  const Icon = CategoryIcons[icon as keyof typeof CategoryIcons] || undefined

  if (!Icon) {
    return
  }

  return <Icon size={56} className={className} />
}
