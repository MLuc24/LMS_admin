/**
 * Auth Storage Utility
 * Handles token persistence in localStorage
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'lms_admin_access_token',
  REFRESH_TOKEN: 'lms_admin_refresh_token',
  USER: 'lms_admin_user',
} as const

// ============ TOKEN STORAGE ============

export const authStorage = {
  // Access Token
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
  },

  // Refresh Token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
  },

  // Combined token operations
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  },

  clearTokens: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  },

  // User data
  getUser: <T>(): T | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    if (!data) return null
    try {
      return JSON.parse(data) as T
    } catch {
      return null
    }
  },

  setUser: <T>(user: T): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  clearUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  // Clear all auth data
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  // Check if user is potentially authenticated
  hasTokens: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  },
}
