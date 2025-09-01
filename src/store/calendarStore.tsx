import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { MONTHS } from '@/enums/shared.enums'
import {
  type Event,
  type InteractiveDay,
  type TMonths,
  type NewEvent,
} from '@/models/shared.models'
import { getCleanCalendarDays } from '@/helpers/shared.helpers'
import { currentMonth } from '@/lib/utils'
import { createEvent as createEventAPI } from '@/services/eventService'

type InteractiveMonth = {
  month: TMonths
  days: InteractiveDay[]
}

type CalendarState = {
  selectedMonth: TMonths
  interactiveCalendar: InteractiveMonth[]
  setSelectedMonth: (month: TMonths) => void
  setInteractiveCalendar: (calendar: InteractiveMonth[]) => void
  addEvent: (event: Event, selectedDate: string, selectedMonth: TMonths) => void
  deleteEvent: (eventId: string, selectedMonth: TMonths) => void
  createEvent: (event: NewEvent, selectedDate: string, selectedMonth: TMonths) => Promise<void>
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      selectedMonth: currentMonth,
      interactiveCalendar: Object.values(MONTHS).map((month) => ({
        month,
        days: getCleanCalendarDays(month),
      })),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setInteractiveCalendar: (calendar) => set({ interactiveCalendar: calendar }),
      addEvent: (event: Event, selectedDate: string, selectedMonth: TMonths) => {
        set((state) => {
          const monthIndex = state.interactiveCalendar.findIndex(
            ({ month }) => month === selectedMonth
          )

          if (monthIndex === -1) return state

          const dayIndex = state.interactiveCalendar[monthIndex].days.findIndex(
            ({ date }) => date === selectedDate
          )

          if (dayIndex === -1) return state

          const newInteractiveCalendar = [...state.interactiveCalendar]
          const updatedDay = {
            ...newInteractiveCalendar[monthIndex].days[dayIndex],
            events: [...newInteractiveCalendar[monthIndex].days[dayIndex].events, event],
          }

          newInteractiveCalendar[monthIndex].days[dayIndex] = updatedDay

          return { interactiveCalendar: newInteractiveCalendar }
        })
      },
      deleteEvent: (eventId: string, selectedMonth: TMonths) => {
        set((state) => {
          const monthIndex = state.interactiveCalendar.findIndex(
            ({ month }) => month === selectedMonth
          )

          if (monthIndex === -1) return state

          const newInteractiveCalendar = [...state.interactiveCalendar]
          const month = newInteractiveCalendar[monthIndex]

          const dayIndex = month.days.findIndex((day) =>
            day.events.some((event) => event.id === eventId)
          )

          if (dayIndex === -1) return state

          const updatedDay = {
            ...month.days[dayIndex],
            events: month.days[dayIndex].events.filter((event) => event.id !== eventId),
          }

          newInteractiveCalendar[monthIndex].days[dayIndex] = updatedDay

          return { interactiveCalendar: newInteractiveCalendar }
        })
      },
      createEvent: async (event: NewEvent, selectedDate: string, selectedMonth: TMonths) => {
        const tempId = uuidv4()
        const tempEvent: Event = { ...event, id: tempId }

        get().addEvent(tempEvent, selectedDate, selectedMonth)

        try {
          const newEvent = await createEventAPI(event)
          set((state) => {
            const monthIndex = state.interactiveCalendar.findIndex(
              ({ month }) => month === selectedMonth
            )

            if (monthIndex === -1) return state

            const dayIndex = state.interactiveCalendar[monthIndex].days.findIndex(
              ({ date }) => date === selectedDate
            )

            if (dayIndex === -1) return state

            const newInteractiveCalendar = [...state.interactiveCalendar]
            const updatedDay = {
              ...newInteractiveCalendar[monthIndex].days[dayIndex],
              events: newInteractiveCalendar[monthIndex].days[dayIndex].events.map((e) =>
                e.id === tempId ? newEvent : e
              ),
            }

            newInteractiveCalendar[monthIndex].days[dayIndex] = updatedDay

            return { interactiveCalendar: newInteractiveCalendar }
          })
        } catch (error) {
          console.error('Failed to create event:', error)
          // Revert the optimistic update
          get().deleteEvent(tempId, selectedMonth)
        }
      },
    }),
    {
      name: 'calendar-store',
    }
  )
)
