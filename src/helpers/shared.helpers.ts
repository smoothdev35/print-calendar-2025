import { type Dispatch, type SetStateAction } from 'react'
import { type Resolver } from 'react-hook-form'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type FormErrors, type InteractiveDay } from '@/models/shared.models'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const getDaysInMonth = (year: number, month: number) => {
  const days = []
  const date = new Date(year, month, 1)

  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return days
}

export const checkForValidDate = (date: string | null) => {
  if (!date) return false
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}

/* This function is a factory function that returns a function that updates the state of a component in an immutable way.
Careful though: it's using spread operator to merge the previous state with the new state, so it's not suitable for deeply nested states. */

export const immutableStateUpdateFactory =
  <TState>(setState: Dispatch<SetStateAction<TState>>) =>
  (newState: Partial<TState>) => {
    setState((prevState) => {
      const clonedState = structuredClone(prevState)
      return { ...clonedState, ...newState }
    })
  }
export const getCleanCalendarDays = (selectedMonth: string): InteractiveDay[] => {
  const currentYear = new Date().getFullYear()

  const daysInMonth = getDaysInMonth(currentYear, parseInt(selectedMonth))
  const firstDayIndex = daysInMonth[0].getDay()
  const lastDayIndex = daysInMonth[daysInMonth.length - 1].getDay()

  return [
    ...Array(firstDayIndex).fill(null),
    ...daysInMonth,
    ...Array(6 - lastDayIndex).fill(null),
  ].map((date) => ({
    activities: [],
    date: date ? date.toISOString() : null,
  }))
}

/* Using any here because we don't know the shape of the values, and adding a generic type doesn't help,
  since we're checking for empty values regardless of the type */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customResolver: Resolver<any> = async (values) => {
  const errors: FormErrors = {}

  for (const [key, value] of Object.entries(values)) {
    if (!value) {
      errors[key] = {
        type: 'required',
        message: `${key} is required`,
      }
    }
  }

  return {
    values: Object.keys(errors).length ? {} : values,
    errors,
  }
}
