/**
 * Unit Card Component
 * Displays a unit with expandable skills
 */

import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  GripVertical,
  Layers,
} from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { SkillCard } from './SkillCard'
import type { Unit, Skill } from '@/lib/types/content'
import { getLanguageName } from '@/lib/types/course'

interface UnitCardProps {
  unit: Unit
  skills: Skill[]
  isLoadingSkills?: boolean
  onEdit: (unit: Unit) => void
  onDelete: (unit: Unit) => void
  onAddSkill: (unit: Unit) => void
  onEditSkill: (skill: Skill) => void
  onDeleteSkill: (skill: Skill) => void
  onAddLesson: (skill: Skill) => void
  onExpandUnit: (unitId: string) => void
}

export function UnitCard({
  unit,
  skills,
  isLoadingSkills = false,
  onEdit,
  onDelete,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
  onAddLesson,
  onExpandUnit,
}: UnitCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    if (!isOpen) {
      onExpandUnit(unit.unitId)
    }
    setIsOpen(!isOpen)
  }

  const title = unit.title || unit.localizations[0]?.title || `Unit ${unit.orderIndex + 1}`

  return (
    <Card className="border-l-4 border-l-primary">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </Button>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Unit {unit.orderIndex + 1}
                </Badge>
                <h3 className="font-semibold">{title}</h3>
              </div>
              {unit.localizations.length > 1 && (
                <p className="text-xs text-muted-foreground">
                  {unit.localizations.length} languages
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddSkill(unit)
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Skill
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(unit)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(unit)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {isLoadingSkills ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Layers className="mr-2 h-4 w-4 animate-pulse" />
                Loading skills...
              </div>
            ) : skills.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Layers className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No skills yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => onAddSkill(unit)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add First Skill
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pl-8">
                {skills.map((skill) => (
                  <SkillCard
                    key={skill.skillId}
                    skill={skill}
                    onEdit={onEditSkill}
                    onDelete={onDeleteSkill}
                    onAddLesson={onAddLesson}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
