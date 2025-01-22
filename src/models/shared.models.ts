interface FieldError {
  type: string
  message: string
}

export interface FormErrors {
  [key: string]: FieldError
}

export interface ITextAndIcon {
  emoji: string
  text: string
}

export interface IInteractiveDay {
  activities: ITextAndIcon[]
  date: Date | null
}
