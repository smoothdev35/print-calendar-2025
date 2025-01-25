import { currentMonth, monthsDropdownOptions } from '@/lib/utils'
import { useCalendarStore } from '@/store/calendarStore'
import { Dropdown } from '@/components/shared/Dropdown'
import { InteractiveCalendar } from '@/components/calendar/InteractiveCalendar'
import { type TMonths } from '@/models/shared.models'

const CalendarScreen = () => {
  const { selectedMonth, setSelectedMonth } = useCalendarStore()

  return (
    <section className="screen calendar gap-0">
      <Dropdown<TMonths>
        options={monthsDropdownOptions}
        value={selectedMonth}
        onChange={(value) => {
          setSelectedMonth(value === selectedMonth ? currentMonth : value)
        }}
      />
      <InteractiveCalendar />
    </section>
  )
}

export default CalendarScreen
