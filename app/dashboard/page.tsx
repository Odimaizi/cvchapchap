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
  ClipboardCheck,
  LogOut,
  FileScanIcon as FileScanner,
  BarChart,
  Award,
  Moon,
  Sun,
  Lock,
  Briefcase,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations"
import { JobMatches } from "@/components/JobMatches"
import { CareerGoals } from "@/components/CareerGoals"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { plan, usage, hasAccessTo } = useSubscription()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [cvBoraScore, setCvBoraScore] = useState(0)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { theme, setTheme } = useTheme()

  // Analytics data
  const [analytics, setAnalytics] = useState({
    resumesCreated: 0,
    coverLettersCreated: 0,
    jobsApplied: 0,
    interviewsScheduled: 0,
    lastActivity: "",
    recentSearches: [],
    upcomingInterviews: [],
    applicationStatus: {
      pending: 0,
      reviewed: 0,
      interview: 0,
      rejected: 0,
      accepted: 0,
    },
  })

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
        // Simulate profile completion calculation
        setProfileCompletion(Math.floor(Math.random() * 101))
        // Simulate CV Bora score calculation
        setCvBoraScore(Math.floor(Math.random() * 101))

        // Simulate analytics data
        setAnalytics({
          resumesCreated: Math.floor(Math.random() * 10),
          coverLettersCreated: Math.floor(Math.random() * 8),
          jobsApplied: Math.floor(Math.random() * 15),
          interviewsScheduled: Math.floor(Math.random() * 5),
          lastActivity: "2 hours ago",
          recentSearches: ["Software Engineer", "Product Manager", "UX Designer"],
          upcomingInterviews: [
            { company: "Tech Corp", date: "Tomorrow, 2:00 PM" },
            { company: "Innovate Inc", date: "Friday, 10:00 AM" },
          ],
          applicationStatus: {
            pending: Math.floor(Math.random() * 10),
            reviewed: Math.floor(Math.random() * 8),
            interview: Math.floor(Math.random() * 5),
            rejected: Math.floor(Math.random() * 3),
            accepted: Math.floor(Math.random() * 2),
          },
        })
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

  const featuredCards = [
    {
      title: "Create Resume",
      icon: FileText,
      link: "/resume/templates",
      description: "Build your professional resume",
      locked: false,
      usage:
        plan === "free"
          ? "Pay per resume"
          : plan === "premium"
            ? `${usage.resumesUsed}/${usage.resumesLimit} used`
            : "Unlimited",
    },
    {
      title: "Write Cover Letter",
      icon: Mail,
      link: "/cover-letter",
      description: "Craft a compelling cover letter",
      locked: false,
      usage:
        plan === "free"
          ? `${usage.coverLettersUsed}/5 used`
          : plan === "premium"
            ? `${usage.coverLettersUsed}/10 used`
            : "Unlimited",
    },
    {
      title: "ATS Optimization",
      icon: Zap,
      link: "/ats-optimization",
      description: "Optimize your resume for ATS",
      locked: !hasAccessTo("ats"),
      usage: "",
    },
    {
      title: "Interview Prep",
      icon: MessageSquare,
      link: "/interview-prep",
      description: "Practice for your interviews",
      locked: !hasAccessTo("interview"),
      usage: "",
    },
  ]

  const allCards = [
    ...featuredCards,
    {
      title: "Job Board",
      icon: Briefcase,
      link: "/job-board",
      description: "Find job opportunities",
      locked: false,
      usage: hasAccessTo("private-jobs") ? "Full access" : "Public jobs only",
    },
    {
      title: "CV Assessment",
      icon: ClipboardCheck,
      link: "/cv-assessment",
      description: "Get expert feedback",
      locked: false,
      usage: "",
    },
    {
      title: "PDF Tools",
      icon: FileScanner,
      link: "/pdf-tools",
      description: "Manage PDF documents",
      locked: false,
      usage: "",
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

      {/* Analytics Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.resumesCreated}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.resumesCreated > 0 ? "+1 from last month" : "No change from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Applied</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.jobsApplied}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.jobsApplied > 5 ? "+3 from last week" : "+1 from last week"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.interviewsScheduled}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.interviewsScheduled > 0 ? "Next: Tomorrow" : "No upcoming interviews"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.lastActivity}</div>
            <p className="text-xs text-muted-foreground mt-2">Resume update</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your job application progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{analytics.applicationStatus.pending}</div>
              <div className="text-xs text-muted-foreground mt-1">Pending</div>
              <div className="w-full bg-muted rounded-full h-1 mt-2">
                <div
                  className="bg-blue-500 h-1 rounded-full"
                  style={{ width: `${(analytics.applicationStatus.pending / analytics.jobsApplied) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{analytics.applicationStatus.reviewed}</div>
              <div className="text-xs text-muted-foreground mt-1">Reviewed</div>
              <div className="w-full bg-muted rounded-full h-1 mt-2">
                <div
                  className="bg-yellow-500 h-1 rounded-full"
                  style={{ width: `${(analytics.applicationStatus.reviewed / analytics.jobsApplied) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{analytics.applicationStatus.interview}</div>
              <div className="text-xs text-muted-foreground mt-1">Interview</div>
              <div className="w-full bg-muted rounded-full h-1 mt-2">
                <div
                  className="bg-purple-500 h-1 rounded-full"
                  style={{ width: `${(analytics.applicationStatus.interview / analytics.jobsApplied) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{analytics.applicationStatus.rejected}</div>
              <div className="text-xs text-muted-foreground mt-1">Rejected</div>
              <div className="w-full bg-muted rounded-full h-1 mt-2">
                <div
                  className="bg-red-500 h-1 rounded-full"
                  style={{ width: `${(analytics.applicationStatus.rejected / analytics.jobsApplied) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">{analytics.applicationStatus.accepted}</div>
              <div className="text-xs text-muted-foreground mt-1">Accepted</div>
              <div className="w-full bg-muted rounded-full h-1 mt-2">
                <div
                  className="bg-green-500 h-1 rounded-full"
                  style={{ width: `${(analytics.applicationStatus.accepted / analytics.jobsApplied) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all-tools">All Tools</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredCards.map((card, index) => (
              <Link href={card.locked ? "/pricing" : card.link} key={index}>
                <Card className={`hover:bg-accent transition-colors cursor-pointer ${card.locked ? "opacity-70" : ""}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                      {card.locked && <Lock className="inline ml-1 h-3 w-3" />}
                    </CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.title}</div>
                    <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
                    {card.usage && <p className="text-xs mt-2 font-medium">{card.usage}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={profileCompletion} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Your profile is {profileCompletion}% complete.
                  {profileCompletion < 100 && " Complete your profile to increase your chances of landing a job."}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  CV Bora Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">{cvBoraScore}%</div>
                <Progress value={cvBoraScore} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Your CV Bora score is {cvBoraScore}%. This score reflects the quality of your CV based on best
                  practices.
                </p>
                <Button className="mt-4" variant="outline">
                  Improve Your Score
                </Button>
              </CardContent>
            </Card>
          </div>
          <PersonalizedRecommendations cvBoraScore={cvBoraScore} profileCompletion={profileCompletion} />
        </TabsContent>
        <TabsContent value="all-tools">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allCards.map((card, index) => (
              <Link href={card.locked ? "/pricing" : card.link} key={index}>
                <Card className={`hover:bg-accent transition-colors cursor-pointer ${card.locked ? "opacity-70" : ""}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                      {card.locked && <Lock className="inline ml-1 h-3 w-3" />}
                    </CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.title}</div>
                    <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
                    {card.usage && <p className="text-xs mt-2 font-medium">{card.usage}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="career">
          <div className="grid gap-4 md:grid-cols-2">
            <JobMatches />
            <CareerGoals />
          </div>
        </TabsContent>
      </Tabs>

      {/* Upcoming Interviews */}
      {analytics.upcomingInterviews.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Your scheduled interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.upcomingInterviews.map((interview, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{interview.company}</div>
                      <div className="text-sm text-muted-foreground">{interview.date}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Prepare
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Searches */}
      {analytics.recentSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Searches</CardTitle>
            <CardDescription>Your recent job searches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.recentSearches.map((search, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer">
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
