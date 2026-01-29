/**
 * Skill Form Dialog
 * Create/Edit skill with localizations
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

import type { Skill, SkillType } from '@/lib/types/content'
import { SKILL_TYPES } from '@/lib/types/content'
import { LANGUAGES } from '@/lib/types/course'

export interface SkillFormData {
  languageId: number
  skillType: SkillType
  title: string
  description: string
}

interface SkillFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill?: Skill | null
  onSubmit: (data: SkillFormData) => Promise<void>
  isLoading?: boolean
}

export function SkillFormDialog({
  open,
  onOpenChange,
  skill,
  onSubmit,
  isLoading = false,
}: SkillFormDialogProps) {
  const isEditing = !!skill

  const [languageId, setLanguageId] = useState<number>(1)
  const [skillType, setSkillType] = useState<SkillType>('vocabulary')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      const loc = skill?.localizations?.[0]
      setLanguageId(loc?.languageId || 1)
      setSkillType(skill?.skillType || 'vocabulary')
      setTitle(skill?.title || loc?.title || '')
      setDescription(loc?.description || '')
      setErrors({})
    }
  }, [open, skill])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    await onSubmit({
      languageId,
      skillType,
      title: title.trim(),
      description: description.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Skill' : 'Create Skill'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the skill details.'
              : 'Add a new skill to the unit.'}
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
              <Label htmlFor="skillType">Skill Type</Label>
              <Select
                value={skillType}
                onValueChange={(value) => setSkillType(value as SkillType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_TYPES.map((type) => (
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
              placeholder="Enter skill title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter skill description"
            />
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
