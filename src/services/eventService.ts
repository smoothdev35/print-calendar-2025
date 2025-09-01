import { type NewEvent, type Event } from '@/models/shared.models';

// This is a placeholder for the actual API call.
// We will replace this with a real API call to the server.
export const createEvent = async (event: NewEvent): Promise<Event> => {
  console.log('Creating event:', event);
  // Simulate an API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a successful response from the server
  const newEvent: Event = {
    ...event,
    id: new Date().toISOString(), // a temporary id
  };

  return newEvent;
};
