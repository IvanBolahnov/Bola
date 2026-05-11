import {
  RecurringIntervals,
  RecurringIntervalsRu,
  type RecurringIntervalEnum,
} from "@/entities/finance/transactions/model/types"

export const getRecurringIntervalRuByKey = (
  key: keyof typeof RecurringIntervalsRu
) => RecurringIntervalsRu?.[key]

export const getRecurringIntervalKeyByValue = (value: RecurringIntervalEnum) =>
  Object.keys(RecurringIntervals)[
    Object.values(RecurringIntervals).indexOf(value)
  ] as keyof typeof RecurringIntervals

export const getRecurringIntervalRuByValue = (value: RecurringIntervalEnum) =>
  getRecurringIntervalRuByKey(getRecurringIntervalKeyByValue(value))
