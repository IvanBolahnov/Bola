import { Fragment, type JSX } from "react"

type MenuVariant = "dropdown" | "context"

export type MenuItem =
  | {
      contextItem: JSX.Element
      dropdownItem: JSX.Element
    }
  | undefined

interface MenuItemsProps {
  items: MenuItem[]
  type: MenuVariant
}

export function MenuItems({ items, type }: MenuItemsProps) {
  return items.map((item, i) =>
    type === "context" ? (
      <Fragment key={i}>{item?.contextItem}</Fragment>
    ) : (
      <Fragment key={i}>{item?.dropdownItem}</Fragment>
    )
  )
}
