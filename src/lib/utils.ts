import { MONTHS } from "@/enums/shared.enums"
import { type DropdownOption, type TMonths } from "@/models/shared.models"

export const monthsDropdownOptions: DropdownOption<TMonths>[] = Object.entries(MONTHS).map(([key, value]) => ({
  label: key,
  value
}))

const availableEmojis = ['🎂','❤️','🚨','🗓️']

export const emojisDropdownOptions: DropdownOption[] = availableEmojis.map((emoji) => ({
  value: emoji,
  label: emoji,
}))

export const currentMonth = String(new Date().getMonth()) as TMonths