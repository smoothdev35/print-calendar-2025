export interface NewEventRequest {
  title: string
  description: string
  start_time: string
  end_time: string
  emoji: string
}

export interface EventResponse extends NewEventRequest {
  id: string
}

export type UpdateEventRequest = Partial<NewEventRequest>