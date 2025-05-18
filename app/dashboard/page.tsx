import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  FileText,
  FileCheck,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileEdit,
  FileSearch,
  MessageSquare,
} from "lucide-react"

async function getUserData(supabase, userId) {
  // Get user's resumes
  const { data: resumes, error: resumesError } = await supabase.from("resumes").select("*").eq("user_id", userId)

  if (resumesError) {
    console.error("Error fetching resumes:", resumesError)
  }

  // Get user's job applications
  const { data: applications, error: applicationsError } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", userId)

  if (applicationsError) {
    console.error("Error fetching applications:", applicationsError)
  }

  // Get user's cover letters
  const { data: coverLetters, error: coverLettersError } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("user_id", userId)

  if (coverLettersError) {
    console.error("Error fetching cover letters:", coverLettersError)
  }

  // Get user's activity
  const { data: activity, error: activityError } = await supabase
    .from("user_activity")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  if (activityError) {
    console.error("Error fetching user activity:", activityError)
  }

  // Get user's subscription
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (subscriptionError && subscriptionError.code !== "PGRST116") {
    console.error("Error fetching subscription:", subscriptionError)
  }

  return {
    resumes: resumes || [],
    applications: applications || [],
    coverLetters: coverLetters || [],
    activity: activity || [],
    subscription: subscription || null,
  }
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login?redirect=/dashboard")
  }

  const userData = await getUserData(supabase, session.user.id)

  // Calculate statistics
  const totalResumes = userData.resumes.length
  const totalApplications = userData.applications.length
  const totalCoverLetters = userData.coverLetters.length

  // Create activity data for chart
  const activityByDate = {}
  const now = new Date()

  // Initialize the last 7 days with 0 counts
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    activityByDate[dateStr] = 0
  }

  // Count activities by date
  userData.activity.forEach((item) => {
    const dateStr = new Date(item.created_at).toISOString().split("T")[0]
    if (activityByDate[dateStr] !== undefined) {
      activityByDate[dateStr]++
    }
  })

  // Convert to chart data format
  const activityChartData = Object.entries(activityByDate).map(([date, count]) => ({
    date: date.split("-").slice(1).join("/"), // Format as MM/DD
    activities: count,
  }))

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back, {session.user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalResumes}</div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/resume/builder" passHref>
              <Button variant="ghost" size="sm" className="w-full">
                Create Resume
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalApplications}</div>
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/job-board" passHref>
              <Button variant="ghost" size="sm" className="w-full">
                Browse Jobs
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalCoverLetters}</div>
              <FileCheck className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/cover-letter" passHref>
              <Button variant="ghost" size="sm" className="w-full">
                Create Cover Letter
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{userData.subscription?.plan_type || "Free"}</div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/pricing" passHref>
              <Button variant="ghost" size="sm" className="w-full">
                Upgrade Plan
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Your activity over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                activities: {
                  label: "Activities",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="activities" fill="var(--color-activities)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/resume/builder" passHref>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileEdit className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </Link>
            <Link href="/ats-optimization" passHref>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileSearch className="h-4 w-4 mr-2" />
                ATS Optimization
              </Button>
            </Link>
            <Link href="/cover-letter" passHref>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Cover Letter
              </Button>
            </Link>
            <Link href="/interview-prep" passHref>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Interview Preparation
              </Button>
            </Link>
            <Link href="/job-board" passHref>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Search
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {userData.activity.length > 0 ? (
              <div className="space-y-4">
                {userData.activity.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="rounded-full bg-muted p-2">
                      {item.activity_type === "resume_created" && <FileText className="h-4 w-4" />}
                      {item.activity_type === "application_submitted" && <CheckCircle2 className="h-4 w-4" />}
                      {item.activity_type === "cover_letter_created" && <FileCheck className="h-4 w-4" />}
                      {item.activity_type === "login" && <Users className="h-4 w-4" />}
                      {!["resume_created", "application_submitted", "cover_letter_created", "login"].includes(
                        item.activity_type,
                      ) && <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {item.activity_type === "resume_created" && "Resume Created"}
                        {item.activity_type === "application_submitted" && "Job Application Submitted"}
                        {item.activity_type === "cover_letter_created" && "Cover Letter Created"}
                        {item.activity_type === "login" && "Logged In"}
                        {!["resume_created", "application_submitted", "cover_letter_created", "login"].includes(
                          item.activity_type,
                        ) &&
                          item.activity_type
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Tracker</CardTitle>
            <CardDescription>Track your job search progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Resumes Created</span>
                </div>
                <span className="font-medium">{totalResumes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cover Letters Created</span>
                </div>
                <span className="font-medium">{totalCoverLetters}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Jobs Applied</span>
                </div>
                <span className="font-medium">{totalApplications}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Application Success Rate</span>
                </div>
                <span className="font-medium">
                  {totalApplications > 0
                    ? `${Math.round((userData.applications.filter((a) => a.status === "interview").length / totalApplications) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
