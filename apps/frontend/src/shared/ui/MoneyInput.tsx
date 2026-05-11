import { useEffect, useState } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/shared/lib/utils"
import type { CurrencySymbols } from "@/entities/finance/wallet/model/types"
import { moneyToNumber, numberToMoney } from "../lib/moneyHandlers"

type MoneyInputProps = React.ComponentProps<"input"> & {
  value: number
  onChange: (value: number | undefined) => void
  className?: string
  currencySymbol?: (typeof CurrencySymbols)[keyof typeof CurrencySymbols]
}

export function MoneyInput({
  currencySymbol,
  value,
  onChange,
  className,
  ...props
}: MoneyInputProps) {
  const [valueLabel, setValueLabel] = useState<string>(numberToMoney(value))

  useEffect(() => {
    onChange(moneyToNumber(valueLabel))
  }, [valueLabel, onChange])

  return (
    <InputGroup>
      <InputGroupInput
        className={cn(currencySymbol && "pr-9", className)}
        {...props}
        value={valueLabel}
        onChange={(e) =>
          setValueLabel((prev) => {
            console.log(
              e.target.value,
              prev,
              moneyToNumber(e.target.value),
              numberToMoney(moneyToNumber(e.target.value))
            )

            if (moneyToNumber(e.target.value) !== undefined) {
              if (e.target.value.at(-1) === ",")
                return `${numberToMoney(moneyToNumber(e.target.value))},`

              return numberToMoney(moneyToNumber(e.target.value))
            }
            if (e.target.value.trim() === "-") return "-"
            if (e.target.value.trim() === "") {
              return ""
            }
            return prev
          })
        }
      />
      {currencySymbol && (
        <InputGroupAddon align="inline-end">{currencySymbol}</InputGroupAddon>
      )}
    </InputGroup>
  )
}
