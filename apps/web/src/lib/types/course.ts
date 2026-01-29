/**
 * Course Module Types
 * Type definitions for course management
 */

// ============ COURSE TYPES ============

export interface CourseLocalization {
  languageId: number
  title: string
  description?: string
}

export interface Course {
  courseId: string
  courseCode: string
  targetLanguageId: number
  baseLanguageId: number
  levelId: number
  isPublished: boolean
  coverAssetId?: string
  coverUrl?: string
  localizations: CourseLocalization[]
  title?: string
  description?: string
  currentVersionId?: string
  createdAt: string
  updatedAt: string
}

// ============ REQUEST DTOs ============

export interface ListCoursesParams {
  page?: number
  limit?: number
  search?: string
  targetLanguageId?: number
  baseLanguageId?: number
  levelId?: number
  isPublished?: boolean
  languageId?: number
}

export interface CreateCourseRequest {
  targetLanguageId: number
  baseLanguageId: number
  levelId: number
  courseCode?: string // Optional - auto-generated if not provided
  coverImage?: File // Cover image file to upload
  localizations?: CourseLocalization[]
}

export interface UpdateCourseRequest {
  targetLanguageId?: number
  baseLanguageId?: number
  levelId?: number
  courseCode?: string
  coverImage?: File // Cover image file to upload
}

export interface AddLocalizationRequest {
  languageId: number
  title: string
  description?: string
}

// ============ RESPONSE DTOs ============

export interface CourseListResponse {
  data: Course[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PublishCourseResponse {
  success: boolean
  courseId: string
  publishedAt: string
}

// ============ LANGUAGE & LEVEL TYPES ============

export interface Language {
  languageId: number
  code: string
  name: string
  nativeName: string
}

export interface ProficiencyLevel {
  levelId: number
  code: string
  name: string
  description?: string
}

// ============ CONSTANTS ============

// Temporary hardcoded languages until we have an API
export const LANGUAGES: Language[] = [
  { languageId: 1, code: 'en', name: 'English', nativeName: 'English' },
  { languageId: 2, code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { languageId: 3, code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { languageId: 4, code: 'ko', name: 'Korean', nativeName: '한국어' },
  { languageId: 5, code: 'zh', name: 'Chinese', nativeName: '中文' },
]

export const PROFICIENCY_LEVELS: ProficiencyLevel[] = [
  { levelId: 1, code: 'A1', name: 'Beginner', description: 'Basic phrases and expressions' },
  { levelId: 2, code: 'A2', name: 'Elementary', description: 'Simple everyday language' },
  { levelId: 3, code: 'B1', name: 'Intermediate', description: 'Clear standard language' },
  { levelId: 4, code: 'B2', name: 'Upper Intermediate', description: 'Complex texts and ideas' },
  { levelId: 5, code: 'C1', name: 'Advanced', description: 'Demanding texts and implicit meaning' },
  { levelId: 6, code: 'C2', name: 'Proficiency', description: 'Near-native proficiency' },
]

// Helper functions
export function getLanguageName(languageId: number): string {
  return LANGUAGES.find((l) => l.languageId === languageId)?.name || `Language ${languageId}`
}

export function getLevelName(levelId: number): string {
  const level = PROFICIENCY_LEVELS.find((l) => l.levelId === levelId)
  return level ? `${level.code} - ${level.name}` : `Level ${levelId}`
}
