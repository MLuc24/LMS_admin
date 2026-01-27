import { Link, useMatchRoute } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  FileText,
  Tags,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

const navigation = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        exact: true,
      },
      {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Users',
        href: '/users',
        icon: Users,
      },
      {
        title: 'Courses',
        href: '/courses',
        icon: BookOpen,
      },
      {
        title: 'Enrollments',
        href: '/enrollments',
        icon: GraduationCap,
      },
      {
        title: 'Categories',
        href: '/categories',
        icon: Tags,
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        title: 'Pages',
        href: '/pages',
        icon: FileText,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
]

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const matchRoute = useMatchRoute()
  
  return (
    <aside
      className={cn(
        'border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar Header */}
        <div className="flex h-14 items-center border-b px-3">
          {!collapsed && (
            <h2 className="text-sm font-semibold">Navigation</h2>
          )}
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className={cn('ml-auto h-8 w-8', collapsed && 'mx-auto')}
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  !collapsed && 'rotate-180'
                )}
              />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-6">
            {navigation.map((section) => (
              <div key={section.title}>
                {!collapsed && (
                  <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = matchRoute({ to: item.href, fuzzy: !item.exact })
                    
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground',
                          collapsed && 'justify-center px-2'
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  )
}
