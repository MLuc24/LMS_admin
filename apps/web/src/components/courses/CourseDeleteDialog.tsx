/**
 * Course Delete Dialog Component
 * Confirm course deletion
 */

import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Course } from '@/lib/types/course'

interface CourseDeleteDialogProps {
  course: Course | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (courseId: string) => Promise<void>
}

export function CourseDeleteDialog({
  course,
  open,
  onOpenChange,
  onConfirm,
}: CourseDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!course || confirmCode !== course.courseCode) return

    setIsLoading(true)
    try {
      await onConfirm(course.courseId)
      onOpenChange(false)
      setConfirmCode('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setConfirmCode('')
    }
    onOpenChange(value)
  }

  if (!course) return null

  const isConfirmValid = confirmCode === course.courseCode

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete Course</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              You are about to delete the course{' '}
              <span className="font-semibold text-foreground">
                {course.title || course.localizations[0]?.title || 'Untitled'}
              </span>
              . This will permanently remove all associated data including units, skills, and lessons.
            </p>

            <div className="space-y-2">
              <Label htmlFor="confirmCode">
                Type <span className="font-mono font-semibold">{course.courseCode}</span> to confirm
              </Label>
              <Input
                id="confirmCode"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value.toUpperCase())}
                placeholder="Enter course code"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || !isConfirmValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
