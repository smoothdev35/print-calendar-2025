import { useEffect } from 'react'
import { type FieldValues, useForm, useFieldArray } from 'react-hook-form'
import { Trash2 } from 'lucide-react'
import { type TextAndIcon, type Event } from '@/models/shared.models'
import { withDropdownController } from '@/lib/hocs/withDropdownController'
import { emojisDropdownOptions } from '@/lib/utils'
import { customResolver } from '@/helpers/shared.helpers'
import { useOptimisticEventUpdate } from '@/hooks/useOptimisticEventUpdate'
import { useOptimisticEventDeletion } from '@/hooks/useOptimisticEventDeletion'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dropdown } from '../shared/Dropdown'
import { Modal } from '../shared/Modal'

type UpdateEventModalProps = {
  open: boolean
  onOpenChange: () => void
  events: Event[]
  openAddEventModal: () => void
}

type TUpdateEventForm = { events: TextAndIcon[] }

const ControlledDropdown = withDropdownController(Dropdown)

const UpdateEventModal = ({ events, openAddEventModal, ...props }: UpdateEventModalProps) => {
  const { open, onOpenChange } = props
  const { updateEvent } = useOptimisticEventUpdate()
  const { deleteEvent } = useOptimisticEventDeletion()

  const { control, formState, handleSubmit, register, reset } = useForm<TUpdateEventForm>({
    defaultValues: {
      events: events.map(event => ({ emoji: event.emoji, text: event.title }))
    },
    resolver: customResolver,
  })

  const { fields, remove } = useFieldArray({
    control,
    name: "events",
  });

  const { isValid } = formState

  const submitHandler = (data: FieldValues) => {
    const { events: formEvents } = data as { events: TextAndIcon[] }

    formEvents.forEach((formEvent, index) => {
      const originalEvent = events[index]
      const changedFields: Partial<Event> = {}

      if (formEvent.emoji !== originalEvent.emoji) {
        changedFields.emoji = formEvent.emoji
      }

      if (formEvent.text !== originalEvent.title) {
        changedFields.title = formEvent.text
      }

      if (Object.keys(changedFields).length > 0) {
        updateEvent({ id: originalEvent.id, ...changedFields })
      }
    })

    onOpenChange()
  }

  const handleDelete = (index: number) => {
    const eventId = events[index].id
    deleteEvent(eventId)
    remove(index)
  }

  useEffect(() => {
    if (open) {
      reset({
        events: events.map(event => ({ emoji: event.emoji, text: event.title }))
      })
    }
  }, [open, reset, events])

  return (
    <Modal {...props} title={`Edit information about the ${events.length > 1 ? 'events' : 'event'}`}>
      <form className="flex flex-wrap gap-6 mt-4" onSubmit={handleSubmit(submitHandler)}>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 w-full items-center">
            <ControlledDropdown
              className="w-[75px]"
              control={control}
              name={`events.${index}.emoji`}
              options={emojisDropdownOptions}
            />
            <Input {...register(`events.${index}.text`)} className="w-full" placeholder="Enter text" />
            <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={!isValid}>
          Update information
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={openAddEventModal}>
          Create new event
        </Button>
      </form>
    </Modal>
  )
}

export { UpdateEventModal }
