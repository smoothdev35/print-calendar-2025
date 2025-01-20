import { ForwardRefExoticComponent, RefAttributes, useState } from 'react'
import { Check, ChevronsUpDown, LucideProps } from 'lucide-react'
import { WEEKDAYS } from '@/constants'
import { monthsOptions } from '@/lib/utils'
import {
  checkForValidDate,
  cn,
  getDaysInMonth,
  immutableStateUpdateFactory,
} from '@/helpers/shared.helpers'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface ICalendarScreenState {
  open: boolean
  selectedValue: string
}

interface ITextAndIcon {
  emoji: string
  text: string
}

interface IInteractiveDay {
  date: Date | null
  activityRowOne?: ITextAndIcon[]
  activityRowTwo?: ITextAndIcon[]
}

const CalendarScreen = () => {
  const [state, setState] = useState<ICalendarScreenState>({
    open: false,
    selectedValue: '0',
  })

  const { open, selectedValue } = state

  const updateCalendarState =
    immutableStateUpdateFactory<ICalendarScreenState>(setState)

  const daysInMonth = getDaysInMonth(2025, parseInt(selectedValue))
  const firstDayIndex = daysInMonth[0].getDay()
  const lastDayIndex = daysInMonth[daysInMonth.length - 1].getDay()

  const calendarDays = [
    ...Array(firstDayIndex).fill(null),
    ...daysInMonth,
    ...Array(6 - lastDayIndex).fill(null),
  ]

  const interactiveCalendarDays: IInteractiveDay[] = calendarDays.map(
    (date) => ({
      date,
      activityRowOne: [
        { emoji: '🎂', text: 'Birthday' },
        { emoji: '❤️', text: 'Love' },
      ],
      activityRowTwo: [
        { emoji: '🚨', text: 'Important' },
        { emoji: '🗓️', text: 'Appointment' },
      ],
    })
  )

  return (
    <section className="screen calendar gap-0">
      <Popover
        open={open}
        onOpenChange={() => updateCalendarState({ open: !open })}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {
              monthsOptions.find(
                ({ value: monthValue }) => monthValue === selectedValue
              )?.label
            }
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {monthsOptions.map(({ label, value }) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={(currentValue) => {
                      updateCalendarState({
                        open: false,
                        selectedValue:
                          currentValue === selectedValue ? '0' : currentValue,
                      })
                    }}
                  >
                    {label}
                    <Check
                      className={cn(
                        'ml-auto',
                        value === selectedValue ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <article className="p-2 w-[calc(100vw-40px)] max-w-[2000px] rounded-lg shadow-md shadow-[rgba(0,0,0,0.5)]">
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
          {interactiveCalendarDays.map(
            ({ date, activityRowOne, activityRowTwo }) => (
              <div
                className={`p-2 border rounded-md border-1 border-[rgba(0,0,0,.25)] aspect-[4/3] ${checkForValidDate(date) ? 'cursor-pointer' : 'bg-gray-100'}`}
              >
                {checkForValidDate(date) ? (
                  <article
                    key={
                      checkForValidDate(date) ? date?.getDate() : Math.random()
                    }
                    className="flex flex-col justify-between h-full "
                  >
                    <div className="flex flex-col align-between gap-1">
                      {activityRowOne && (
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
                      {activityRowTwo && (
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
          )}
        </div>
      </article>
    </section>
  )
}

export default CalendarScreen
