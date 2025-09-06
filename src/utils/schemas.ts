import { z } from 'zod'

export const addEventSchema = z.object({
  emoji: z.string().min(1, 'Emoji is required'),
  text: z.string().min(1, 'Text is required'),
})

export const updateEventSchema = z.object({
  events: z.array(z.object({
    emoji: z.string().min(1, 'Emoji is required'),
    text: z.string().min(1, 'Text is required'),
  }))
})
