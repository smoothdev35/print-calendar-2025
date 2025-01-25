import { type Control, Controller } from 'react-hook-form'
import { type DropdownProps } from '@/components/shared/Dropdown'

interface IWithDropdownControllerProps extends DropdownProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control:  Control<any, any>
}

const withDropdownController = (
  WrappedComponent: (props: DropdownProps) => JSX.Element
) => {
  const WithSwitchController = ({
    name,
    control,
    ...props
  }: IWithDropdownControllerProps) => {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const { onChange, value } = field

          return (
            <WrappedComponent
              {...props}
              onChange={onChange}
              value={value}
            />
          )
        }}
      />
    )
  }

  return WithSwitchController
}

export { withDropdownController }
