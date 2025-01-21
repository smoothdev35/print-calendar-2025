import { IDropdownOption } from "@/components/shared/PopoverComponent"

export const monthsOptions: IDropdownOption[] = Array.from(
  { length: 12 },
  (_, i) => ({
    value: String(i),
    label: new Date(2025, i).toLocaleString('default', { month: 'long' }),
  })
)

const availableEmojis = ['🎂','❤️','🚨','🗓️']

export const emojiOptions: IDropdownOption[] = availableEmojis.map((emoji) => ({
  value: emoji,
  label: emoji,
}))
