/**
 * Content Module Types
 * Type definitions for Units, Skills, and Lessons
 */

// ============ LOCALIZATION TYPES ============

export interface ContentLocalization {
  languageId: number
  title: string
  description?: string
}

export interface LessonLocalization {
  languageId: number
  title: string
  introText?: string
}

// ============ UNIT TYPES ============

export interface Unit {
  unitId: string
  courseVersionId: string
  orderIndex: number
  localizations: ContentLocalization[]
  title?: string
  description?: string
  createdAt: string
  updatedAt: string
  // Nested data (optional, loaded separately)
  skills?: Skill[]
}

export interface CreateUnitRequest {
  localizations?: ContentLocalization[]
}

export interface UpdateUnitRequest {
  orderIndex?: number
}

export interface ReorderUnitsRequest {
  unitIds: string[]
}

export interface UnitListResponse {
  data: Unit[]
  total: number
}

// ============ SKILL TYPES ============

export type SkillType = 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing' | 'mixed'

export interface Skill {
  skillId: string
  unitId: string
  skillType: SkillType
  orderIndex: number
  localizations: ContentLocalization[]
  title?: string
  description?: string
  createdAt: string
  updatedAt: string
  // Nested data (optional, loaded separately)
  lessons?: Lesson[]
}

export interface CreateSkillRequest {
  skillType: SkillType
  localizations?: ContentLocalization[]
}

export interface UpdateSkillRequest {
  skillType?: SkillType
  orderIndex?: number
}

export interface ReorderSkillsRequest {
  skillIds: string[]
}

export interface SkillListResponse {
  data: Skill[]
  total: number
}

// ============ LESSON TYPES ============

export type LessonType = 'practice' | 'story' | 'dialogue' | 'test' | 'review'

export interface Lesson {
  lessonId: string
  skillId: string
  lessonType: LessonType
  orderIndex: number
  estimatedMinutes?: number
  isPublished: boolean
  localizations: LessonLocalization[]
  title?: string
  introText?: string
  createdAt: string
  updatedAt: string
}

export interface CreateLessonRequest {
  lessonType: LessonType
  estimatedMinutes?: number
  localizations?: LessonLocalization[]
}

export interface UpdateLessonRequest {
  lessonType?: LessonType
  orderIndex?: number
  estimatedMinutes?: number
  isPublished?: boolean
}

export interface ReorderLessonsRequest {
  lessonIds: string[]
}

export interface LessonListResponse {
  data: Lesson[]
  total: number
}

// ============ CONSTANTS ============

export const SKILL_TYPES: { value: SkillType; label: string; icon?: string }[] = [
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'listening', label: 'Listening' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'reading', label: 'Reading' },
  { value: 'writing', label: 'Writing' },
  { value: 'mixed', label: 'Mixed' },
]

export const LESSON_TYPES: { value: LessonType; label: string }[] = [
  { value: 'practice', label: 'Practice' },
  { value: 'story', label: 'Story' },
  { value: 'dialogue', label: 'Dialogue' },
  { value: 'test', label: 'Test' },
  { value: 'review', label: 'Review' },
]

// Helper functions
export function getSkillTypeLabel(type: SkillType): string {
  return SKILL_TYPES.find((t) => t.value === type)?.label || type
}

export function getLessonTypeLabel(type: LessonType): string {
  return LESSON_TYPES.find((t) => t.value === type)?.label || type
}
