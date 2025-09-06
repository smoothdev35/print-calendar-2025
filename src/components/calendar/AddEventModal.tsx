import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { type NewEvent } from '@/models/shared.models'
import { withController } from '@/lib/hocs/withController'
import { emojisDropdownOptions } from '@/lib/utils'
import { addEventSchema } from '@/utils/schemas'
import { useOptimisticEventCreation } from '@/hooks/useOptimisticEventCreation'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dropdown } from '../shared/Dropdown'
import { Modal } from '../shared/Modal'

type AddEventModalProps = {
  open: boolean
  onOpenChange: () => void
  activeDay: string | null
}

export type TAddEventForm = z.infer<typeof addEventSchema>

const ControlledInput = withController(Input)
const ControlledDropdown = withController(Dropdown)

const AddEventModal = ({ activeDay, ...props }: AddEventModalProps) => {
  const { open, onOpenChange } = props
  const { createEvent } = useOptimisticEventCreation(onOpenChange)

  const { control, formState, handleSubmit, reset } = useForm<TAddEventForm>({
    defaultValues: {
      emoji: '🎂',
      text: '',
    },
    resolver: zodResolver(addEventSchema),
  })

  const { isValid } = formState

  const submitHandler = (data: TAddEventForm) => {
    if (!activeDay) return

    const newEvent: NewEvent = {
      title: data.text,
      description: '',
      startTime: new Date(activeDay).toISOString(),
      endTime: new Date(activeDay).toISOString(),
      emoji: data.emoji,
    }

    createEvent(newEvent)
  }

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  return (
    <Modal {...props} title="Add information about the event">
      <form className="flex flex-wrap gap-6 mt-4" onSubmit={handleSubmit(submitHandler)}>
        <div className="flex gap-4 w-full">
          <ControlledDropdown
            label="Emoji"
            className="w-[75px]"
            control={control}
            name="emoji"
            options={emojisDropdownOptions}
          />
          <ControlledInput
            label="Text"
            control={control}
            name="text"
            className="w-full"
            placeholder="Enter text"
          />
        </div>
        <Button type="submit" className="w-full" disabled={!isValid}>
          Add information
        </Button>
      </form>
    </Modal>
  )
}

export { AddEventModal }
