import { useMutation } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'
import { useCalendarStore } from '@/store/calendarStore'
import { createEventService } from '@/services/event.services'
import { type NewEvent, type Event } from '@/models/shared.models'

import { useErrorStore } from '@/store/errorStore'

export const useOptimisticEventCreation = (onSuccess?: () => void, onError?: () => void) => {
  const { addEvent, updateEvent, deleteEvent } = useCalendarStore()
  const { showError } = useErrorStore()

  const { mutate: createEvent } = useMutation({
    mutationFn: createEventService,
    onMutate: async (newEvent: NewEvent) => {
      const tempId = uuidv4()
      const tempEvent: Event = { ...newEvent, id: tempId }
      addEvent(tempEvent)
      return { tempId }
    },
    onSuccess: (newEvent: Event, _variables, context) => {
      if (context) {
        updateEvent(context.tempId, newEvent)
      }
      onSuccess?.()
    },
    onError: (error, _variables, context) => {
      if (context) {
        deleteEvent(context.tempId)
      }
      showError('Creation Error', error.message || 'Failed to create event.')
      onError?.()
    },
  })

  return { createEvent }
}
