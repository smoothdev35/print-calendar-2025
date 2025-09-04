import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { type Event, type TMonths, type NewEvent } from '@/models/shared.models'
import { currentMonth } from '@/lib/utils'
import { createEventService as createEventAPI } from '@/services/event.services'

type CalendarState = {
  selectedMonth: TMonths
  events: Event[]
  setSelectedMonth: (month: TMonths) => void
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  updateEvent: (eventId: string, newEvent: Event) => void
  deleteEvent: (eventId: string) => void
  createEvent: (event: NewEvent) => Promise<void>
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      selectedMonth: currentMonth,
      events: [],
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (eventId, newEvent) =>
        set((state) => {
          console.log('state events', state.events, 'newEvent', newEvent)
          return {
            events: state.events.map((e) => (e.id === eventId ? newEvent : e)),
          }
        }),
      deleteEvent: (eventId) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== eventId),
        })),
      createEvent: async (event: NewEvent) => {
        const tempId = uuidv4()
        const tempEvent: Event = { ...event, id: tempId }

        get().addEvent(tempEvent)

        try {
          const newEvent = await createEventAPI(event)
          get().updateEvent(tempId, newEvent)
        } catch (error) {
          console.error('Failed to create event:', error)
          get().deleteEvent(tempId)
        }
      },
    }),
    {
      name: 'calendar-store',
    }
  )
)
