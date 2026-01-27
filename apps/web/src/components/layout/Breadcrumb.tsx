import { Link, useMatches } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Breadcrumb() {
  const matches = useMatches()

  // Filter out root and build breadcrumb items
  const breadcrumbs = matches
    .filter((match) => match.pathname !== '/')
    .map((match) => ({
      path: match.pathname,
      title: match.pathname.split('/').filter(Boolean).pop() || 'Home',
    }))

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>

      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={breadcrumb.path} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" />
            {isLast ? (
              <span className="font-medium text-foreground capitalize">
                {breadcrumb.title}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="hover:text-foreground transition-colors capitalize"
              >
                {breadcrumb.title}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
