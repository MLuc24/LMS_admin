/**
 * Lessons API Service
 * API calls for lesson management endpoints
 */

import { apiClient } from './client'
import type {
  Lesson,
  CreateLessonRequest,
  UpdateLessonRequest,
  ReorderLessonsRequest,
  LessonListResponse,
  LessonLocalization,
} from '@/lib/types/content'

export const lessonsApi = {
  /**
   * List lessons for a skill
   */
  getLessons: async (skillId: string, languageId?: number): Promise<LessonListResponse> => {
    const query = languageId ? `?languageId=${languageId}` : ''
    return apiClient.get<LessonListResponse>(`/admin/skills/${skillId}/lessons${query}`)
  },

  /**
   * Get lesson by ID
   */
  getLesson: async (skillId: string, lessonId: string, languageId?: number): Promise<Lesson> => {
    const query = languageId ? `?languageId=${languageId}` : ''
    return apiClient.get<Lesson>(`/admin/skills/${skillId}/lessons/${lessonId}${query}`)
  },

  /**
   * Create a new lesson
   */
  createLesson: async (skillId: string, data: CreateLessonRequest): Promise<Lesson> => {
    return apiClient.post<Lesson>(`/admin/skills/${skillId}/lessons`, data)
  },

  /**
   * Update a lesson
   */
  updateLesson: async (
    skillId: string,
    lessonId: string,
    data: UpdateLessonRequest
  ): Promise<Lesson> => {
    return apiClient.put<Lesson>(`/admin/skills/${skillId}/lessons/${lessonId}`, data)
  },

  /**
   * Delete a lesson
   */
  deleteLesson: async (skillId: string, lessonId: string): Promise<void> => {
    return apiClient.delete(`/admin/skills/${skillId}/lessons/${lessonId}`)
  },

  /**
   * Reorder lessons
   */
  reorderLessons: async (skillId: string, data: ReorderLessonsRequest): Promise<void> => {
    return apiClient.put(`/admin/skills/${skillId}/lessons/reorder`, data)
  },

  /**
   * Add localization to a lesson
   */
  addLocalization: async (
    skillId: string,
    lessonId: string,
    data: LessonLocalization
  ): Promise<void> => {
    return apiClient.post(`/admin/skills/${skillId}/lessons/${lessonId}/localizations`, data)
  },

  /**
   * Update lesson localization
   */
  updateLocalization: async (
    skillId: string,
    lessonId: string,
    languageId: number,
    data: LessonLocalization
  ): Promise<void> => {
    return apiClient.put(
      `/admin/skills/${skillId}/lessons/${lessonId}/localizations/${languageId}`,
      data
    )
  },

  /**
   * Delete lesson localization
   */
  deleteLocalization: async (
    skillId: string,
    lessonId: string,
    languageId: number
  ): Promise<void> => {
    return apiClient.delete(
      `/admin/skills/${skillId}/lessons/${lessonId}/localizations/${languageId}`
    )
  },
}
