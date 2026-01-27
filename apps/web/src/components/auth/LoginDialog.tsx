/**
 * Login Dialog Component
 * Modal dialog for user login
 */

import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'
import { useAuth } from '@/lib/contexts/AuthContext'
import type { LoginFormData } from '@/lib/schemas/auth'

// ============ TYPES ============

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ============ COMPONENT ============

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuth()

  const handleSubmit = useCallback(
    async (data: LoginFormData) => {
      clearError()
      try {
        await login(data)
        // Login thành công, đóng modal
        onOpenChange(false)
        // Refresh để update UI
        navigate({ to: '/' })
      } catch {
        // Error sẽ được xử lý bởi AuthContext
        // Không cần làm gì thêm
      }
    },
    [login, navigate, clearError, onOpenChange]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Admin Portal</DialogTitle>
          <DialogDescription>
            Sign in to access the admin dashboard
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
