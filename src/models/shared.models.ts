import { type MONTHS } from '@/enums/shared.enums'

export type Event = {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  emoji: string
}

export type NewEvent = Omit<Event, 'id'>

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
  events: Event[]
  date: string | null
}

export type DropdownOption<TValue extends string = string> = {
  label: string
  value: TValue
}

export type TMonths = (typeof MONTHS)[keyof typeof MONTHS]
