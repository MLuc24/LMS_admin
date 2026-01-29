/**
 * Skill Card Component
 * Displays a skill with actions
 */

import { Edit, Trash2, Plus, BookOpen } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import type { Skill } from '@/lib/types/content'
import { getSkillTypeLabel } from '@/lib/types/content'

interface SkillCardProps {
  skill: Skill
  onEdit: (skill: Skill) => void
  onDelete: (skill: Skill) => void
  onAddLesson: (skill: Skill) => void
}

function getSkillTypeBadgeVariant(type: string) {
  switch (type) {
    case 'VOCABULARY':
      return 'default'
    case 'GRAMMAR':
      return 'secondary'
    case 'LISTENING':
    case 'SPEAKING':
      return 'outline'
    default:
      return 'outline'
  }
}

export function SkillCard({ skill, onEdit, onDelete, onAddLesson }: SkillCardProps) {
  const title = skill.title || skill.localizations[0]?.title || `Skill ${skill.orderIndex + 1}`
  const lessonsCount = skill.lessons?.length || 0

  return (
    <Card className="border-l-2 border-l-secondary">
      <CardContent className="flex items-center gap-3 py-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={getSkillTypeBadgeVariant(skill.skillType)} className="text-xs">
              {getSkillTypeLabel(skill.skillType)}
            </Badge>
            <span className="font-medium">{title}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>{lessonsCount} lessons</span>
            {skill.localizations.length > 1 && (
              <span>• {skill.localizations.length} languages</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onAddLesson(skill)}
          >
            <Plus className="mr-1 h-3 w-3" />
            Lesson
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(skill)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(skill)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
