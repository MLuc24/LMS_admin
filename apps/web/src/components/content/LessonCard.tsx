/**
 * Lesson Card Component
 * Displays a lesson with actions
 */

import { Edit, Trash2, Clock, CheckCircle, Circle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import type { Lesson } from '@/lib/types/content'
import { getLessonTypeLabel } from '@/lib/types/content'

interface LessonCardProps {
  lesson: Lesson
  onEdit: (lesson: Lesson) => void
  onDelete: (lesson: Lesson) => void
}

export function LessonCard({ lesson, onEdit, onDelete }: LessonCardProps) {
  const title = lesson.title || lesson.localizations[0]?.title || `Lesson ${lesson.orderIndex + 1}`

  return (
    <Card className="border-l-2 border-l-muted">
      <CardContent className="flex items-center gap-3 py-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {lesson.isPublished ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <Badge variant="outline" className="text-xs">
              {getLessonTypeLabel(lesson.lessonType)}
            </Badge>
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {lesson.estimatedMinutes && (
              <>
                <Clock className="h-3 w-3" />
                <span>{lesson.estimatedMinutes} min</span>
              </>
            )}
            {lesson.localizations.length > 1 && (
              <span>• {lesson.localizations.length} languages</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(lesson)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(lesson)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
