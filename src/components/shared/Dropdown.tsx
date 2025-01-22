import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/helpers/shared.helpers'
import { Button } from '../ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export interface IDropdownOption {
  label: string
  value: string
}

export interface IDropdownProps {
  options: IDropdownOption[]
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

const Dropdown = ({
  className,
  options,
  placeholder,
  value,
  onChange,
}: IDropdownProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between ${className ?? ''}`}
        >
          {value
            ? options.find(({ value: val }) => val === value)?.label
            : (placeholder ?? 'Select an option')}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[200px] p-0 ${className ?? ''}`}>
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map(({ label, value: val }) => (
                <CommandItem key={val} value={val} onSelect={onChange}>
                  {label}
                  <Check
                    className={cn(
                      'ml-auto',
                      val === value ? 'opacity-100' : 'opacity-0'
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

export { Dropdown }
