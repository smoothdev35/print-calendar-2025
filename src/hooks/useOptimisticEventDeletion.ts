import { useMutation } from '@tanstack/react-query'
import { useCalendarStore } from '@/store/calendarStore'
import { deleteEventService } from '@/services/event.services'

import { useErrorStore } from '@/store/errorStore'

export const useOptimisticEventDeletion = (onSuccess?: () => void, onError?: () => void) => {
  const { events, addEvent, deleteEvent: deleteEventInStore } = useCalendarStore()
  const { showError } = useErrorStore()

  const { mutate: deleteEvent } = useMutation({
    mutationFn: deleteEventService,
    onMutate: async (eventId: string) => {
      const eventToDelete = events.find((event) => event.id === eventId)

      if (eventToDelete) {
        deleteEventInStore(eventId)
      }

      return { eventToDelete }
    },
    onError: (error, _eventId, context) => {
      if (context?.eventToDelete) {
        addEvent(context.eventToDelete)
      }
      showError('Deletion Error', error.message || 'Failed to delete event.')
      onError?.()
    },
    onSuccess: () => {
      onSuccess?.()
    },
  })

  return { deleteEvent }
}
