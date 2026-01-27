/**
 * Index Route - Home Page
 * Welcome page for unauthenticated users, Dashboard for authenticated users
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Users, BookOpen, GraduationCap, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoginDialog } from '@/components/auth/LoginDialog'
import { useAuth } from '@/lib/contexts/AuthContext'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// ============ STATS DATA (For authenticated users) ============

const stats = [
  {
    title: 'Total Users',
    value: '0',
    description: 'Active learners',
    icon: Users,
    trend: '+0%',
  },
  {
    title: 'Courses',
    value: '0',
    description: 'Published courses',
    icon: BookOpen,
    trend: '+0%',
  },
  {
    title: 'Enrollments',
    value: '0',
    description: 'This month',
    icon: GraduationCap,
    trend: '+0%',
  },
  {
    title: 'Revenue',
    value: '$0',
    description: 'This month',
    icon: TrendingUp,
    trend: '+0%',
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.displayName}!
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your LMS platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Quick actions will be available here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Recent activity will be shown here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
