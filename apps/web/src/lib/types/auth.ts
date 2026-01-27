/**
 * Auth Module Types
 * Type definitions for authentication
 */

// ============ USER TYPES ============

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
export type UserStatus = 'active' | 'suspended' | 'deleted'

export interface User {
  userId: string
  email?: string
  phone?: string
  displayName: string
  avatarAssetId?: string
  avatarUrl?: string
  status: UserStatus
  roles?: UserRole[]
  lastLoginAt?: string
  createdAt: string
}

// ============ AUTH REQUEST DTOs ============

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string
  otpCode: string
  newPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// ============ AUTH RESPONSE DTOs ============

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginResponse extends AuthTokens {
  user: User
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface MessageResponse {
  message: string
}

// ============ API RESPONSE WRAPPER ============

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
}

// ============ AUTH STATE ============

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
}
