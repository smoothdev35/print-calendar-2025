import { type MONTHS } from '@/enums/shared.enums'

export type Event = {
  id: string; // Unique identifier for the event
  title: string;
  description: string;
  startTime: string; // ISO string for date and time
  endTime: string; // ISO string for date and time
  emoji?: string; // Optional: for visual representation
  // Optional fields will be added later
};

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
