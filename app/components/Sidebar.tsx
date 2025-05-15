import Link from "next/link"
import { FileText, Mail, Home, Settings, LogIn, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type React from "react" // Import React

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 min-h-screen flex flex-col justify-between", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">CV Chap</h2>
          <div className="space-y-1">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/resume">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Resume Builder
              </Button>
            </Link>
            <Link href="/cover-letter">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Cover Letter
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="space-y-1">
          <Link href="/login">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LogIn className="h-4 w-4" />
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
