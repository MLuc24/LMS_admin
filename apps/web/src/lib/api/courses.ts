/**
 * Courses API Service
 * API calls for course management endpoints
 */

import { apiClient } from './client'
import type {
  Course,
  ListCoursesParams,
  CreateCourseRequest,
  UpdateCourseRequest,
  AddLocalizationRequest,
  CourseListResponse,
  PublishCourseResponse,
} from '@/lib/types/course'

export const coursesApi = {
  /**
   * List courses with pagination and filters
   */
  getCourses: async (params: ListCoursesParams = {}): Promise<CourseListResponse> => {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.search) searchParams.set('search', params.search)
    if (params.targetLanguageId) searchParams.set('targetLanguageId', String(params.targetLanguageId))
    if (params.baseLanguageId) searchParams.set('baseLanguageId', String(params.baseLanguageId))
    if (params.levelId) searchParams.set('levelId', String(params.levelId))
    if (params.isPublished !== undefined) searchParams.set('isPublished', String(params.isPublished))
    if (params.languageId) searchParams.set('languageId', String(params.languageId))

    const query = searchParams.toString()
    const endpoint = `/admin/courses${query ? `?${query}` : ''}`

    return apiClient.get<CourseListResponse>(endpoint)
  },

  /**
   * Get course by ID
   */
  getCourse: async (courseId: string, languageId?: number): Promise<Course> => {
    const query = languageId ? `?languageId=${languageId}` : ''
    return apiClient.get<Course>(`/admin/courses/${courseId}${query}`)
  },

  /**
   * Create a new course
   */
  createCourse: async (data: CreateCourseRequest): Promise<Course> => {
    return apiClient.post<Course>('/admin/courses', data)
  },

  /**
   * Update a course
   */
  updateCourse: async (courseId: string, data: UpdateCourseRequest): Promise<Course> => {
    return apiClient.put<Course>(`/admin/courses/${courseId}`, data)
  },

  /**
   * Delete a course
   */
  deleteCourse: async (courseId: string): Promise<void> => {
    return apiClient.delete(`/admin/courses/${courseId}`)
  },

  /**
   * Publish a course
   */
  publishCourse: async (courseId: string): Promise<PublishCourseResponse> => {
    return apiClient.post<PublishCourseResponse>(`/admin/courses/${courseId}/publish`)
  },

  /**
   * Archive a course
   */
  archiveCourse: async (courseId: string): Promise<void> => {
    return apiClient.post(`/admin/courses/${courseId}/archive`)
  },

  /**
   * Add localization to a course
   */
  addLocalization: async (courseId: string, data: AddLocalizationRequest): Promise<void> => {
    return apiClient.post(`/admin/courses/${courseId}/localizations`, data)
  },

  /**
   * Update course localization
   */
  updateLocalization: async (
    courseId: string,
    languageId: number,
    data: AddLocalizationRequest
  ): Promise<void> => {
    return apiClient.put(`/admin/courses/${courseId}/localizations/${languageId}`, data)
  },

  /**
   * Delete course localization
   */
  deleteLocalization: async (courseId: string, languageId: number): Promise<void> => {
    return apiClient.delete(`/admin/courses/${courseId}/localizations/${languageId}`)
  },
}
