import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { type DropdownOption } from '@/models/shared.models'
import { cn } from '@/helpers/shared.helpers'
import { Button } from '../ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export interface DropdownProps<TValue extends string = string> {
  options: DropdownOption<TValue>[]
  className?: string
  placeholder?: string
  value?: TValue
  onChange?: (value: TValue) => void
}

const Dropdown = <TValue extends string>({
  className,
  options,
  placeholder,
  value,
  onChange,
}: DropdownProps<TValue>) => {
  const [open, setOpen] = useState(false)

  const typedOnChange = onChange as (value: string) => void

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
                <CommandItem key={val} value={val} onSelect={typedOnChange}>
                  {label}
                  <Check className={cn('ml-auto', val === value ? 'opacity-100' : 'opacity-0')} />
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
