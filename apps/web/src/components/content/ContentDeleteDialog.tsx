/**
 * Content Delete Dialog
 * Reusable dialog for deleting units, skills, or lessons
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type ContentType = 'unit' | 'skill' | 'lesson'

interface ContentDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType: ContentType
  contentName: string
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export function ContentDeleteDialog({
  open,
  onOpenChange,
  contentType,
  contentName,
  onConfirm,
  isLoading = false,
}: ContentDeleteDialogProps) {
  const getWarningMessage = () => {
    switch (contentType) {
      case 'unit':
        return 'This will also delete all skills and lessons within this unit.'
      case 'skill':
        return 'This will also delete all lessons within this skill.'
      case 'lesson':
        return 'This action cannot be undone.'
      default:
        return 'This action cannot be undone.'
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {contentType}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{contentName}"?{' '}
            {getWarningMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onConfirm()
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
