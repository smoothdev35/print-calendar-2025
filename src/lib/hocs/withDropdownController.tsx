import { Controller } from 'react-hook-form'
import { IDropdownProps } from '@/components/shared/Dropdown'

interface IWithDropdownControllerProps extends IDropdownProps {
  name: string
  control: any
}

const withDropdownController = (
  WrappedComponent: (props: IDropdownProps) => JSX.Element
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
