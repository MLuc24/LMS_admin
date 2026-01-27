/**
 * User Filters Component
 * Search and filter controls for user list
 */

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { USER_ROLES, USER_STATUSES, type UserRole, type UserStatus } from '@/lib/types/user'

interface UserFiltersProps {
  search: string
  status: UserStatus | ''
  role: UserRole | ''
  onSearchChange: (value: string) => void
  onStatusChange: (value: UserStatus | '') => void
  onRoleChange: (value: UserRole | '') => void
  onClear: () => void
}

export function UserFilters({
  search,
  status,
  role,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onClear,
}: UserFiltersProps) {
  const hasFilters = search || status || role

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Select value={status || 'all'} onValueChange={(v) => onStatusChange(v === 'all' ? '' : v as UserStatus)}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {USER_STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Role Filter */}
      <Select value={role || 'all'} onValueChange={(v) => onRoleChange(v === 'all' ? '' : v as UserRole)}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {USER_ROLES.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-9">
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
