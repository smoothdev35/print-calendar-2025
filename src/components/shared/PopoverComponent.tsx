import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/helpers/shared.helpers'
import { Button } from '../ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export interface IDropdownOption {
  label: string
  value: string
}

interface IPopoverProps {
  open: boolean
  options: IDropdownOption[]
  selectedValue: string
  onOpenChange: () => void
  onSelectValue: (value: string) => void
}

const PopoverComponent = ({
  options,
  selectedValue,
  onSelectValue,
  ...props
}: IPopoverProps) => {
  const { open } = props

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {options.find(({ value }) => value === selectedValue)?.label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map(({ label, value }) => (
                <CommandItem key={value} value={value} onSelect={onSelectValue}>
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
  )
}

export { PopoverComponent }
