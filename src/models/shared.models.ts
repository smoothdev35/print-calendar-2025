import { type MONTHS } from '@/enums/shared.enums'

type FieldError = {
  type: string
  message: string
}

export type FormErrors = {
  [key: string]: FieldError
}

export type TextAndIcon = {
  emoji: string
  text: string
}

export type InteractiveDay = {
  activities: TextAndIcon[]
  date: string | null
}

export type DropdownOption<TValue extends string = string> = {
  label: string
  value: TValue
}

export type TMonths = (typeof MONTHS)[keyof typeof MONTHS]
