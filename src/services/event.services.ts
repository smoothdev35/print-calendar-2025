import { type NewEvent, type Event } from '@/models/shared.models'
import { type NewEventRequest, type EventResponse } from './shared.models'
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
