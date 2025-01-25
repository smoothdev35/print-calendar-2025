import { Fragment, useState } from 'react'
import { type FieldValues } from 'react-hook-form'
import { WEEKDAYS } from '@/constants'
import { type TextAndIcon } from '@/models/shared.models'
import {
  checkForValidDate,
  immutableStateUpdateFactory,
} from '@/helpers/shared.helpers'
import { useCalendarStore } from '@/store/calendarStore'
import { AddEventModal } from './AddEventModal'

type CalendarScreenState = {
  activeDay: Date | null
  addEventDialogOpen: boolean
}

const InteractiveCalendar = () => {
  const { selectedMonth, interactiveCalendar, addDayInformation } =
    useCalendarStore()

  const interactiveCalendarDays = interactiveCalendar.find(
    ({ month }) => month === selectedMonth
  )?.days

  const [state, setState] = useState<CalendarScreenState>({
    activeDay: null,
    addEventDialogOpen: false,
  })

  const { activeDay, addEventDialogOpen } = state

  const updateCalendarState =
    immutableStateUpdateFactory<CalendarScreenState>(setState)

  const toggleAddEventDialog = (date: Date | null) => () => {
    updateCalendarState({
      activeDay: addEventDialogOpen ? undefined : (date as Date),
      addEventDialogOpen: !addEventDialogOpen,
    })
  }

  const addEvent = (data: FieldValues) => {
    const { emoji, text } = data as TextAndIcon

    if (!activeDay) return

    addDayInformation(activeDay, selectedMonth, { emoji, text })

    toggleAddEventDialog(null)()
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
          {interactiveCalendarDays.map(({ date, activities }, i) => {
            const activitiesDeepCopy = structuredClone(activities)

            const activityRowOne = activitiesDeepCopy.slice(0, 2)
            const activityRowTwo = activitiesDeepCopy.slice(2, 4)

            return (
              <div
                key={date ? date?.toISOString() : `calendar-cell-${i}`}
                className={`p-2 border rounded-md border-1 border-[rgba(0,0,0,.25)] aspect-[4/3] ${checkForValidDate(date) ? 'cursor-pointer' : 'bg-gray-100'}`}
                onClick={toggleAddEventDialog(date)}
              >
                {checkForValidDate(date) ? (
                  <article
                    key={
                      checkForValidDate(date) ? date?.getDate() : Math.random()
                    }
                    className="flex flex-col justify-between h-full relative"
                  >
                    <div className="flex flex-col justify-start gap-1">
                      <>
                        {activityRowOne.map(({ emoji, text }, i) => (
                          <div
                            key={`activity-row-one-${text}-${i}`}
                            className="flex items-center gap-1 p-1 rounded-md"
                          >
                            <span role="img">{emoji}</span>
                            <span>{text}</span>
                          </div>
                        ))}
                      </>
                    </div>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center font-semibold">
                      {checkForValidDate(date) ? date?.getDate() : ''}
                    </div>
                    <div className="flex flex-col justify-start gap-1">
                      <>
                        {activityRowTwo.map(({ emoji, text }, i) => (
                          <div
                            key={`activity-row-two-${text}-${i}`}
                            className="flex items-center gap-1 p-1 rounded-md"
                          >
                            <span role="img">{emoji}</span>
                            <span>{text}</span>
                          </div>
                        ))}
                      </>
                    </div>
                  </article>
                ) : (
                  <Fragment key={i}></Fragment>
                )}
              </div>
            )
          })}
        </div>
      </article>
      <AddEventModal
        open={addEventDialogOpen}
        onOpenChange={toggleAddEventDialog(null)}
        submitHandler={addEvent}
      />
    </>
  )
}

export { InteractiveCalendar }
