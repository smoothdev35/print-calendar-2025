import { v4 as uuidv4 } from 'uuid'
import { useCalendarStore } from '@/store/calendarStore'
import { createEventService } from '@/services/event.services'
import { type NewEvent, type Event } from '@/models/shared.models'

export const useOptimisticEventCreation = () => {
  const { addEvent, updateEvent, deleteEvent } = useCalendarStore()

  const createEvent = async (event: NewEvent) => {
    const tempId = uuidv4()
    const tempEvent: Event = { ...event, id: tempId }

    addEvent(tempEvent)

    try {
      const newEvent = await createEventService(event)
      updateEvent(tempId, newEvent)
    } catch (error) {
      console.error('Failed to create event:', error)
      deleteEvent(tempId)
    }
  }

  return { createEvent }
}