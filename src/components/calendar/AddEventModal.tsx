import { useEffect } from 'react'
import { type FieldValues, useForm } from 'react-hook-form'
import { type TextAndIcon, type NewEvent } from '@/models/shared.models'
import { withDropdownController } from '@/lib/hocs/withDropdownController'
import { emojisDropdownOptions } from '@/lib/utils'
import { customResolver } from '@/helpers/shared.helpers'
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

type TAddEventForm = TextAndIcon

const ControlledDropdown = withDropdownController(Dropdown)

const AddEventModal = ({ activeDay, ...props }: AddEventModalProps) => {
  const { open, onOpenChange } = props
  const { createEvent } = useOptimisticEventCreation()

  const { control, formState, handleSubmit, register, reset } = useForm<TAddEventForm>({
    defaultValues: {
      emoji: '🎂',
      text: '',
    },
    resolver: customResolver,
  })

  const { isValid } = formState

  const submitHandler = (data: FieldValues) => {
    const { emoji, text } = data as TextAndIcon

    if (!activeDay) return

    const newEvent: NewEvent = {
      title: text,
      description: '',
      startTime: new Date(activeDay).toISOString(),
      endTime: new Date(activeDay).toISOString(),
      emoji,
    }

    createEvent(newEvent)
    onOpenChange()
  }

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  return (
    <Modal {...props} title="Add information about the event">
      <form className="flex flex-wrap gap-6 mt-4" onSubmit={handleSubmit(submitHandler)}>
        <div className="flex gap-4 w-full">
          <ControlledDropdown
            className="w-[75px]"
            control={control}
            name="emoji"
            options={emojisDropdownOptions}
          />
          <Input {...register('text')} className="w-full" placeholder="Enter text" />
        </div>
        <Button type="submit" className="w-full" disabled={!isValid}>
          Add information
        </Button>
      </form>
    </Modal>
  )
}

export { AddEventModal }
