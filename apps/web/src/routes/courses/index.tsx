/**
 * Courses Page
 * Course management with list, search, filters, and CRUD operations
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Plus, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import {
  CourseTable,
  CourseFilters,
  CourseFormDialog,
  CourseDeleteDialog,
} from '@/components/courses'

import { coursesApi } from '@/lib/api/courses'
import { useAuth } from '@/lib/contexts/AuthContext'
import type {
  Course,
  CourseListResponse,
  ListCoursesParams,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '@/lib/types/course'

// Search params type for URL state
interface CoursesSearchParams {
  page?: number
  limit?: number
  search?: string
  targetLanguageId?: number
  levelId?: number
  isPublished?: boolean
}

export const Route = createFileRoute('/courses/')({
  validateSearch: (search: Record<string, unknown>): CoursesSearchParams => ({
    page: Number(search.page) || 1,
    limit: Number(search.limit) || 10,
    search: (search.search as string) || '',
    targetLanguageId: search.targetLanguageId ? Number(search.targetLanguageId) : undefined,
    levelId: search.levelId ? Number(search.levelId) : undefined,
    isPublished: search.isPublished !== undefined ? search.isPublished === 'true' : undefined,
  }),
  component: CoursesPage,
})

function CoursesPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const searchParams = Route.useSearch()

  // State
  const [data, setData] = useState<CourseListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Dialog state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Filters from URL
  const page = searchParams.page || 1
  const limit = searchParams.limit || 10
  const search = searchParams.search || ''
  const targetLanguageId = searchParams.targetLanguageId
  const levelId = searchParams.levelId
  const isPublished = searchParams.isPublished

  // Update URL with new params
  const updateParams = useCallback(
    (newParams: Partial<CoursesSearchParams>) => {
      navigate({
        to: '/courses',
        search: (prev) => ({
          ...prev,
          ...newParams,
          page: newParams.page ?? (
            newParams.search !== undefined ||
            newParams.targetLanguageId !== undefined ||
            newParams.levelId !== undefined ||
            newParams.isPublished !== undefined
              ? 1
              : prev.page
          ),
        }),
        replace: true,
      })
    },
    [navigate]
  )

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const params: ListCoursesParams = { page, limit }
      if (search) params.search = search
      if (targetLanguageId) params.targetLanguageId = targetLanguageId
      if (levelId) params.levelId = levelId
      if (isPublished !== undefined) params.isPublished = isPublished

      const response = await coursesApi.getCourses(params)
      setData(response)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [isAuthenticated, page, limit, search, targetLanguageId, levelId, isPublished])

  // Initial load and refetch on param change
  useEffect(() => {
    setIsLoading(true)
    fetchCourses()
  }, [fetchCourses])

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchCourses()
  }

  // Dialog handlers
  const handleCreate = () => {
    setSelectedCourse(null)
    setFormDialogOpen(true)
  }

  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setFormDialogOpen(true)
  }

  const handleDelete = (course: Course) => {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  const handlePublish = async (course: Course) => {
    try {
      await coursesApi.publishCourse(course.courseId)
      toast.success('Course published successfully')
      fetchCourses()
    } catch (error) {
      console.error('Failed to publish course:', error)
      toast.error('Failed to publish course')
    }
  }

  const handleArchive = async (course: Course) => {
    try {
      await coursesApi.archiveCourse(course.courseId)
      toast.success('Course archived successfully')
      fetchCourses()
    } catch (error) {
      console.error('Failed to archive course:', error)
      toast.error('Failed to archive course')
    }
  }

  // CRUD handlers
  const handleCreateCourse = async (courseData: CreateCourseRequest) => {
    try {
      await coursesApi.createCourse(courseData)
      toast.success('Course created successfully')
      fetchCourses()
    } catch (error) {
      console.error('Failed to create course:', error)
      toast.error('Failed to create course')
      throw error
    }
  }

  const handleUpdateCourse = async (courseId: string, courseData: UpdateCourseRequest) => {
    try {
      await coursesApi.updateCourse(courseId, courseData)
      toast.success('Course updated successfully')
      fetchCourses()
    } catch (error) {
      console.error('Failed to update course:', error)
      toast.error('Failed to update course')
      throw error
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await coursesApi.deleteCourse(courseId)
      toast.success('Course deleted successfully')
      fetchCourses()
    } catch (error) {
      console.error('Failed to delete course:', error)
      toast.error('Failed to delete course')
      throw error
    }
  }

  // Filter handlers
  const handleSearchChange = (value: string) => {
    updateParams({ search: value || undefined })
  }

  const handleTargetLanguageChange = (value: string) => {
    updateParams({ targetLanguageId: value ? Number(value) : undefined })
  }

  const handleLevelChange = (value: string) => {
    updateParams({ levelId: value ? Number(value) : undefined })
  }

  const handlePublishedChange = (value: string) => {
    updateParams({ isPublished: value ? value === 'true' : undefined })
  }

  const handleClearFilters = () => {
    updateParams({
      search: undefined,
      targetLanguageId: undefined,
      levelId: undefined,
      isPublished: undefined,
      page: 1,
    })
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
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please login to access course management.
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
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage courses, units, skills, and lessons.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
          <CardDescription>
            {data ? `${data.total} courses total` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <CourseFilters
            search={search}
            targetLanguageId={targetLanguageId ? String(targetLanguageId) : ''}
            levelId={levelId ? String(levelId) : ''}
            isPublished={isPublished !== undefined ? String(isPublished) : ''}
            onSearchChange={handleSearchChange}
            onTargetLanguageChange={handleTargetLanguageChange}
            onLevelChange={handleLevelChange}
            onPublishedChange={handlePublishedChange}
            onClear={handleClearFilters}
          />

          {/* Table */}
          <CourseTable
            courses={data?.data || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            onArchive={handleArchive}
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
      <CourseFormDialog
        course={selectedCourse}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onCreate={handleCreateCourse}
        onUpdate={handleUpdateCourse}
      />

      <CourseDeleteDialog
        course={selectedCourse}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteCourse}
      />
    </div>
  )
}
