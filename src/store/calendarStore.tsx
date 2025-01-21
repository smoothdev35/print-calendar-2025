import {create} from 'zustand'

interface CalendarState {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedMonth: '0',
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}))