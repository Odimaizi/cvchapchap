"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/contexts/subscription-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  User,
  TrendingUp,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function Dashboard() {
  const { plan, hasAccessTo } = useSubscription()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("tools")
  const [analytics, setAnalytics] = useState({
    resumesCreated: 0,
    coverLettersCreated: 0,
    jobsApplied: 0,
    profileCompletion: 0,
    cvScore: 0,
    activityData: [],
    recentActivity: [],
  })
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

        if (session) {
          await fetchUserAnalytics(session.user.id)
        }
      }
      setLoading(false)
    }

    getSession()
  }, [supabase.auth])

  const fetchUserAnalytics = async (userId) => {
    try {
      // Fetch resume count
      const { count: resumeCount, error: resumeError } = await supabase
        .from("resumes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      // Fetch cover letter count
      const { count: coverLetterCount, error: coverLetterError } = await supabase
        .from("cover_letters")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      // Fetch job applications count
      const { count: jobsAppliedCount, error: jobsAppliedError } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

      // Fetch profile data to calculate completion
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single()

      // Generate mock activity data for the chart
      const activityData = generateMockActivityData()

      // Generate mock recent activity
      const recentActivity = [
        { type: "resume", action: "created", time: "2 hours ago" },
        { type: "job", action: "applied", time: "1 day ago" },
        { type: "profile", action: "updated", time: "3 days ago" },
        { type: "cover_letter", action: "created", time: "1 week ago" },
      ]

      // Calculate profile completion percentage
      let profileCompletion = 0
      let cvScore = 0

      if (profileData) {
        // Simple calculation based on filled fields
        const totalFields = Object.keys(profileData.profile_data || {}).length
        const filledFields = Object.values(profileData.profile_data || {}).filter((val) => val).length
        profileCompletion = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0

        // Use the score from the database if available, otherwise generate a random score
        cvScore = profileData.profile_score || Math.floor(Math.random() * 41) + 60 // Random score between 60-100
      }

      setAnalytics({
        resumesCreated: resumeCount || 0,
        coverLettersCreated: coverLetterCount || 0,
        jobsApplied: jobsAppliedCount || 0,
        profileCompletion,
        cvScore,
        activityData,
        recentActivity,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const generateMockActivityData = () => {
    const data = []
    const now = new Date()

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      data.push({
        date: date.toISOString().split("T")[0],
        activity: Math.floor(Math.random() * 5),
      })
    }

    return data
  }

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
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between space-y-2 mb-6">
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

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.resumesCreated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.coverLettersCreated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Applied</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.jobsApplied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CV Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.cvScore}/100</div>
            <Progress value={analytics.cvScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
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
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity Over Time</CardTitle>
                <CardDescription>Your activity over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      activity: {
                        label: "Activity",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) => {
                            const date = new Date(value)
                            return `${date.getDate()}/${date.getMonth() + 1}`
                          }}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="activity" stroke="var(--color-activity)" name="Activity" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete your profile to improve job matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Profile Completion</div>
                      <div className="text-sm text-muted-foreground">{analytics.profileCompletion}%</div>
                    </div>
                    <Progress value={analytics.profileCompletion} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">CV Score</div>
                      <div className="text-sm text-muted-foreground">{analytics.cvScore}/100</div>
                    </div>
                    <Progress value={analytics.cvScore} />
                  </div>

                  <div className="pt-4">
                    <Button asChild>
                      <Link href="/profile">Complete Your Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {activity.type === "resume" && <FileText className="h-5 w-5 text-primary" />}
                      {activity.type === "job" && <Briefcase className="h-5 w-5 text-primary" />}
                      {activity.type === "profile" && <User className="h-5 w-5 text-primary" />}
                      {activity.type === "cover_letter" && <Mail className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <div className="font-medium">
                        {activity.type === "resume" && "Resume"}
                        {activity.type === "job" && "Job Application"}
                        {activity.type === "profile" && "Profile"}
                        {activity.type === "cover_letter" && "Cover Letter"} {activity.action}
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {plan === "free" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
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
