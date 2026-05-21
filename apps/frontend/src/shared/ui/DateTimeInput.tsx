import { useState } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "../lib/utils"
import { RiCalendarLine } from "@remixicon/react"
import { Input } from "@/components/ui/input"

interface DateTimeInputProps extends Omit<
  React.ComponentProps<"button">,
  "value" | "onChange"
> {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function DateTimeInput({
  value,
  onChange,
  ...props
}: DateTimeInputProps) {
  const [open, setOpen] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return onChange?.(undefined)
    // Сохраняем время от предыдущего значения
    const result = new Date(date)
    if (value) {
      result.setHours(value.getHours(), value.getMinutes())
    }
    onChange?.(result)
  }

  // const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const [hours, minutes] = e.target.value.split(":").map(Number)
  //   const result = new Date(value ?? new Date())
  //   result.setHours(hours, minutes)
  //   onChange?.(result)
  // }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal", props.className)}
        >
          <RiCalendarLine className="mr-2 h-4 w-4" />
          {value
            ? format(value, "PPP HH:mm", { locale: ru })
            : "Выберите дату и время"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          locale={ru}
        />
        <div className="flex flex-col gap-3 border-t p-3">
          <Label className="text-xs text-muted-foreground">Время</Label>
          <div className="flex items-center gap-2">
            {/* Часы */}
            <Input
              className="w-15 text-center font-mono"
              placeholder="ЧЧ"
              maxLength={3}
              value={value ? String(value.getHours()).padStart(2, "0") : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "")
                if (raw === "") return
                // берём последние 2 цифры: "123" → "23"
                const clamped = Math.min(23, Number(raw.slice(-2)))
                const d = new Date(value ?? new Date())
                d.setHours(clamped)
                onChange?.(d)
              }}
            />

            <span className="text-muted-foreground">:</span>

            <Input
              className="w-15 text-center font-mono"
              placeholder="ММ"
              // 3 к.т 123 будем превращать в 23
              maxLength={3}
              value={value ? String(value.getMinutes()).padStart(2, "0") : ""}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "")
                if (raw === "") return
                // берём последние 2 цифры: "123" → "23"
                const clamped = Math.min(59, Number(raw.slice(-2)))
                const d = new Date(value ?? new Date())
                d.setMinutes(clamped)
                onChange?.(d)
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
