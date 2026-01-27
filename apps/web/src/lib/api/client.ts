/**
 * API Client - Base HTTP client
 * Handles requests, auth headers, token refresh
 */

import { authStorage } from '@/lib/utils/storage'
import type { ApiResponse, ApiError } from '@/lib/types/auth'

// ============ CONFIG ============

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

// ============ ERROR CLASS ============

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

// ============ TOKEN REFRESH LOGIC ============

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = authStorage.getRefreshToken()
  if (!refreshToken) return null

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      authStorage.clearTokens()
      return null
    }

    const result = await response.json()
    if (result.success && result.data) {
      authStorage.setTokens(result.data.accessToken, result.data.refreshToken)
      return result.data.accessToken
    }

    return null
  } catch {
    authStorage.clearTokens()
    return null
  }
}

async function getValidAccessToken(): Promise<string | null> {
  const accessToken = authStorage.getAccessToken()
  
  // If we have a valid access token, return it
  if (accessToken) {
    // Simple expiry check - decode JWT and check exp
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const expiresAt = payload.exp * 1000
      // Refresh if token expires in less than 1 minute
      if (expiresAt - Date.now() > 60000) {
        return accessToken
      }
    } catch {
      // If we can't decode, try to refresh
    }
  }

  // Need to refresh
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false
    refreshPromise = null
  })

  return refreshPromise
}

// ============ API CLIENT ============

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  requireAuth?: boolean
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, requireAuth = true, ...init } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...init.headers,
  }

  // Add auth header if required
  if (requireAuth) {
    const accessToken = await getValidAccessToken()
    if (accessToken) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const result: ApiResponse<T> = await response.json()

  if (!response.ok || !result.success) {
    const error = result.error as ApiError
    throw new ApiClientError(
      response.status,
      error?.code || 'UNKNOWN_ERROR',
      error?.message || 'An unknown error occurred'
    )
  }

  return result.data
}

// ============ EXPORTED CLIENT ============

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}
