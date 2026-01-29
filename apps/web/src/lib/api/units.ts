/**
 * Units API Service
 * API calls for unit management endpoints
 */

import { apiClient } from './client'
import type {
  Unit,
  CreateUnitRequest,
  UpdateUnitRequest,
  ReorderUnitsRequest,
  UnitListResponse,
  ContentLocalization,
} from '@/lib/types/content'

export const unitsApi = {
  /**
   * List units for a course version
   */
  getUnits: async (courseVersionId: string, languageId?: number): Promise<UnitListResponse> => {
    const query = languageId ? `?languageId=${languageId}` : ''
    return apiClient.get<UnitListResponse>(
      `/admin/course-versions/${courseVersionId}/units${query}`
    )
  },

  /**
   * Get unit by ID
   */
  getUnit: async (
    courseVersionId: string,
    unitId: string,
    languageId?: number
  ): Promise<Unit> => {
    const query = languageId ? `?languageId=${languageId}` : ''
    return apiClient.get<Unit>(
      `/admin/course-versions/${courseVersionId}/units/${unitId}${query}`
    )
  },

  /**
   * Create a new unit
   */
  createUnit: async (courseVersionId: string, data: CreateUnitRequest): Promise<Unit> => {
    return apiClient.post<Unit>(`/admin/course-versions/${courseVersionId}/units`, data)
  },

  /**
   * Update a unit
   */
  updateUnit: async (
    courseVersionId: string,
    unitId: string,
    data: UpdateUnitRequest
  ): Promise<Unit> => {
    return apiClient.put<Unit>(
      `/admin/course-versions/${courseVersionId}/units/${unitId}`,
      data
    )
  },

  /**
   * Delete a unit
   */
  deleteUnit: async (courseVersionId: string, unitId: string): Promise<void> => {
    return apiClient.delete(`/admin/course-versions/${courseVersionId}/units/${unitId}`)
  },

  /**
   * Reorder units
   */
  reorderUnits: async (
    courseVersionId: string,
    data: ReorderUnitsRequest
  ): Promise<void> => {
    return apiClient.put(`/admin/course-versions/${courseVersionId}/units/reorder`, data)
  },

  /**
   * Add localization to a unit
   */
  addLocalization: async (
    courseVersionId: string,
    unitId: string,
    data: ContentLocalization
  ): Promise<void> => {
    return apiClient.post(
      `/admin/course-versions/${courseVersionId}/units/${unitId}/localizations`,
      data
    )
  },

  /**
   * Update unit localization
   */
  updateLocalization: async (
    courseVersionId: string,
    unitId: string,
    languageId: number,
    data: ContentLocalization
  ): Promise<void> => {
    return apiClient.put(
      `/admin/course-versions/${courseVersionId}/units/${unitId}/localizations/${languageId}`,
      data
    )
  },

  /**
   * Delete unit localization
   */
  deleteLocalization: async (
    courseVersionId: string,
    unitId: string,
    languageId: number
  ): Promise<void> => {
    return apiClient.delete(
      `/admin/course-versions/${courseVersionId}/units/${unitId}/localizations/${languageId}`
    )
  },
}
