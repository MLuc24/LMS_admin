import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { LogOut, User as UserIcon, LogIn, Menu } from "lucide-react";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/mode-toggle";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import type { AuthContextValue } from "@/lib/types/auth";

import "../index.css";

export interface RouterAppContext {
  auth: AuthContextValue | null;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "LMS Admin",
      },
      {
        name: "description",
        content: "LMS Admin Dashboard",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = () => {
    if (!user?.displayName) return "AD";
    const names = user.displayName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.displayName.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="flex h-svh">
          {/* Mobile Sidebar Overlay */}
          {isAuthenticated && mobileSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          {/* Sidebar - Desktop */}
          {isAuthenticated && (
            <div className="hidden lg:block">
              <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          )}

          {/* Sidebar - Mobile */}
          {isAuthenticated && (
            <div
              className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:hidden ${
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <Sidebar onToggle={() => setMobileSidebarOpen(false)} />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setMobileSidebarOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                <h1 className="text-lg font-semibold">LMS Admin</h1>
              </div>

              <div className="flex items-center gap-2">
                <ModeToggle />
                
                {isAuthenticated ? (
                  /* User Menu */
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={(props) => (
                        <Button variant="ghost" size="sm" className="gap-2" {...props}>
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                            <AvatarFallback>{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <span className="hidden sm:inline">{user?.displayName}</span>
                        </Button>
                      )}
                    />
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center gap-3 px-2 py-2">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">{user?.displayName}</span>
                          <span className="text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="mr-2 size-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  /* Login Button */
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => setShowLoginDialog(true)}
                    className="gap-2"
                  >
                    <LogIn className="size-4" />
                    <span>Sign in</span>
                  </Button>
                )}
              </div>
            </header>

            {/* Breadcrumb */}
            {isAuthenticated && (
              <div className="border-b bg-card px-4 py-2 lg:px-6">
                <Breadcrumb />
              </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-muted/30 p-4 lg:p-6">
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster richColors />
        
        {/* Login Dialog */}
        <LoginDialog 
          open={showLoginDialog} 
          onOpenChange={setShowLoginDialog}
        />
      </ThemeProvider>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  );
}
