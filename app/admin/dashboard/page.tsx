"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  Briefcase,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Download,
  RefreshCw,
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalResumes: 0,
    totalJobs: 0,
  })

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      if (session.user.email !== "odimaoscar@gmail.com") {
        router.push("/dashboard")
        return
      }

      setUser(session.user)

      // Fetch mock stats
      setStats({
        totalUsers: 156,
        activeSubscriptions: 78,
        totalResumes: 423,
        totalJobs: 89,
      })

      setLoading(false)
    }

    checkAdmin()
  }, [router, supabase])

  if (loading) {
    return <div className="container mx-auto py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResumes}</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-8 w-[250px]" />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: 1,
                      name: "John Doe",
                      email: "john@example.com",
                      plan: "professional",
                      status: "active",
                      joined: "2023-01-15",
                    },
                    {
                      id: 2,
                      name: "Jane Smith",
                      email: "jane@example.com",
                      plan: "premium",
                      status: "active",
                      joined: "2023-02-20",
                    },
                    {
                      id: 3,
                      name: "Bob Johnson",
                      email: "bob@example.com",
                      plan: "free",
                      status: "inactive",
                      joined: "2023-03-10",
                    },
                    {
                      id: 4,
                      name: "Alice Brown",
                      email: "alice@example.com",
                      plan: "premium",
                      status: "active",
                      joined: "2023-04-05",
                    },
                    {
                      id: 5,
                      name: "Charlie Wilson",
                      email: "charlie@example.com",
                      plan: "free",
                      status: "active",
                      joined: "2023-05-12",
                    },
                  ].map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.plan === "professional" ? "default" : user.plan === "premium" ? "secondary" : "outline"
                          }
                        >
                          {user.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "success" : "destructive"}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: 1,
                      user: "John Doe",
                      plan: "professional",
                      startDate: "2023-01-15",
                      nextBilling: "2023-06-15",
                      amount: "KSh 2,500",
                      status: "active",
                    },
                    {
                      id: 2,
                      user: "Jane Smith",
                      plan: "premium",
                      startDate: "2023-02-20",
                      nextBilling: "2023-06-20",
                      amount: "KSh 1,500",
                      status: "active",
                    },
                    {
                      id: 3,
                      user: "Alice Brown",
                      plan: "premium",
                      startDate: "2023-04-05",
                      nextBilling: "2023-06-05",
                      amount: "KSh 1,500",
                      status: "active",
                    },
                    {
                      id: 4,
                      user: "David Lee",
                      plan: "professional",
                      startDate: "2023-03-22",
                      nextBilling: "2023-06-22",
                      amount: "KSh 2,500",
                      status: "active",
                    },
                    {
                      id: 5,
                      user: "Eva Garcia",
                      plan: "premium",
                      startDate: "2023-05-10",
                      nextBilling: "2023-06-10",
                      amount: "KSh 1,500",
                      status: "active",
                    },
                  ].map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>{subscription.user}</TableCell>
                      <TableCell>
                        <Badge variant={subscription.plan === "professional" ? "default" : "secondary"}>
                          {subscription.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(subscription.nextBilling).toLocaleDateString()}</TableCell>
                      <TableCell>{subscription.amount}</TableCell>
                      <TableCell>
                        <Badge variant="success">{subscription.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Resume Templates</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 1, name: "Modern", category: "professional", downloads: 156 },
                  { id: 2, name: "Classic", category: "professional", downloads: 124 },
                  { id: 3, name: "Creative", category: "creative", downloads: 98 },
                  { id: 4, name: "Minimal", category: "minimal", downloads: 87 },
                  { id: 5, name: "Executive", category: "professional", downloads: 76 },
                  { id: 6, name: "Tech", category: "creative", downloads: 65 },
                ].map((template) => (
                  <Card key={template.id}>
                    <div className="aspect-[3/4] relative">
                      <img
                        src={`/placeholder.svg?height=400&width=300&text=${template.name}`}
                        alt={template.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button variant="secondary" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.category}</p>
                        </div>
                        <Badge variant="outline">{template.downloads} downloads</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Job Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search jobs..." className="pl-8 w-[250px]" />
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Job
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: 1,
                      title: "Software Engineer",
                      company: "Tech Innovations Kenya",
                      location: "Nairobi",
                      type: "Full-time",
                      posted: "2023-05-10",
                      status: "active",
                    },
                    {
                      id: 2,
                      title: "Marketing Manager",
                      company: "Brand Builders Ltd",
                      location: "Mombasa",
                      type: "Full-time",
                      posted: "2023-05-12",
                      status: "active",
                    },
                    {
                      id: 3,
                      title: "Financial Analyst",
                      company: "Kenyan Investment Bank",
                      location: "Nairobi",
                      type: "Full-time",
                      posted: "2023-05-15",
                      status: "active",
                    },
                    {
                      id: 4,
                      title: "Product Manager",
                      company: "Innovation Hub",
                      location: "Nairobi",
                      type: "Full-time",
                      posted: "2023-05-16",
                      status: "active",
                    },
                    {
                      id: 5,
                      title: "UX Designer",
                      company: "Creative Solutions",
                      location: "Kisumu",
                      type: "Contract",
                      posted: "2023-05-18",
                      status: "active",
                    },
                  ].map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>{new Date(job.posted).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={job.status === "active" ? "success" : "destructive"}>{job.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>View performance metrics and user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Analytics charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
