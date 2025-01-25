import { create } from 'zustand'
import { MONTHS } from '@/enums/shared.enums'
import {
  type InteractiveDay,
  type TextAndIcon,
  type TMonths,
} from '@/models/shared.models'
import { getCleanCalendarDays } from '@/helpers/shared.helpers'
import { currentMonth } from '@/lib/utils'

type InteractiveMonth = {
  month: TMonths
  days: InteractiveDay[]
}

type CalendarState = {
  selectedMonth: TMonths
  interactiveCalendar: InteractiveMonth[]
  setSelectedMonth: (month: TMonths) => void
  setInteractiveCalendar: (calendar: InteractiveMonth[]) => void
  addDayInformation: (
    day: Date,
    month: TMonths,
    information: TextAndIcon
  ) => void
  // updateDayInformation: (day: Date, month: TMonths, information: TextAndIcon) => void
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedMonth: currentMonth,
  interactiveCalendar: Object.values(MONTHS).map((month) => ({
    month,
    days: getCleanCalendarDays(month),
  })),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setInteractiveCalendar: (calendar) => set({ interactiveCalendar: calendar }),
  addDayInformation: (
    selectedDate: Date,
    selectedMonth: TMonths,
    information: TextAndIcon
  ) => {
    set((state) => {
      const monthIndex = state.interactiveCalendar.findIndex(
        ({ month }) => month === selectedMonth
      )

      if (monthIndex === -1) return state

      const dayIndex = state.interactiveCalendar[monthIndex].days.findIndex(
        ({ date }) => date?.getTime() === selectedDate.getTime()
      )

      if (dayIndex === -1) return state

      const newInteractiveCalendar = state.interactiveCalendar.slice()
      newInteractiveCalendar[monthIndex].days[dayIndex].activities.push(
        information
      )

      return { interactiveCalendar: newInteractiveCalendar }
    })
  },
}))
