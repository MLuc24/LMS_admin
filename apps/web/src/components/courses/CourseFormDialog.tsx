/**
 * Course Form Dialog Component
 * Create and edit courses
 */

import { useState, useEffect } from 'react'
import { Loader2, Plus, X } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import {
  type Course,
  type CreateCourseRequest,
  type UpdateCourseRequest,
  type CourseLocalization,
  LANGUAGES,
  PROFICIENCY_LEVELS,
} from '@/lib/types/course'

interface CourseFormDialogProps {
  course: Course | null // null = create mode
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: CreateCourseRequest) => Promise<void>
  onUpdate: (courseId: string, data: UpdateCourseRequest) => Promise<void>
}

const emptyLocalization: CourseLocalization = {
  languageId: 0,
  title: '',
  description: '',
}

export function CourseFormDialog({
  course,
  open,
  onOpenChange,
  onCreate,
  onUpdate,
}: CourseFormDialogProps) {
  const isEditing = !!course
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [targetLanguageId, setTargetLanguageId] = useState('')
  const [baseLanguageId, setBaseLanguageId] = useState('')
  const [levelId, setLevelId] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const [localizations, setLocalizations] = useState<CourseLocalization[]>([{ ...emptyLocalization }])

  // Reset form when dialog opens/closes or course changes
  useEffect(() => {
    if (open) {
      if (course) {
        // Edit mode - populate form
        setTargetLanguageId(String(course.targetLanguageId))
        setBaseLanguageId(String(course.baseLanguageId))
        setLevelId(String(course.levelId))
        setCoverImage(null)
        setCoverImagePreview(course.coverUrl || '')
        setLocalizations(course.localizations.length > 0 ? course.localizations : [{ ...emptyLocalization }])
      } else {
        // Create mode - reset form
        setTargetLanguageId('')
        setBaseLanguageId('')
        setLevelId('')
        setCoverImage(null)
        setCoverImagePreview('')
        setLocalizations([{ ...emptyLocalization }])
      }
      setErrors({})
    }
  }, [open, course])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, coverImage: 'Please select an image file' })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, coverImage: 'Image size must be less than 5MB' })
        return
      }
      setCoverImage(file)
      setCoverImagePreview(URL.createObjectURL(file))
      setErrors({ ...errors, coverImage: '' })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!targetLanguageId) newErrors.targetLanguageId = 'Target language is required'
    if (!baseLanguageId) newErrors.baseLanguageId = 'Base language is required'
    if (!levelId) newErrors.levelId = 'Level is required'

    if (!isEditing) {
      // Validate localizations for create mode
      const validLocalizations = localizations.filter((l) => l.languageId && l.title)
      if (validLocalizations.length === 0) {
        newErrors.localizations = 'At least one localization with title is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      if (isEditing && course) {
        await onUpdate(course.courseId, {
          targetLanguageId: Number(targetLanguageId),
          baseLanguageId: Number(baseLanguageId),
          levelId: Number(levelId),
        })
      } else {
        const validLocalizations = localizations.filter((l) => l.languageId && l.title)
        
        // TODO: Handle cover image upload
        // For now, we'll pass the data without image
        await onCreate({
          targetLanguageId: Number(targetLanguageId),
          baseLanguageId: Number(baseLanguageId),
          levelId: Number(levelId),
          localizations: validLocalizations,
          // coverImage will be handled separately when upload is implemented
        })
      }
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLocalization = () => {
    setLocalizations([...localizations, { ...emptyLocalization }])
  }

  const handleRemoveLocalization = (index: number) => {
    if (localizations.length > 1) {
      setLocalizations(localizations.filter((_, i) => i !== index))
    }
  }

  const handleLocalizationChange = (
    index: number,
    field: keyof CourseLocalization,
    value: string | number
  ) => {
    const updated = [...localizations]
    updated[index] = { ...updated[index], [field]: value }
    setLocalizations(updated)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Course' : 'Create Course'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update course settings. Localizations are managed separately.'
              : 'Create a new course with initial settings and localizations.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="flex items-start gap-4">
                {coverImagePreview && (
                  <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-lg border">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={errors.coverImage ? 'border-destructive' : ''}
                  />
                  {errors.coverImage && (
                    <p className="mt-1 text-xs text-destructive">{errors.coverImage}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Recommended: 1200x630px, max 5MB (JPG, PNG, WebP)
                  </p>
                </div>
              </div>
            </div>

            {/* Language & Level */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Target Language *</Label>
                <Select value={targetLanguageId} onValueChange={setTargetLanguageId}>
                  <SelectTrigger className={errors.targetLanguageId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.languageId} value={String(lang.languageId)}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.targetLanguageId && (
                  <p className="text-xs text-destructive">{errors.targetLanguageId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Base Language *</Label>
                <Select value={baseLanguageId} onValueChange={setBaseLanguageId}>
                  <SelectTrigger className={errors.baseLanguageId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.languageId} value={String(lang.languageId)}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.baseLanguageId && (
                  <p className="text-xs text-destructive">{errors.baseLanguageId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Proficiency Level *</Label>
                <Select value={levelId} onValueChange={setLevelId}>
                  <SelectTrigger className={errors.levelId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level.levelId} value={String(level.levelId)}>
                        {level.code} - {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.levelId && (
                  <p className="text-xs text-destructive">{errors.levelId}</p>
                )}
              </div>
            </div>

            {/* Localizations (only for create mode) */}
            {!isEditing && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Localizations *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddLocalization}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Language
                  </Button>
                </div>
                {errors.localizations && (
                  <p className="text-xs text-destructive">{errors.localizations}</p>
                )}
                <div className="space-y-3">
                  {localizations.map((loc, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <div className="w-[140px] shrink-0">
                            <Select
                              value={loc.languageId ? String(loc.languageId) : ''}
                              onValueChange={(v) =>
                                handleLocalizationChange(index, 'languageId', Number(v))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Language" />
                              </SelectTrigger>
                              <SelectContent>
                                {LANGUAGES.map((lang) => (
                                  <SelectItem
                                    key={lang.languageId}
                                    value={String(lang.languageId)}
                                  >
                                    {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1 space-y-2">
                            <Input
                              value={loc.title}
                              onChange={(e) =>
                                handleLocalizationChange(index, 'title', e.target.value)
                              }
                              placeholder="Course title"
                            />
                            <Input
                              value={loc.description || ''}
                              onChange={(e) =>
                                handleLocalizationChange(index, 'description', e.target.value)
                              }
                              placeholder="Description (optional)"
                            />
                          </div>
                          {localizations.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveLocalization(index)}
                              className="shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
