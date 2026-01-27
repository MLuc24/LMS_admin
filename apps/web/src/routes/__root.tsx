import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { LogOut, User as UserIcon, LogIn } from "lucide-react";

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

  const handleLogout = async () => {
    await logout();
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
        <div className="flex h-svh flex-col">
          {/* Top Bar */}
          <header className="flex h-14 items-center justify-between border-b px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">LMS Admin</h1>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
              
              {isAuthenticated ? (
                /* User Menu */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <UserIcon className="size-4" />
                      <span className="hidden sm:inline">{user?.displayName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="flex flex-col gap-1 px-2 py-1.5">
                      <span className="text-sm font-medium">{user?.displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
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

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <Outlet />
          </main>
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
