import { useEffect, useState } from 'react'
import { WEEKDAYS } from '@/constants'
import { monthsOptions } from '@/lib/utils'
import {
  checkForValidDate,
  getCleanCalendarDays,
  immutableStateUpdateFactory,
} from '@/helpers/shared.helpers'
import { PopoverComponent } from '@/components/shared/PopoverComponent'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCalendarStore } from '@/store/calendarStore'

interface ICalendarScreenState {
  addInformationDialogOpen: boolean
  interactiveCalendarDays: IInteractiveDay[]
  monthSelectionDropdownOpen: boolean
}

interface ITextAndIcon {
  emoji: string
  text: string
}

export interface IInteractiveDay {
  activities: ITextAndIcon[]
  date: Date | null
}

const CalendarScreen = () => {
  const { selectedMonth, setSelectedMonth } = useCalendarStore()

  const [state, setState] = useState<ICalendarScreenState>({
    addInformationDialogOpen: false,
    interactiveCalendarDays: getCleanCalendarDays(selectedMonth),
    monthSelectionDropdownOpen: false,
  })

  const {
    addInformationDialogOpen,
    interactiveCalendarDays,
    monthSelectionDropdownOpen,
  } = state

  const updateCalendarState =
    immutableStateUpdateFactory<ICalendarScreenState>(setState)


    const addDayInformation = (day: Date, activity: ITextAndIcon) => {
      const selectedDayIndex = interactiveCalendarDays.findIndex(
        ({ date }) => date?.getTime() === day.getTime()
      )
  
      if (selectedDayIndex === -1) return
  
      const newInteractiveCalendarDays = structuredClone(interactiveCalendarDays)
      newInteractiveCalendarDays[selectedDayIndex].activities.push(activity)
  
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
    <section className="screen calendar gap-0">
      <PopoverComponent
        open={monthSelectionDropdownOpen}
        options={monthsOptions}
        selectedValue={selectedMonth}
        onOpenChange={() =>
          updateCalendarState({
            monthSelectionDropdownOpen: !monthSelectionDropdownOpen,
          })
        }
        onSelectValue={(value) => {
          updateCalendarState({
            monthSelectionDropdownOpen: false,
          })
          setSelectedMonth(value === selectedMonth ? '0' : value)
        }}
      />

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
          {interactiveCalendarDays.map(({ date, activities }) => {
            const activitiesDeepCopy = structuredClone(activities)

            const activityRowOne = activitiesDeepCopy.slice(0, 2)
            const activityRowTwo = activitiesDeepCopy.slice(2, 4)

            return (
              <div
                className={`p-2 border rounded-md border-1 border-[rgba(0,0,0,.25)] aspect-[4/3] ${checkForValidDate(date) ? 'cursor-pointer' : 'bg-gray-100'}`}
                onClick={() =>
                  updateCalendarState({
                    addInformationDialogOpen: !addInformationDialogOpen,
                  })
                }
              >
                {checkForValidDate(date) ? (
                  <article
                    key={
                      checkForValidDate(date) ? date?.getDate() : Math.random()
                    }
                    className="flex flex-col justify-between h-full"
                  >
                    <div className="flex flex-col align-between gap-1">
                      {!!activityRowOne.length && (
                        <>
                          {activityRowOne.map(({ emoji, text }) => (
                            <div
                              key={text}
                              className="flex items-center gap-1 p-1 rounded-md"
                            >
                              <span role="img">{emoji}</span>
                              <span>{text}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    <span className="grid items-center text-center font-semibold">
                      {checkForValidDate(date) ? date?.getDate() : ''}
                    </span>
                    <div className="flex flex-col justify-between gap-1">
                      {!!activityRowTwo.length && (
                        <>
                          {activityRowTwo.map(({ emoji, text }) => (
                            <div
                              key={text}
                              className="flex items-center gap-1 p-1 rounded-md"
                            >
                              <span role="img">{emoji}</span>
                              <span>{text}</span>
                            </div>
                          ))}
                        </>
                      )}
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
      <Dialog
        open={addInformationDialogOpen}
        onOpenChange={() =>
          updateCalendarState({
            addInformationDialogOpen: !addInformationDialogOpen,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add information about the event</DialogTitle>
          </DialogHeader>
          <article className="info-selection"></article>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default CalendarScreen
