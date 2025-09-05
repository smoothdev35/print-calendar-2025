import { useMutation } from '@tanstack/react-query'
import { useCalendarStore } from '@/store/calendarStore'
import { deleteEventService } from '@/services/event.services'

export const useOptimisticEventDeletion = (onSuccess?: () => void, onError?: () => void) => {
  const { events, addEvent, deleteEvent: deleteEventInStore } = useCalendarStore()

  const { mutate: deleteEvent } = useMutation({
    mutationFn: deleteEventService,
    onMutate: async (eventId: string) => {
      const eventToDelete = events.find((event) => event.id === eventId)

      if (eventToDelete) {
        deleteEventInStore(eventId)
      }

      return { eventToDelete }
    },
    onError: (_err, _eventId, context) => {
      if (context?.eventToDelete) {
        addEvent(context.eventToDelete)
      }
      onError?.()
    },
    onSuccess: () => {
      onSuccess?.()
    },
  })

  return { deleteEvent }
}
