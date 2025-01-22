import { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { ITextAndIcon } from '@/models/shared.models'
import { withDropdownController } from '@/lib/hocs/withDropdownController'
import { emojiOptions } from '@/lib/utils'
import { customResolver } from '@/helpers/shared.helpers'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dropdown } from '../shared/Dropdown'
import { Modal } from '../shared/Modal'

interface IAddDayInformationModalProps {
  open: boolean
  onOpenChange: () => void
  submitHandler: (data: FieldValues) => void
}

type TAddDayActivityForm = ITextAndIcon

const ControlledDropdown = withDropdownController(Dropdown)

const AddDayInformationModal = ({
  submitHandler,
  ...props
}: IAddDayInformationModalProps) => {
  const { open } = props

  const {
    control,
    formState: { isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<TAddDayActivityForm>({
    defaultValues: {
      emoji: '🎂',
      text: '',
    },
    resolver: customResolver,
  })

  useEffect(() => {
    !open && reset()
  }, [open, reset])

  return (
    <Modal {...props} title="Add information about the event">
      <form
        className="flex flex-wrap gap-6 mt-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        {' '}
        {/* <form
        className="flex flex-wrap gap-6 mt-4"
        onSubmit={handleSubmit(addDayInformation)}
      >
        <div className="flex gap-4 w-full">
          <ControlledDropdown
            className="w-[75px]"
            control={control}
            name="emoji"
            options={emojiOptions}
          />
          <Input {...register('text')} className='w-full' placeholder="Enter text" />
        </div>
        <Button type="submit" className="w-full" disabled={!isValid}>
          Add information
        </Button>
      </form> */}
        <div className="flex gap-4 w-full">
          <ControlledDropdown
            className="w-[75px]"
            control={control}
            name="emoji"
            options={emojiOptions}
          />
          <Input
            {...register('text')}
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

export { AddDayInformationModal }
