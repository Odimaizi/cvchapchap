"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/contexts/subscription-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  FileText,
  Mail,
  Zap,
  LogOut,
  Moon,
  Sun,
  Briefcase,
  MessageSquare,
  Award,
  Settings,
  BarChart,
  User,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { plan, hasAccessTo } = useSubscription()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) {
        console.error("Error fetching session:", error.message)
      } else {
        setSession(session)
      }
      setLoading(false)
    }

    getSession()
  }, [supabase.auth])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push("/login")
    return null
  }

  const tools = [
    {
      title: "Resume Builder",
      icon: FileText,
      link: "/resume/templates",
      description: "Create professional resumes",
      locked: false,
    },
    {
      title: "Cover Letter",
      icon: Mail,
      link: "/cover-letter",
      description: "Generate compelling cover letters",
      locked: false,
    },
    {
      title: "ATS Optimization",
      icon: Zap,
      link: "/ats-optimization",
      description: "Optimize for applicant tracking systems",
      locked: !hasAccessTo("ats"),
    },
    {
      title: "Interview Prep",
      icon: MessageSquare,
      link: "/interview-prep",
      description: "Practice interview questions",
      locked: !hasAccessTo("interview"),
    },
    {
      title: "Job Board",
      icon: Briefcase,
      link: "/job-board",
      description: "Find job opportunities",
      locked: false,
    },
    {
      title: "CV Assessment",
      icon: Award,
      link: "/cv-assessment",
      description: "Get expert feedback on your CV",
      locked: !hasAccessTo("assessment"),
    },
    {
      title: "Profile",
      icon: User,
      link: "/profile",
      description: "Manage your profile information",
      locked: false,
    },
    {
      title: "Settings",
      icon: Settings,
      link: "/settings",
      description: "Manage your account settings",
      locked: false,
    },
  ]

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, {session.user.email}</h2>
          <div className="flex items-center mt-2">
            <Badge variant={plan === "professional" ? "default" : plan === "premium" ? "secondary" : "outline"}>
              {plan === "professional" ? "Professional Plan" : plan === "premium" ? "Premium Plan" : "Free Plan"}
            </Badge>
            {plan !== "professional" && (
              <Link href="/pricing" className="text-sm ml-2 underline">
                Upgrade
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch checked={theme === "dark"} onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")} />
            <Moon className="h-4 w-4" />
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool, index) => (
          <Link href={tool.locked ? "/pricing" : tool.link} key={index}>
            <Card
              className={`h-full hover:bg-accent transition-colors cursor-pointer ${tool.locked ? "opacity-70" : ""}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{tool.title}</CardTitle>
                <tool.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
                {tool.locked && (
                  <Badge variant="outline" className="mt-2">
                    Premium Feature
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {plan === "free" && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Upgrade to Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Get access to all premium features including ATS Optimization, Interview Prep, and more.
            </p>
            <Button asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
