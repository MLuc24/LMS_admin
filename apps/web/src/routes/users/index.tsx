/**
 * Users Page
 * User management with list, search, filters, and CRUD operations
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Users } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import {
  UserTable,
  UserFilters,
  UserDetailDialog,
  UserRoleDialog,
} from '@/components/users'

import { usersApi } from '@/lib/api/users'
import { useAuth } from '@/lib/contexts/AuthContext'
import type {
  AdminUser,
  UserListResponse,
  ListUsersParams,
  UpdateUserRequest,
  SetUserRolesRequest,
  UserRole,
  UserStatus,
} from '@/lib/types/user'

// Search params type for URL state
interface UsersSearchParams {
  page?: number
  limit?: number
  search?: string
  status?: UserStatus
  role?: UserRole
}

export const Route = createFileRoute('/users/')({
  validateSearch: (search: Record<string, unknown>): UsersSearchParams => ({
    page: Number(search.page) || 1,
    limit: Number(search.limit) || 20,
    search: (search.search as string) || '',
    status: (search.status as UserStatus) || undefined,
    role: (search.role as UserRole) || undefined,
  }),
  component: UsersPage,
})

function UsersPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const searchParams = Route.useSearch()

  // State
  const [data, setData] = useState<UserListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Dialog state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailDialogMode, setDetailDialogMode] = useState<'view' | 'edit'>('view')
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)

  // Filters from URL
  const page = searchParams.page || 1
  const limit = searchParams.limit || 20
  const search = searchParams.search || ''
  const status = searchParams.status || ''
  const role = searchParams.role || ''

  // Update URL with new params
  const updateParams = useCallback(
    (newParams: Partial<UsersSearchParams>) => {
      navigate({
        to: '/users',
        search: (prev) => ({
          ...prev,
          ...newParams,
          // Reset to page 1 when filters change
          page: newParams.page ?? (newParams.search !== undefined || newParams.status !== undefined || newParams.role !== undefined ? 1 : prev.page),
        }),
        replace: true,
      })
    },
    [navigate]
  )

  // Fetch users
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const params: ListUsersParams = {
        page,
        limit,
      }
      if (search) params.search = search
      if (status) params.status = status as UserStatus
      if (role) params.role = role as UserRole

      const response = await usersApi.getUsers(params)
      setData(response)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [isAuthenticated, page, limit, search, status, role])

  // Initial load and refetch on param change
  useEffect(() => {
    setIsLoading(true)
    fetchUsers()
  }, [fetchUsers])

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchUsers()
  }

  // Handlers for dialogs
  const handleView = (user: AdminUser) => {
    setSelectedUser(user)
    setDetailDialogMode('view')
    setDetailDialogOpen(true)
  }

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user)
    setDetailDialogMode('edit')
    setDetailDialogOpen(true)
  }

  const handleManageRoles = (user: AdminUser) => {
    setSelectedUser(user)
    setRoleDialogOpen(true)
  }

  // Save handlers
  const handleSaveUser = async (userId: string, updateData: UpdateUserRequest) => {
    try {
      await usersApi.updateUser(userId, updateData)
      toast.success('User updated successfully')
      fetchUsers()
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error('Failed to update user')
      throw error
    }
  }

  const handleSaveRoles = async (userId: string, rolesData: SetUserRolesRequest) => {
    try {
      await usersApi.setUserRoles(userId, rolesData)
      toast.success('User roles updated successfully')
      fetchUsers()
    } catch (error) {
      console.error('Failed to update roles:', error)
      toast.error('Failed to update roles')
      throw error
    }
  }

  // Filter handlers
  const handleSearchChange = (value: string) => {
    updateParams({ search: value || undefined })
  }

  const handleStatusChange = (value: UserStatus | '') => {
    updateParams({ status: value || undefined })
  }

  const handleRoleChange = (value: UserRole | '') => {
    updateParams({ role: value || undefined })
  }

  const handleClearFilters = () => {
    updateParams({ search: undefined, status: undefined, role: undefined, page: 1 })
  }

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage })
  }

  const handleLimitChange = (newLimit: number) => {
    updateParams({ limit: newLimit, page: 1 })
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please login to access user management.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            {data ? `${data.total} users total` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <UserFilters
            search={search}
            status={status as UserStatus | ''}
            role={role as UserRole | ''}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
            onClear={handleClearFilters}
          />

          {/* Table */}
          <UserTable
            users={data?.items || []}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onManageRoles={handleManageRoles}
          />

          {/* Pagination */}
          {data && (
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UserDetailDialog
        user={selectedUser}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onSave={handleSaveUser}
        mode={detailDialogMode}
      />

      <UserRoleDialog
        user={selectedUser}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSave={handleSaveRoles}
      />
    </div>
  )
}
