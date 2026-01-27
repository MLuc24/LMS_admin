/**
 * Auth Context & Provider
 * Global authentication state management
 */

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { authApi } from '@/lib/api/auth'
import { authStorage } from '@/lib/utils/storage'
import { ApiClientError } from '@/lib/api/client'
import type {
  User,
  LoginRequest,
  AuthContextValue,
  AuthState,
} from '@/lib/types/auth'

// ============ CONTEXT ============

const AuthContext = createContext<AuthContextValue | null>(null)

// ============ INITIAL STATE ============

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// ============ PROVIDER ============

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      // Check if we have tokens stored
      if (!authStorage.hasTokens()) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        return
      }

      // Try to get user from storage first
      const storedUser = authStorage.getUser<User>()
      if (storedUser) {
        setState({
          user: storedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      }

      // Validate token by fetching user
      try {
        const user = await authApi.getMe()
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        // Token invalid, clear storage
        authStorage.clearAll()
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      }
    }

    initAuth()
  }, [])

  // Login handler
  const login = useCallback(async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await authApi.login(credentials)
      
      // Check if user has admin role
      const hasAdminRole = response.user.roles?.some(
        role => role === 'SUPER_ADMIN' || role === 'ADMIN'
      )

      if (!hasAdminRole) {
        authStorage.clearAll()
        throw new Error('Access denied. Admin privileges required.')
      }

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const message = error instanceof ApiClientError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Login failed'

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      throw error
    }
  }, [])

  // Logout handler
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      await authApi.logout()
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  // Refresh token handler
  const refreshToken = useCallback(async () => {
    try {
      await authApi.refresh()
    } catch {
      // If refresh fails, logout
      authStorage.clearAll()
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    refreshToken,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ============ HOOK ============

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
