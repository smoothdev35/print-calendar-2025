import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MONTHS } from '@/enums/shared.enums'
import { type Event, type InteractiveDay, type TMonths } from '@/models/shared.models'
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
  addEvent: (
    selectedDate: string,
    selectedMonth: TMonths,
    event: Event
  ) => void
  deleteEvent: (eventId: string, selectedMonth: TMonths) => void
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      selectedMonth: currentMonth,
      interactiveCalendar: Object.values(MONTHS).map((month) => ({
        month,
        days: getCleanCalendarDays(month),
      })),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setInteractiveCalendar: (calendar) => set({ interactiveCalendar: calendar }),
      addEvent: (
        selectedDate: string,
        selectedMonth: TMonths,
        event: Event
      ) => {
        set((state) => {
          const monthIndex = state.interactiveCalendar.findIndex(
            ({ month }) => month === selectedMonth
          );

          if (monthIndex === -1) return state;

          const dayIndex = state.interactiveCalendar[monthIndex].days.findIndex(
            ({ date }) => {
              return date === selectedDate;
            }
          );

          if (dayIndex === -1) return state;

          const newInteractiveCalendar = [...state.interactiveCalendar];
          const updatedDay = {
            ...newInteractiveCalendar[monthIndex].days[dayIndex],
            events: [
              ...newInteractiveCalendar[monthIndex].days[dayIndex].events,
              event,
            ],
          };

          newInteractiveCalendar[monthIndex].days[dayIndex] = updatedDay;

          return { interactiveCalendar: newInteractiveCalendar };
        });
      },
      deleteEvent: (eventId: string, selectedMonth: TMonths) => {
        set((state) => {
          const monthIndex = state.interactiveCalendar.findIndex(
            ({ month }) => month === selectedMonth
          );

          if (monthIndex === -1) return state;

          const newInteractiveCalendar = [...state.interactiveCalendar];
          const month = newInteractiveCalendar[monthIndex];

          const dayIndex = month.days.findIndex((day) =>
            day.events.some((event) => event.id === eventId)
          );

          if (dayIndex === -1) return state;

          const updatedDay = {
            ...month.days[dayIndex],
            events: month.days[dayIndex].events.filter(
              (event) => event.id !== eventId
            ),
          };

          newInteractiveCalendar[monthIndex].days[dayIndex] = updatedDay;

          return { interactiveCalendar: newInteractiveCalendar };
        });
      },
    }),
    {
      name: 'calendar-store',
    }
  )
)
