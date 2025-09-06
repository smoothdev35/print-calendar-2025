import { type PropsWithChildren } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'

type ErrorModalProps = {
  open: boolean
  title: string
  description: string
  onOpenChange: () => void
}

const ErrorModal = ({ children, title, description, ...props }: PropsWithChildren<ErrorModalProps>) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children && children}
        <Button onClick={props.onOpenChange}>Close</Button>
      </DialogContent>
    </Dialog>
  )
}

export { ErrorModal }
