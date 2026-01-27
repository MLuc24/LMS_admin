/**
 * User Role Dialog Component
 * Manage user roles
 */

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { USER_ROLES, type AdminUser, type UserRole, type SetUserRolesRequest } from '@/lib/types/user'

interface UserRoleDialogProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (userId: string, data: SetUserRolesRequest) => Promise<void>
}

export function UserRoleDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: UserRoleDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([])

  useEffect(() => {
    if (user) {
      setSelectedRoles([...user.roles])
    }
  }, [user])

  const handleToggleRole = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || selectedRoles.length === 0) return

    setIsLoading(true)
    try {
      await onSave(user.userId, { roles: selectedRoles })
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Manage Roles</DialogTitle>
          <DialogDescription>
            Update roles for <span className="font-medium">{user.displayName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Select at least one role for this user.
            </p>

            <div className="space-y-3">
              {USER_ROLES.map((role) => (
                <div key={role.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={() => handleToggleRole(role.value)}
                  />
                  <Label
                    htmlFor={role.value}
                    className="cursor-pointer font-normal"
                  >
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>

            {selectedRoles.length === 0 && (
              <p className="text-sm text-destructive">
                At least one role is required.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || selectedRoles.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Roles
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
