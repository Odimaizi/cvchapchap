"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, DonutChart } from "@/components/ui/chart"
import { Users, Briefcase, FileText, Award, Calendar, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CorporateDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [companyData, setCompanyData] = useState(null)
  const [stats, setStats] = useState({
    activeJobs: 0,
    applications: 0,
    interviews: 0,
    hires: 0,
  })

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true)

        // Get current user
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        // Get company data
        const { data: company, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (companyError) {
          console.error("Error fetching company data:", companyError)
          // If company doesn't exist, create sample data
          setCompanyData({
            name: "Acme Corporation",
            industry: "Technology",
            size: "50-200",
            logo_url: "/placeholder.svg?height=100&width=100&text=ACME",
            description: "Leading provider of innovative solutions",
          })
        } else {
          setCompanyData(company)
        }

        // Get job stats
        const { data: jobs, error: jobsError } = await supabase
          .from("jobs")
          .select("id, is_active")
          .eq("company_id", company?.id || "sample")

        if (!jobsError && jobs) {
          const activeJobs = jobs.filter((job) => job.is_active).length

          // Get application stats
          const { data: applications, error: applicationsError } = await supabase
            .from("job_applications")
            .select("id, status, job_id")
            .in(
              "job_id",
              jobs.map((job) => job.id),
            )

          if (!applicationsError && applications) {
            const interviews = applications.filter((app) => app.status === "interview").length
            const hires = applications.filter((app) => app.status === "accepted").length

            setStats({
              activeJobs,
              applications: applications.length,
              interviews,
              hires,
            })
          }
        } else {
          // Sample data
          setStats({
            activeJobs: 5,
            applications: 42,
            interviews: 12,
            hires: 3,
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Sample data for charts
  const applicationsByJobData = [
    { name: "Software Engineer", value: 18 },
    { name: "Product Manager", value: 12 },
    { name: "UX Designer", value: 8 },
    { name: "Data Analyst", value: 6 },
    { name: "Marketing Specialist", value: 4 },
  ]

  const applicationsByTimeData = [
    { date: "Jan", applications: 8 },
    { date: "Feb", applications: 12 },
    { date: "Mar", applications: 15 },
    { date: "Apr", applications: 10 },
    { date: "May", applications: 18 },
    { date: "Jun", applications: 22 },
  ]

  const applicationsByStatusData = [
    { name: "Pending", value: 24 },
    { name: "Reviewed", value: 12 },
    { name: "Interview", value: 12 },
    { name: "Rejected", value: 8 },
    { name: "Accepted", value: 3 },
  ]

  const candidatesBySourceData = [
    { name: "Job Board", value: 45 },
    { name: "Company Website", value: 25 },
    { name: "Referral", value: 20 },
    { name: "Social Media", value: 10 },
  ]

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Corporate Dashboard</h1>
          <p className="text-muted-foreground">Manage your job postings, applications, and hiring process</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button onClick={() => router.push("/corporate/jobs/new")}>
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
              <p className="text-3xl font-bold">{stats.activeJobs}</p>
            </div>
            <Briefcase className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Applications</p>
              <p className="text-3xl font-bold">{stats.applications}</p>
            </div>
            <FileText className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Interviews</p>
              <p className="text-3xl font-bold">{stats.interviews}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hires</p>
              <p className="text-3xl font-bold">{stats.hires}</p>
            </div>
            <Award className="h-8 w-8 text-primary opacity-80" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications by Job</CardTitle>
                <CardDescription>Distribution of applications across job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={applicationsByJobData}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} applications`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>Trend of applications received</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={applicationsByTimeData}
                  index="date"
                  categories={["applications"]}
                  colors={["green"]}
                  valueFormatter={(value) => `${value} applications`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applications by Status</CardTitle>
                <CardDescription>Current status of all applications</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={applicationsByStatusData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value} applications`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest applications received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">Applicant {i}</p>
                        <p className="text-sm text-muted-foreground">Applied for: Software Engineer</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidates by Source</CardTitle>
                <CardDescription>Where candidates are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={candidatesBySourceData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value}%`}
                  className="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Candidates</CardTitle>
                <CardDescription>Highest rated applicants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Candidate {i}</p>
                          <p className="text-sm text-muted-foreground">Match Score: {95 - i * 5}%</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Corporate Features</CardTitle>
            <CardDescription>Tools to enhance your recruitment process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">CV ATS Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze resumes against your job descriptions to find the best matches.
                  </p>
                  <Button className="w-full" onClick={() => router.push("/corporate/ats-analysis")}>
                    Analyze CVs
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Preparation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create structured interviews and assessment criteria for candidates.
                  </p>
                  <Button className="w-full" onClick={() => router.push("/corporate/interview-prep")}>
                    Prepare Interviews
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Board Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your job postings and track application metrics.
                  </p>
                  <Button className="w-full" onClick={() => router.push("/corporate/jobs")}>
                    Manage Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
