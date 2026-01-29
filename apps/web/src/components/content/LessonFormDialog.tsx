/**
 * Lesson Form Dialog
 * Create/Edit lesson with localizations
 */

import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { Lesson, LessonType } from '@/lib/types/content'
import { LESSON_TYPES } from '@/lib/types/content'
import { LANGUAGES } from '@/lib/types/course'

export interface LessonFormData {
  languageId: number
  lessonType: LessonType
  title: string
  introText: string
  estimatedMinutes: number
  isPublished: boolean
}

interface LessonFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lesson?: Lesson | null
  onSubmit: (data: LessonFormData) => Promise<void>
  isLoading?: boolean
}

export function LessonFormDialog({
  open,
  onOpenChange,
  lesson,
  onSubmit,
  isLoading = false,
}: LessonFormDialogProps) {
  const isEditing = !!lesson

  const [languageId, setLanguageId] = useState<number>(1)
  const [lessonType, setLessonType] = useState<LessonType>('practice')
  const [title, setTitle] = useState('')
  const [introText, setIntroText] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState(5)
  const [isPublished, setIsPublished] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      const loc = lesson?.localizations?.[0]
      setLanguageId(loc?.languageId || 1)
      setLessonType(lesson?.lessonType || 'practice')
      setTitle(lesson?.title || loc?.title || '')
      setIntroText(loc?.introText || '')
      setEstimatedMinutes(lesson?.estimatedMinutes || 5)
      setIsPublished(lesson?.isPublished || false)
      setErrors({})
    }
  }, [open, lesson])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }
    if (estimatedMinutes < 1 || estimatedMinutes > 120) {
      newErrors.estimatedMinutes = 'Duration must be between 1 and 120 minutes'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    await onSubmit({
      languageId,
      lessonType,
      title: title.trim(),
      introText: introText.trim(),
      estimatedMinutes,
      isPublished,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lesson' : 'Create Lesson'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the lesson details.'
              : 'Add a new lesson to the skill.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="languageId">Language</Label>
              <Select
                value={languageId.toString()}
                onValueChange={(value) => setLanguageId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.languageId} value={lang.languageId.toString()}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessonType">Lesson Type</Label>
              <Select
                value={lessonType}
                onValueChange={(value) => setLessonType(value as LessonType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {LESSON_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="introText">Intro Text (Optional)</Label>
            <Input
              id="introText"
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="Enter lesson intro text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedMinutes">Duration (minutes)</Label>
              <Input
                id="estimatedMinutes"
                type="number"
                min={1}
                max={120}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 5)}
              />
              {errors.estimatedMinutes && (
                <p className="text-sm text-destructive">{errors.estimatedMinutes}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isPublished">Status</Label>
              <Select
                value={isPublished ? 'published' : 'draft'}
                onValueChange={(value) => setIsPublished(value === 'published')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
