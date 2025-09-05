import { type NewEvent, type Event } from '@/models/shared.models'
import { type NewEventRequest, type EventResponse, type UpdateEventRequest } from './shared.models'
import { camelToSnakeCase, getBaseFetchHeaders, snakeToCamelCase } from './utils'

export const createEventService = async (event: NewEvent): Promise<Event> => {
  try {
    const snakeCaseEvent = camelToSnakeCase<NewEvent, NewEventRequest>(event)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
      method: 'POST',
      body: JSON.stringify(snakeCaseEvent),
      ...getBaseFetchHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to create event')
    }
    const newEvent: EventResponse[] = await response.json()
    return snakeToCamelCase<EventResponse, Event>(newEvent[0])
  } catch (error) {
    console.error('Failed to create event:', error)
    throw error
  }
}

export const updateEventService = async (
  event: Partial<Event> & { id: string }
): Promise<Event> => {
  try {
    const { id, ...rest } = event
    const snakeCaseEvent = camelToSnakeCase<Omit<Partial<Event>, 'id'>, UpdateEventRequest>(rest)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/events?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(snakeCaseEvent),
      ...getBaseFetchHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to update event')
    }
    const updatedEvent: EventResponse[] = await response.json()
    return snakeToCamelCase<EventResponse, Event>(updatedEvent[0])
  } catch (error) {
    console.error('Failed to update event:', error)
    throw error
  }
}

export const deleteEventService = async (eventId: string): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/events?id=eq.${eventId}`, {
      method: 'DELETE',
      ...getBaseFetchHeaders(),
    })
    if (!response.ok) {
      throw new Error('Failed to delete event')
    }
  } catch (error) {
    console.error('Failed to delete event:', error)
    throw error
  }
}