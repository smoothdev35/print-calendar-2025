import { useEffect } from 'react'
import { type FieldValues, useForm } from 'react-hook-form'
import { type TextAndIcon } from '@/models/shared.models'
import { withDropdownController } from '@/lib/hocs/withDropdownController'
import { emojisDropdownOptions } from '@/lib/utils'
import { customResolver } from '@/helpers/shared.helpers'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dropdown } from '../shared/Dropdown'
import { Modal } from '../shared/Modal'

type AddEventModalProps = {
  open: boolean
  onOpenChange: () => void
  submitHandler: (data: FieldValues) => void
}

type TAddEventForm = TextAndIcon

const ControlledDropdown = withDropdownController(Dropdown)

const AddEventModal = ({ submitHandler, ...props }: AddEventModalProps) => {
  const { open } = props

  const {
    control,
    formState: { isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<TAddEventForm>({
    defaultValues: {
      emoji: '🎂',
      text: '',
    },
    resolver: customResolver,
  })

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
