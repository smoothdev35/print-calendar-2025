import { useState } from 'react'
import { WEEKDAYS } from '@/constants'
import {
  checkForValidDate,
  immutableStateUpdateFactory,
  getCleanCalendarDays,
} from '@/helpers/shared.helpers'
import { useCalendarStore } from '@/store/calendarStore'
import { AddEventModal } from './AddEventModal'
import { UpdateEventModal } from './UpdateEventModal'
import { type Event } from '@/models/shared.models'

type CalendarScreenState = {
  activeDay: string | null
  addEventDialogOpen: boolean
  updateEventDialogOpen: boolean
}

export const InteractiveCalendar = () => {
  const { selectedMonth, events } = useCalendarStore()

  const interactiveCalendarDays = getCleanCalendarDays(selectedMonth).map((day) => ({
    ...day,
    events: events.filter((event) => {
      const eventDate = new Date(event.startTime)
      const dayDate = new Date(day.date as string)
      return (
        eventDate.getDate() === dayDate.getDate() &&
        eventDate.getMonth() === dayDate.getMonth() &&
        eventDate.getFullYear() === dayDate.getFullYear()
      )
    }),
  }))

  const [state, setState] = useState<CalendarScreenState>({
    activeDay: null,
    addEventDialogOpen: false,
    updateEventDialogOpen: false,
  })

  const { activeDay, addEventDialogOpen, updateEventDialogOpen } = state

  const updateCalendarState = immutableStateUpdateFactory<CalendarScreenState>(setState)

  const toggleAddEventDialog = (date: string | null) => () => {
    updateCalendarState({
      activeDay: addEventDialogOpen ? null : date,
      addEventDialogOpen: !addEventDialogOpen,
    })
  }

  const toggleUpdateEventDialog = (date: string | null) => () => {
    updateCalendarState({
      activeDay: updateEventDialogOpen ? null : date,
      updateEventDialogOpen: !updateEventDialogOpen,
    })
  }

  const openAddEventModal = () => {
    toggleUpdateEventDialog(null)()
    toggleAddEventDialog(activeDay)()
  }

  if (!interactiveCalendarDays) return null

  return (
    <>
      <article className="p-2 w-[calc(100vw-40px)] min-w-[1720px] max-w-[2000px] rounded-lg shadow-md shadow-[rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-[repeat(7,1fr)] w-full h-[3rem]">
          {/* Weekday headers */}
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="grid items-center align-center h-full font-semibold text-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(7,1fr)] grid-rows-[auto] gap-1 w-full">
          {/* Calendar days */}
          {interactiveCalendarDays.map(({ date, events }, i) => {
            const eventsDeepCopy = structuredClone(events)

            const eventRowOne = eventsDeepCopy.slice(0, 2)
            const eventRowTwo = eventsDeepCopy.slice(2, 4)

            return (
              <div
                key={date ? date : `calendar-cell-${selectedMonth}-${i}`}
                className={`p-2 border rounded-md border-1 border-[rgba(0,0,0,.25)] aspect-[4/3] ${
                  checkForValidDate(date) ? 'cursor-pointer' : 'bg-gray-100'
                }`}
                onClick={
                  events.length > 0 ? toggleUpdateEventDialog(date) : toggleAddEventDialog(date)
                }
              >
                {checkForValidDate(date) ? (
                  <article className="flex flex-col justify-between h-full relative">
                    <div className="flex flex-col justify-start gap-1">
                      <>
                        {eventRowOne.map(({ emoji, title }, i) => (
                          <div
                            key={`event-row-one-${title}-${i}`}
                            className="flex items-center gap-1 p-1 rounded-md"
                          >
                            <span role="img">{emoji}</span>
                            <span>{title}</span>
                          </div>
                        ))}
                      </>
                    </div>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center font-semibold">
                      {checkForValidDate(date) ? new Date(date as string)?.getDate() : ''}
                    </div>
                    <div className="flex flex-col justify-start gap-1">
                      <>
                        {eventRowTwo.map(({ emoji, title }, i) => (
                          <div
                            key={`event-row-two-${title}-${i}`}
                            className="flex items-center gap-1 p-1 rounded-md"
                          >
                            <span role="img">{emoji}</span>
                            <span>{title}</span>
                          </div>
                        ))}
                      </>
                    </div>
                  </article>
                ) : (
                  <></>
                )}
              </div>
            )
          })}
        </div>
      </article>
      <AddEventModal
        open={addEventDialogOpen}
        onOpenChange={toggleAddEventDialog(null)}
        activeDay={activeDay}
      />
      {activeDay && (
        <UpdateEventModal
          open={updateEventDialogOpen}
          onOpenChange={toggleUpdateEventDialog(null)}
          events={
            events.filter(
              (event) =>
                new Date(event.startTime).toDateString() === new Date(activeDay).toDateString()
            ) as Event[]
          }
          openAddEventModal={openAddEventModal}
        />
      )}
    </>
  )
}
