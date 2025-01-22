import { PropsWithChildren } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

interface IModalProps {
  open: boolean
  title: string
  onOpenChange: () => void
}

const Modal = ({
  children,
  title,
  ...props
}: PropsWithChildren<IModalProps>) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children && children}
      </DialogContent>
    </Dialog>
  )
}

export { Modal }
