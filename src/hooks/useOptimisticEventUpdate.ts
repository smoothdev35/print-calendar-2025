import { useMutation } from '@tanstack/react-query'
import { useCalendarStore } from '@/store/calendarStore'
import { updateEventService } from '@/services/event.services'
import { type Event } from '@/models/shared.models'

import { useErrorStore } from '@/store/errorStore'

export const useOptimisticEventUpdate = (onSuccess?: () => void, onError?: () => void) => {
  const { events, updateEvent: updateEventInStore } = useCalendarStore()
  const { showError } = useErrorStore()

  const { mutate: updateEvent } = useMutation({
    mutationFn: updateEventService,
    onMutate: async (updatedEvent: Partial<Event> & { id: string }) => {
      const previousEvent = events.find((event) => event.id === updatedEvent.id)

      if (previousEvent) {
        updateEventInStore(updatedEvent.id, { ...previousEvent, ...updatedEvent })
      }

      return { previousEvent }
    },
    onError: (error, _newEvent, context) => {
      if (context?.previousEvent) {
        updateEventInStore(context.previousEvent.id, context.previousEvent)
      }
      showError('Update Error', error.message || 'Failed to update event.')
      onError?.()
    },
    onSuccess: (data, variables) => {
      updateEventInStore(variables.id, data)
      onSuccess?.()
    },
  })

  return { updateEvent }
}
