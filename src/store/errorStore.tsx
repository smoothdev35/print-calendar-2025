import { create } from 'zustand'

type ErrorState = {
  isOpen: boolean
  title: string
  description: string
  showError: (title: string, description: string) => void
  hideError: () => void
}

export const useErrorStore = create<ErrorState>()((set) => ({
  isOpen: false,
  title: '',
  description: '',
  showError: (title, description) => set({ isOpen: true, title, description }),
  hideError: () => set({ isOpen: false, title: '', description: '' }),
}))
