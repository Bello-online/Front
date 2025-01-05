import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Modal({ isOpen, onClose, title, description, confirmButton, cancelButton }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          {cancelButton && (
            <Button variant="outline" onClick={onClose}>
              {cancelButton}
            </Button>
          )}
          {confirmButton && (
            <Button onClick={onClose}>
              {confirmButton}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
