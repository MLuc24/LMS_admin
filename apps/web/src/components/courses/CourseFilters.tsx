/**
 * Course Filters Component
 * Search and filter controls for course list
 */

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LANGUAGES, PROFICIENCY_LEVELS } from '@/lib/types/course'

interface CourseFiltersProps {
  search: string
  targetLanguageId: string
  levelId: string
  isPublished: string
  onSearchChange: (value: string) => void
  onTargetLanguageChange: (value: string) => void
  onLevelChange: (value: string) => void
  onPublishedChange: (value: string) => void
  onClear: () => void
}

export function CourseFilters({
  search,
  targetLanguageId,
  levelId,
  isPublished,
  onSearchChange,
  onTargetLanguageChange,
  onLevelChange,
  onPublishedChange,
  onClear,
}: CourseFiltersProps) {
  const hasFilters = search || targetLanguageId || levelId || isPublished

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title or code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Target Language Filter */}
      <Select value={targetLanguageId || 'all'} onValueChange={(v) => onTargetLanguageChange(v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Target Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.languageId} value={String(lang.languageId)}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Level Filter */}
      <Select value={levelId || 'all'} onValueChange={(v) => onLevelChange(v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          {PROFICIENCY_LEVELS.map((level) => (
            <SelectItem key={level.levelId} value={String(level.levelId)}>
              {level.code} - {level.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Published Filter */}
      <Select value={isPublished || 'all'} onValueChange={(v) => onPublishedChange(v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="true">Published</SelectItem>
          <SelectItem value="false">Draft</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-9">
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
