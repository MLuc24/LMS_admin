/**
 * Users API Service
 * API calls for user management endpoints
 */

import { apiClient } from './client'
import type {
  AdminUser,
  ListUsersParams,
  UpdateUserRequest,
  SetUserRolesRequest,
  UserListResponse,
  UserRolesResponse,
} from '@/lib/types/user'

export const usersApi = {
  /**
   * List users with pagination, search, and filters
   */
  getUsers: async (params: ListUsersParams = {}): Promise<UserListResponse> => {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.search) searchParams.set('search', params.search)
    if (params.status) searchParams.set('status', params.status)
    if (params.role) searchParams.set('role', params.role)
    
    const query = searchParams.toString()
    const endpoint = `/admin/users${query ? `?${query}` : ''}`
    
    return apiClient.get<UserListResponse>(endpoint)
  },

  /**
   * Get user by ID
   */
  getUser: async (userId: string): Promise<AdminUser> => {
    return apiClient.get<AdminUser>(`/admin/users/${userId}`)
  },

  /**
   * Update user
   */
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<AdminUser> => {
    return apiClient.patch<AdminUser>(`/admin/users/${userId}`, data)
  },

  /**
   * Set user roles (replace all roles)
   */
  setUserRoles: async (userId: string, data: SetUserRolesRequest): Promise<UserRolesResponse> => {
    return apiClient.put<UserRolesResponse>(`/admin/users/${userId}/roles`, data)
  },
}
