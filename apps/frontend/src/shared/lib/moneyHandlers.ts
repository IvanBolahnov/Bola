export const moneyToNumber = (
  value: string,
  config = {
    min: -1_000_000_000_000,
    max: 1_000_000_000_000,
  }
): number | undefined => {
  const formatted = Number(value.replaceAll(" ", "").replace(",", "."))
  if (Number.isNaN(formatted) || value.trim() === "") {
    return undefined
  }

  if (formatted > config.max) return config.max
  if (formatted < config.min) return config.min

  return formatted
}

export const numberToMoney = (
  value: number | undefined,
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
): string => {
  if (value === undefined) return ""
  const formattedValue = Math.floor(Number((value * 100).toFixed(0))) / 100

  return formattedValue.toLocaleString("ru-RU", options)
}
