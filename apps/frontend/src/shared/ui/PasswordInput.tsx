import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react"
import { cn } from "@/shared/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type PasswordInputProps = React.ComponentProps<"input"> & {
  className?: string
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput
        type={show ? "text" : "password"}
        className={cn("pr-9", className)}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
        >
          {show ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  )
}
