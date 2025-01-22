import { monthsOptions } from '@/lib/utils'
import { useCalendarStore } from '@/store/calendarStore'
import { Dropdown } from '@/components/shared/Dropdown'
import { InteractiveCalendar } from '@/components/calendar/InteractiveCalendar'

const CalendarScreen = () => {
  const { selectedMonth, setSelectedMonth } = useCalendarStore()

  return (
    <section className="screen calendar gap-0">
      <Dropdown
        options={monthsOptions}
        value={selectedMonth}
        onChange={(value) => {
          setSelectedMonth(value === selectedMonth ? '0' : value)
        }}
      />
      <InteractiveCalendar />
    </section>
  )
}

export default CalendarScreen
