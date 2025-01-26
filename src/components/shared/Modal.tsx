import { type PropsWithChildren } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

type ModalProps = {
  open: boolean
  title: string
  onOpenChange: () => void
}

const Modal = ({ children, title, ...props }: PropsWithChildren<ModalProps>) => {
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
