/**
 * Auth API Service
 * API calls for authentication endpoints
 */

import { apiClient } from './client'
import { authStorage } from '@/lib/utils/storage'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  MessageResponse,
  User,
} from '@/lib/types/auth'

export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials,
      { requireAuth: false }
    )
    
    // Store tokens
    authStorage.setTokens(response.accessToken, response.refreshToken)
    authStorage.setUser(response.user)
    
    return response
  },

  /**
   * Logout - invalidate refresh token
   */
  logout: async (): Promise<void> => {
    const refreshToken = authStorage.getRefreshToken()
    
    if (refreshToken) {
      try {
        await apiClient.post<MessageResponse>(
          '/auth/logout',
          { refreshToken } as LogoutRequest,
          { requireAuth: true }
        )
      } catch {
        // Ignore logout errors, clear tokens anyway
      }
    }
    
    authStorage.clearAll()
  },

  /**
   * Refresh access token
   */
  refresh: async (): Promise<RefreshTokenResponse> => {
    const refreshToken = authStorage.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh',
      { refreshToken } as RefreshTokenRequest,
      { requireAuth: false }
    )
    
    // Update stored tokens
    authStorage.setTokens(response.accessToken, response.refreshToken)
    
    return response
  },

  /**
   * Get current authenticated user
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me')
    authStorage.setUser(response)
    return response
  },

  /**
   * Check if email exists (for password reset)
   */
  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    return apiClient.post<{ exists: boolean }>(
      '/auth/check-email',
      { email },
      { requireAuth: false }
    )
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<MessageResponse> => {
    return apiClient.post<MessageResponse>(
      '/auth/forgot-password',
      { email },
      { requireAuth: false }
    )
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (
    email: string,
    otpCode: string,
    newPassword: string
  ): Promise<MessageResponse> => {
    return apiClient.post<MessageResponse>(
      '/auth/reset-password',
      { email, otpCode, newPassword },
      { requireAuth: false }
    )
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<MessageResponse> => {
    return apiClient.post<MessageResponse>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },
}
