/**
 * Course Detail Page
 * View and manage a single course with its content
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  RefreshCw,
  Edit,
  Globe,
  Archive,
  Trash2,
  Plus,
  BookOpen,
  Layers,
  Target,
  GraduationCap,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CourseFormDialog,
  CourseDeleteDialog,
} from '@/components/courses'

import { coursesApi } from '@/lib/api/courses'
import { unitsApi } from '@/lib/api/units'
import { useAuth } from '@/lib/contexts/AuthContext'
import {
  type Course,
  type UpdateCourseRequest,
  getLanguageName,
  getLevelName,
} from '@/lib/types/course'
import type { Unit } from '@/lib/types/content'
import { ContentTree } from '@/components/content'

export const Route = createFileRoute('/courses/$courseId')({
  component: CourseDetailPage,
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function CourseDetailPage() {
  const { courseId } = Route.useParams()
  const { isAuthenticated } = useAuth()
  const navigate = Route.useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Units state
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoadingUnits, setIsLoadingUnits] = useState(false)

  const fetchCourse = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const data = await coursesApi.getCourse(courseId)
      setCourse(data)
    } catch (error) {
      console.error('Failed to fetch course:', error)
      toast.error('Failed to load course')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [isAuthenticated, courseId])

  const fetchUnits = useCallback(async () => {
    if (!course?.currentVersionId) return

    setIsLoadingUnits(true)
    try {
      const response = await unitsApi.getUnits(course.currentVersionId)
      setUnits(response.data)
    } catch (error) {
      console.error('Failed to fetch units:', error)
      toast.error('Failed to load units')
    } finally {
      setIsLoadingUnits(false)
    }
  }, [course?.currentVersionId])

  useEffect(() => {
    fetchCourse()
  }, [fetchCourse])

  useEffect(() => {
    if (course?.currentVersionId) {
      fetchUnits()
    }
  }, [course?.currentVersionId, fetchUnits])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchCourse()
  }

  const handleUpdateCourse = async (_courseId: string, data: UpdateCourseRequest) => {
    try {
      await coursesApi.updateCourse(courseId, data)
      toast.success('Course updated successfully')
      fetchCourse()
    } catch (error) {
      console.error('Failed to update course:', error)
      toast.error('Failed to update course')
      throw error
    }
  }

  const handleDeleteCourse = async () => {
    try {
      await coursesApi.deleteCourse(courseId)
      toast.success('Course deleted successfully')
      navigate({ to: '/courses' })
    } catch (error) {
      console.error('Failed to delete course:', error)
      toast.error('Failed to delete course')
      throw error
    }
  }

  const handlePublish = async () => {
    try {
      await coursesApi.publishCourse(courseId)
      toast.success('Course published successfully')
      fetchCourse()
    } catch (error) {
      console.error('Failed to publish course:', error)
      toast.error('Failed to publish course')
    }
  }

  const handleArchive = async () => {
    try {
      await coursesApi.archiveCourse(courseId)
      toast.success('Course archived successfully')
      fetchCourse()
    } catch (error) {
      console.error('Failed to archive course:', error)
      toast.error('Failed to archive course')
    }
  }

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Course Not Found</CardTitle>
            <CardDescription>
              The course you are looking for does not exist or has been deleted.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/courses" className={cn(buttonVariants())}>
              Back to Courses
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const title = course.title || course.localizations[0]?.title || 'Untitled Course'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link 
            to="/courses" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                {course.isPublished ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {course.courseCode} - Created {formatDate(course.createdAt)}
            </p>
          </div>
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
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {!course.isPublished ? (
            <Button size="sm" onClick={handlePublish}>
              <Globe className="mr-2 h-4 w-4" />
              Publish
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleArchive}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Target Language</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLanguageName(course.targetLanguageId)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Base Language</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLanguageName(course.baseLanguageId)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLevelName(course.levelId)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Localizations</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.localizations.length}</div>
            <p className="text-xs text-muted-foreground">language versions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
          <CardDescription>
            Manage units, skills, and lessons for this course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="localizations" className="w-full">
            <TabsList>
              <TabsTrigger value="localizations">Localizations</TabsTrigger>
              <TabsTrigger value="units">Units</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="localizations" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Manage course title and description in different languages.
                  </p>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Language
                  </Button>
                </div>
                <div className="space-y-3">
                  {course.localizations.map((loc) => (
                    <Card key={loc.languageId}>
                      <CardContent className="flex items-start justify-between pt-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{getLanguageName(loc.languageId)}</Badge>
                          </div>
                          <h3 className="mt-2 font-semibold">{loc.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {loc.description || 'No description'}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="units" className="mt-4">
              {course.currentVersionId ? (
                <ContentTree
                  courseVersionId={course.currentVersionId}
                  units={units}
                  isLoading={isLoadingUnits}
                  onRefresh={fetchUnits}
                />
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Layers className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 font-semibold">No Course Version</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This course doesn't have a version yet.
                  </p>
                  <div className="mt-4 rounded-lg bg-muted p-4 text-left">
                    <p className="text-sm font-medium">To fix this issue:</p>
                    <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                      <li>Delete this course using the "Delete Course" button in Settings tab</li>
                      <li>Create a new course - it will automatically have a version</li>
                      <li>Or check the database to see if a version exists but isn't linked</li>
                    </ol>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" onClick={() => {
                      const tabsList = document.querySelector('[role="tablist"]')
                      const settingsTab = tabsList?.querySelector('[value="settings"]') as HTMLElement
                      settingsTab?.click()
                    }}>
                      Go to Settings
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="font-semibold">Course ID</h3>
                    <p className="font-mono text-sm text-muted-foreground">{course.courseId}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Cover Image</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.coverAssetId || 'No cover image'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Created</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(course.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Last Updated</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(course.updatedAt)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-destructive">Danger Zone</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Permanently delete this course and all its content.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Course
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CourseFormDialog
        course={course}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onCreate={async () => {}}
        onUpdate={handleUpdateCourse}
      />

      <CourseDeleteDialog
        course={course}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteCourse}
      />
    </div>
  )
}
