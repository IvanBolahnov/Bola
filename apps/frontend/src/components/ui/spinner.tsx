import { cn } from "@/shared/lib/utils"
import { RiLoader4Line as RiLoaderLine } from "@remixicon/react"

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "children">) {
  return (
    <RiLoaderLine
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
