import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Button } from "@/components/ui/button"

export function Modal({ isOpen, onClose, title, description, confirmButton, cancelButton }) {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      PaperProps={{
        className: "rounded-lg p-4 min-w-[320px] bg-background"
      }}
    >
      <DialogTitle className="text-lg font-semibold text-foreground">
        {title}
      </DialogTitle>
      <DialogContent className="text-sm text-foreground">
        {description}
      </DialogContent>
      <DialogActions className="flex justify-end space-x-2 p-4">
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
      </DialogActions>
    </Dialog>
  );
}
