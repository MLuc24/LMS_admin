/**
 * Skills API Service
 * API calls for skill management endpoints
 */

import { apiClient } from './client'
import type {
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
  ReorderSkillsRequest,
  SkillListResponse,
  ContentLocalization,
} from '@/lib/types/content'

export const skillsApi = {
  /**
   * List skills for a unit
   */
  getSkills: async (unitId: string, languageId?: number): Promise<SkillListResponse> => {
    const query = languageId ? `?languageId=${languageId}` : ''
    return apiClient.get<SkillListResponse>(`/admin/units/${unitId}/skills${query}`)
  },

  /**
   * Get skill by ID
   */
  getSkill: async (unitId: string, skillId: string, languageId?: number): Promise<Skill> => {
    const query = languageId ? `?languageId=${languageId}` : ''
    return apiClient.get<Skill>(`/admin/units/${unitId}/skills/${skillId}${query}`)
  },

  /**
   * Create a new skill
   */
  createSkill: async (unitId: string, data: CreateSkillRequest): Promise<Skill> => {
    return apiClient.post<Skill>(`/admin/units/${unitId}/skills`, data)
  },

  /**
   * Update a skill
   */
  updateSkill: async (
    unitId: string,
    skillId: string,
    data: UpdateSkillRequest
  ): Promise<Skill> => {
    return apiClient.put<Skill>(`/admin/units/${unitId}/skills/${skillId}`, data)
  },

  /**
   * Delete a skill
   */
  deleteSkill: async (unitId: string, skillId: string): Promise<void> => {
    return apiClient.delete(`/admin/units/${unitId}/skills/${skillId}`)
  },

  /**
   * Reorder skills
   */
  reorderSkills: async (unitId: string, data: ReorderSkillsRequest): Promise<void> => {
    return apiClient.put(`/admin/units/${unitId}/skills/reorder`, data)
  },

  /**
   * Add localization to a skill
   */
  addLocalization: async (
    unitId: string,
    skillId: string,
    data: ContentLocalization
  ): Promise<void> => {
    return apiClient.post(`/admin/units/${unitId}/skills/${skillId}/localizations`, data)
  },

  /**
   * Update skill localization
   */
  updateLocalization: async (
    unitId: string,
    skillId: string,
    languageId: number,
    data: ContentLocalization
  ): Promise<void> => {
    return apiClient.put(
      `/admin/units/${unitId}/skills/${skillId}/localizations/${languageId}`,
      data
    )
  },

  /**
   * Delete skill localization
   */
  deleteLocalization: async (
    unitId: string,
    skillId: string,
    languageId: number
  ): Promise<void> => {
    return apiClient.delete(
      `/admin/units/${unitId}/skills/${skillId}/localizations/${languageId}`
    )
  },
}
