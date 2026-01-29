/**
 * Content Tree Component
 * Displays hierarchical content structure: Units > Skills > Lessons
 */

import { useState, useCallback } from 'react'
import { Plus, Layers } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { UnitCard } from './UnitCard'
import { UnitFormDialog, type UnitFormData } from './UnitFormDialog'
import { SkillFormDialog, type SkillFormData } from './SkillFormDialog'
import { LessonFormDialog, type LessonFormData } from './LessonFormDialog'
import { ContentDeleteDialog } from './ContentDeleteDialog'

import { unitsApi } from '@/lib/api/units'
import { skillsApi } from '@/lib/api/skills'
import { lessonsApi } from '@/lib/api/lessons'

import type { Unit, Skill, Lesson, SkillType, LessonType } from '@/lib/types/content'

interface ContentTreeProps {
  courseVersionId: string
  units: Unit[]
  isLoading: boolean
  onRefresh: () => void
}

export function ContentTree({
  courseVersionId,
  units,
  isLoading,
  onRefresh,
}: ContentTreeProps) {
  // Skills cache by unitId
  const [skillsMap, setSkillsMap] = useState<Record<string, Skill[]>>({})
  const [loadingSkillsFor, setLoadingSkillsFor] = useState<string | null>(null)

  // Unit dialog state
  const [unitDialogOpen, setUnitDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [unitLoading, setUnitLoading] = useState(false)

  // Skill dialog state
  const [skillDialogOpen, setSkillDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [parentUnitForSkill, setParentUnitForSkill] = useState<Unit | null>(null)
  const [skillLoading, setSkillLoading] = useState(false)

  // Lesson dialog state
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [parentSkillForLesson, setParentSkillForLesson] = useState<Skill | null>(null)
  const [lessonLoading, setLessonLoading] = useState(false)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'unit' | 'skill' | 'lesson'
    item: Unit | Skill | Lesson
    parentId?: string
  } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Load skills for a unit
  const loadSkillsForUnit = useCallback(async (unitId: string) => {
    if (skillsMap[unitId]) return // Already loaded

    setLoadingSkillsFor(unitId)
    try {
      const response = await skillsApi.getSkills(unitId)
      setSkillsMap((prev) => ({
        ...prev,
        [unitId]: response.data,
      }))
    } catch (error) {
      console.error('Failed to load skills:', error)
      toast.error('Failed to load skills')
    } finally {
      setLoadingSkillsFor(null)
    }
  }, [skillsMap])

  // Unit handlers
  const handleAddUnit = () => {
    setEditingUnit(null)
    setUnitDialogOpen(true)
  }

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit)
    setUnitDialogOpen(true)
  }

  const handleDeleteUnit = (unit: Unit) => {
    setDeleteTarget({ type: 'unit', item: unit })
    setDeleteDialogOpen(true)
  }

  const handleUnitSubmit = async (data: UnitFormData) => {
    setUnitLoading(true)
    try {
      if (editingUnit) {
        // For update, we need to use addLocalization or update pattern
        await unitsApi.addLocalization(courseVersionId, editingUnit.unitId, {
          languageId: data.languageId,
          title: data.title,
          description: data.description,
        })
        toast.success('Unit updated successfully')
      } else {
        await unitsApi.createUnit(courseVersionId, {
          localizations: [
            {
              languageId: data.languageId,
              title: data.title,
              description: data.description,
            },
          ],
        })
        toast.success('Unit created successfully')
      }
      setUnitDialogOpen(false)
      onRefresh()
    } catch (error) {
      console.error('Failed to save unit:', error)
      toast.error(editingUnit ? 'Failed to update unit' : 'Failed to create unit')
    } finally {
      setUnitLoading(false)
    }
  }

  // Skill handlers
  const handleAddSkill = (unit: Unit) => {
    setParentUnitForSkill(unit)
    setEditingSkill(null)
    setSkillDialogOpen(true)
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill)
    setSkillDialogOpen(true)
  }

  const handleDeleteSkill = (skill: Skill) => {
    setDeleteTarget({ type: 'skill', item: skill, parentId: skill.unitId })
    setDeleteDialogOpen(true)
  }

  const handleSkillSubmit = async (data: SkillFormData) => {
    setSkillLoading(true)
    try {
      const unitId = editingSkill?.unitId || parentUnitForSkill?.unitId
      if (!unitId) throw new Error('No unit ID')

      if (editingSkill) {
        await skillsApi.updateSkill(unitId, editingSkill.skillId, {
          skillType: data.skillType,
        })
        // Update localization separately
        await skillsApi.addLocalization(unitId, editingSkill.skillId, {
          languageId: data.languageId,
          title: data.title,
          description: data.description,
        })
        toast.success('Skill updated successfully')
      } else {
        await skillsApi.createSkill(unitId, {
          skillType: data.skillType,
          localizations: [
            {
              languageId: data.languageId,
              title: data.title,
              description: data.description,
            },
          ],
        })
        toast.success('Skill created successfully')
      }
      setSkillDialogOpen(false)
      // Refresh skills for this unit
      setSkillsMap((prev) => {
        const newMap = { ...prev }
        delete newMap[unitId]
        return newMap
      })
      loadSkillsForUnit(unitId)
    } catch (error) {
      console.error('Failed to save skill:', error)
      toast.error(editingSkill ? 'Failed to update skill' : 'Failed to create skill')
    } finally {
      setSkillLoading(false)
    }
  }

  // Lesson handlers
  const handleAddLesson = (skill: Skill) => {
    setParentSkillForLesson(skill)
    setEditingLesson(null)
    setLessonDialogOpen(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setLessonDialogOpen(true)
  }

  const handleDeleteLesson = (lesson: Lesson) => {
    setDeleteTarget({ type: 'lesson', item: lesson, parentId: lesson.skillId })
    setDeleteDialogOpen(true)
  }

  const handleLessonSubmit = async (data: LessonFormData) => {
    setLessonLoading(true)
    try {
      const skillId = editingLesson?.skillId || parentSkillForLesson?.skillId
      if (!skillId) throw new Error('No skill ID')

      if (editingLesson) {
        await lessonsApi.updateLesson(skillId, editingLesson.lessonId, {
          lessonType: data.lessonType,
          estimatedMinutes: data.estimatedMinutes,
          isPublished: data.isPublished,
        })
        // Update localization separately
        await lessonsApi.addLocalization(skillId, editingLesson.lessonId, {
          languageId: data.languageId,
          title: data.title,
          introText: data.introText,
        })
        toast.success('Lesson updated successfully')
      } else {
        await lessonsApi.createLesson(skillId, {
          lessonType: data.lessonType,
          estimatedMinutes: data.estimatedMinutes,
          localizations: [
            {
              languageId: data.languageId,
              title: data.title,
              introText: data.introText,
            },
          ],
        })
        toast.success('Lesson created successfully')
      }
      setLessonDialogOpen(false)
      // Refresh skills to get updated lessons count
      const unitId = parentSkillForLesson?.unitId || editingLesson?.skillId
      if (unitId) {
        setSkillsMap((prev) => {
          const newMap = { ...prev }
          // Find which unit contains this skill and refresh
          for (const [uId, skills] of Object.entries(prev)) {
            if (skills.some((s) => s.skillId === skillId)) {
              delete newMap[uId]
              loadSkillsForUnit(uId)
              break
            }
          }
          return newMap
        })
      }
    } catch (error) {
      console.error('Failed to save lesson:', error)
      toast.error(editingLesson ? 'Failed to update lesson' : 'Failed to create lesson')
    } finally {
      setLessonLoading(false)
    }
  }

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setDeleteLoading(true)
    try {
      switch (deleteTarget.type) {
        case 'unit': {
          const unit = deleteTarget.item as Unit
          await unitsApi.deleteUnit(courseVersionId, unit.unitId)
          toast.success('Unit deleted successfully')
          onRefresh()
          break
        }
        case 'skill': {
          const skill = deleteTarget.item as Skill
          await skillsApi.deleteSkill(skill.unitId, skill.skillId)
          toast.success('Skill deleted successfully')
          // Refresh skills
          setSkillsMap((prev) => {
            const newMap = { ...prev }
            delete newMap[skill.unitId]
            return newMap
          })
          loadSkillsForUnit(skill.unitId)
          break
        }
        case 'lesson': {
          const lesson = deleteTarget.item as Lesson
          await lessonsApi.deleteLesson(lesson.skillId, lesson.lessonId)
          toast.success('Lesson deleted successfully')
          // Find and refresh the parent unit's skills
          for (const [unitId, skills] of Object.entries(skillsMap)) {
            if (skills.some((s) => s.skillId === lesson.skillId)) {
              setSkillsMap((prev) => {
                const newMap = { ...prev }
                delete newMap[unitId]
                return newMap
              })
              loadSkillsForUnit(unitId)
              break
            }
          }
          break
        }
      }
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    } catch (error) {
      console.error('Failed to delete:', error)
      toast.error(`Failed to delete ${deleteTarget.type}`)
    } finally {
      setDeleteLoading(false)
    }
  }

  const getDeleteItemName = () => {
    if (!deleteTarget) return ''
    const item = deleteTarget.item
    if ('title' in item && item.title) return item.title
    if ('localizations' in item && item.localizations[0]?.title) {
      return item.localizations[0].title
    }
    return `${deleteTarget.type} item`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Layers className="mr-2 h-5 w-5 animate-pulse" />
        Loading units...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Content Structure</h3>
        <Button onClick={handleAddUnit}>
          <Plus className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </div>

      {units.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Layers className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No units yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start building your course by adding the first unit.
          </p>
          <Button className="mt-4" onClick={handleAddUnit}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Unit
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {units.map((unit) => (
            <UnitCard
              key={unit.unitId}
              unit={unit}
              skills={skillsMap[unit.unitId] || []}
              isLoadingSkills={loadingSkillsFor === unit.unitId}
              onEdit={handleEditUnit}
              onDelete={handleDeleteUnit}
              onAddSkill={handleAddSkill}
              onEditSkill={handleEditSkill}
              onDeleteSkill={handleDeleteSkill}
              onAddLesson={handleAddLesson}
              onExpandUnit={loadSkillsForUnit}
            />
          ))}
        </div>
      )}

      {/* Unit Dialog */}
      <UnitFormDialog
        open={unitDialogOpen}
        onOpenChange={setUnitDialogOpen}
        unit={editingUnit}
        onSubmit={handleUnitSubmit}
        isLoading={unitLoading}
      />

      {/* Skill Dialog */}
      <SkillFormDialog
        open={skillDialogOpen}
        onOpenChange={setSkillDialogOpen}
        skill={editingSkill}
        onSubmit={handleSkillSubmit}
        isLoading={skillLoading}
      />

      {/* Lesson Dialog */}
      <LessonFormDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        lesson={editingLesson}
        onSubmit={handleLessonSubmit}
        isLoading={lessonLoading}
      />

      {/* Delete Dialog */}
      <ContentDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        contentType={deleteTarget?.type || 'unit'}
        contentName={getDeleteItemName()}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
      />
    </div>
  )
}
