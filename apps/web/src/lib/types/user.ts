/**
 * User Module Types
 * Type definitions for user management
 */

// ============ USER TYPES ============

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
export type UserStatus = 'active' | 'suspended' | 'deleted'

export interface AdminUser {
  userId: string
  email?: string
  phone?: string
  displayName: string
  avatarAssetId?: string
  avatarUrl?: string
  status: UserStatus
  emailVerified?: boolean
  dob?: string
  nativeLanguageId?: number
  timezone?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  roles: UserRole[]
}

// ============ REQUEST DTOs ============

export interface ListUsersParams {
  page?: number
  limit?: number
  search?: string
  status?: UserStatus
  role?: UserRole
}

export interface UpdateUserRequest {
  email?: string
  phone?: string
  displayName?: string
  avatarAssetId?: string
  status?: UserStatus
  emailVerified?: boolean
  dob?: string
  nativeLanguageId?: number
  timezone?: string
}

export interface SetUserRolesRequest {
  roles: UserRole[]
}

// ============ RESPONSE DTOs ============

export interface UserListResponse {
  items: AdminUser[]
  total: number
  page: number
  limit: number
}

export interface UserRolesResponse {
  userId: string
  roles: UserRole[]
}

// ============ ROLE CONSTANTS ============

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'INSTRUCTOR', label: 'Instructor' },
  { value: 'STUDENT', label: 'Student' },
]

export const USER_STATUSES: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'deleted', label: 'Deleted' },
]
