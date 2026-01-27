/**
 * Login Form Component
 * Handles user login with email and password
 */

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema } from '@/lib/schemas/auth'
import type { LoginFormData } from '@/lib/schemas/auth'

// ============ TYPES ============

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

// ============ COMPONENT ============

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // Validate with Zod
      const result = loginSchema.safeParse(value)
      if (!result.success) {
        return
      }
      await onSubmit(result.data)
    },
  })

  // Get field errors
  const getFieldError = (fieldName: 'email' | 'password', value: string) => {
    const result = loginSchema.shape[fieldName].safeParse(value)
    if (!result.success) {
      return result.error.issues[0]?.message
    }
    return undefined
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {/* Email Field */}
      <form.Field name="email">
        {(field) => {
          const fieldError = field.state.meta.isTouched
            ? getFieldError('email', field.state.value)
            : undefined

          return (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={isLoading}
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? 'email-error' : undefined}
                />
              </div>
              {fieldError && (
                <p id="email-error" className="text-xs text-destructive">
                  {fieldError}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* Password Field */}
      <form.Field name="password">
        {(field) => {
          const fieldError = field.state.meta.isTouched
            ? getFieldError('password', field.state.value)
            : undefined

          return (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  disabled={isLoading}
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {fieldError && (
                <p id="password-error" className="text-xs text-destructive">
                  {fieldError}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* Error Message */}
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded border border-destructive/20">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
