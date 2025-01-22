import { Fragment, useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { WEEKDAYS } from '@/constants'
import { IInteractiveDay } from '@/models/shared.models'
import {
  checkForValidDate,
  getCleanCalendarDays,
  immutableStateUpdateFactory,
} from '@/helpers/shared.helpers'
import { useCalendarStore } from '@/store/calendarStore'
import { AddDayInformationModal } from './AddDayInformationModal'

interface ICalendarScreenState {
  activeDay: Date | null
  addInformationDialogOpen: boolean
  interactiveCalendarDays: IInteractiveDay[]
}

const InteractiveCalendar = () => {
  const { selectedMonth } = useCalendarStore()

  const [state, setState] = useState<ICalendarScreenState>({
    activeDay: null,
    addInformationDialogOpen: false,
    interactiveCalendarDays: getCleanCalendarDays(selectedMonth),
  })

  const { activeDay, addInformationDialogOpen, interactiveCalendarDays } = state

  const updateCalendarState =
    immutableStateUpdateFactory<ICalendarScreenState>(setState)

  const toggleAddDayInformationDialog = (date: Date | null) => () => {
    updateCalendarState({
      activeDay: addInformationDialogOpen ? undefined : (date as Date),
      addInformationDialogOpen: !addInformationDialogOpen,
    })
  }

  const addDayInformation = (data: FieldValues) => {
    const { emoji, text } = data

    const selectedDayIndex = interactiveCalendarDays.findIndex(
      ({ date }) => date?.getTime() === activeDay?.getTime()
    )

    if (selectedDayIndex === -1) return

    const newInteractiveCalendarDays = structuredClone(interactiveCalendarDays)
    newInteractiveCalendarDays[selectedDayIndex].activities.push({
      emoji,
      text,
    })

    updateCalendarState({
      interactiveCalendarDays: newInteractiveCalendarDays,
    })
  }

  useEffect(() => {
    updateCalendarState({
      interactiveCalendarDays: getCleanCalendarDays(selectedMonth),
    })
  }, [selectedMonth])

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
                onClick={toggleAddDayInformationDialog(date)}
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
      <AddDayInformationModal
        open={addInformationDialogOpen}
        onOpenChange={toggleAddDayInformationDialog(null)}
        submitHandler={addDayInformation}
      />
    </>
  )
}

export { InteractiveCalendar }
