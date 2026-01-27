/**
 * Index Route - Home Page
 * Welcome page for unauthenticated users, Dashboard for authenticated users
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  ArrowUpRight,
  Activity,
  Clock,
  Plus,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoginDialog } from '@/components/auth/LoginDialog'
import { useAuth } from '@/lib/contexts/AuthContext'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// ============ STATS DATA (For authenticated users) ============

const stats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    changeType: 'increase' as const,
    description: 'from last month',
    icon: Users,
  },
  {
    title: 'Active Courses',
    value: '24',
    change: '+3',
    changeType: 'increase' as const,
    description: 'new this week',
    icon: BookOpen,
  },
  {
    title: 'Enrollments',
    value: '8,542',
    change: '+23.1%',
    changeType: 'increase' as const,
    description: 'this month',
    icon: GraduationCap,
  },
  {
    title: 'Completion Rate',
    value: '68.4%',
    change: '+5.2%',
    changeType: 'increase' as const,
    description: 'vs last month',
    icon: TrendingUp,
  },
]

// Recent Activities
const recentActivities = [
  {
    id: 1,
    type: 'user',
    message: 'New user registered',
    name: 'John Doe',
    time: '5 minutes ago',
  },
  {
    id: 2,
    type: 'course',
    message: 'Course published',
    name: 'Advanced React Patterns',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'enrollment',
    message: 'Bulk enrollment completed',
    name: '45 students enrolled',
    time: '2 hours ago',
  },
  {
    id: 4,
    type: 'user',
    message: 'User profile updated',
    name: 'Jane Smith',
    time: '3 hours ago',
  },
]

// Quick Actions
const quickActions = [
  {
    title: 'Create Course',
    description: 'Add a new course to your platform',
    icon: BookOpen,
    action: () => console.log('Create course'),
  },
  {
    title: 'Add User',
    description: 'Register a new student or instructor',
    icon: Users,
    action: () => console.log('Add user'),
  },
  {
    title: 'View Analytics',
    description: 'Check platform performance metrics',
    icon: BarChart3,
    action: () => console.log('View analytics'),
  },
  {
    title: 'Manage Enrollments',
    description: 'Enroll students in courses',
    icon: GraduationCap,
    action: () => console.log('Manage enrollments'),
  },
]

// ============ FEATURES DATA (For welcome page) ============

const features = [
  {
    icon: Shield,
    title: 'Secure Administration',
    description: 'Enterprise-grade security for managing your LMS platform',
  },
  {
    icon: Zap,
    title: 'Fast & Efficient',
    description: 'Streamlined workflows to manage courses, users, and content',
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    description: 'Comprehensive insights into platform performance and user engagement',
  },
]

// ============ PAGE COMPONENT ============

function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  // Hiển thị login modal nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginDialog(true)
    }
  }, [isAuthenticated])

  // Welcome Page - Khi chưa login
  if (!isAuthenticated) {
    return (
      <>
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
          <div className="w-full max-w-5xl space-y-12 text-center">
            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                LMS Admin Portal
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Powerful tools to manage your learning management system.
                Control courses, users, analytics, and more from one place.
              </p>
              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={() => setShowLoginDialog(true)}
                  className="text-base"
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-2">
                  <CardHeader className="space-y-4">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="size-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="rounded-lg border bg-muted/50 p-8">
              <p className="text-sm text-muted-foreground">
                Sign in to access your admin dashboard and start managing your platform
              </p>
            </div>
          </div>
        </div>

        {/* Login Dialog */}
        <LoginDialog 
          open={showLoginDialog} 
          onOpenChange={setShowLoginDialog}
        />
      </>
    )
  }

  // Dashboard - Khi đã login
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.displayName}! 👋
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your LMS platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="animate-in slide-in-from-bottom duration-300" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={stat.changeType === 'increase' ? 'success' : 'destructive'}
                  className="text-xs"
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto justify-start gap-3 p-4 text-left"
                  onClick={action.action}
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{action.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="rounded-full bg-primary/10 p-2">
                    {activity.type === 'user' && <Users className="h-3 w-3 text-primary" />}
                    {activity.type === 'course' && <BookOpen className="h-3 w-3 text-primary" />}
                    {activity.type === 'enrollment' && <GraduationCap className="h-3 w-3 text-primary" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      {activity.message}
                      <span className="font-medium"> {activity.name}</span>
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Overview
          </CardTitle>
          <CardDescription>
            Key metrics and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center space-y-2">
              <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
              <p className="text-sm">Charts and analytics will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
