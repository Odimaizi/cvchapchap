"use client"

import { useState, useEffect } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Briefcase, MapPin, Clock, Lock } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  description: string
  requirements: string[]
  posted_date: string
  is_public: boolean
}

// Sample job data
const SAMPLE_JOBS: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovations Kenya",
    location: "Nairobi",
    salary: "KSh 100,000 - 150,000",
    description: "We are seeking a talented Software Engineer to join our growing team...",
    requirements: ["3+ years of experience", "JavaScript", "React", "Node.js"],
    posted_date: "2023-05-10",
    is_public: true,
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Brand Builders Ltd",
    location: "Mombasa",
    salary: "KSh 80,000 - 120,000",
    description: "Brand Builders Ltd is looking for an experienced Marketing Manager to lead our marketing efforts...",
    requirements: ["5+ years of experience", "Digital Marketing", "Campaign Management", "Analytics"],
    posted_date: "2023-05-12",
    is_public: true,
  },
  {
    id: 3,
    title: "Financial Analyst",
    company: "Kenyan Investment Bank",
    location: "Nairobi",
    salary: "KSh 90,000 - 130,000",
    description: "Join our team of financial experts and help drive investment decisions...",
    requirements: ["Finance degree", "Excel", "Financial modeling", "Investment analysis"],
    posted_date: "2023-05-15",
    is_public: false,
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Innovation Hub",
    location: "Nairobi",
    salary: "KSh 120,000 - 180,000",
    description: "Lead product development and strategy for our flagship products...",
    requirements: ["Product management experience", "Agile", "User research", "Roadmap planning"],
    posted_date: "2023-05-16",
    is_public: false,
  },
  {
    id: 5,
    title: "UX Designer",
    company: "Creative Solutions",
    location: "Kisumu",
    salary: "KSh 70,000 - 100,000",
    description: "Design intuitive and engaging user experiences for our clients...",
    requirements: ["UI/UX experience", "Figma", "User testing", "Prototyping"],
    posted_date: "2023-05-18",
    is_public: true,
  },
]

export function JobBoardClient() {
  const { hasAccessTo } = useSubscription()
  const supabase = createClientComponentClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const hasAccessToPrivateJobs = hasAccessTo("private-jobs")

  useEffect(() => {
    // In a real app, this would fetch from your database
    // For now, we'll use the sample data
    const fetchJobs = async () => {
      // Filter jobs based on subscription
      let availableJobs = SAMPLE_JOBS
      if (!hasAccessToPrivateJobs) {
        availableJobs = SAMPLE_JOBS.filter((job) => job.is_public)
      }
      setJobs(availableJobs)
      setFilteredJobs(availableJobs)
    }

    fetchJobs()
  }, [hasAccessToPrivateJobs])

  const handleSearch = () => {
    let results = jobs

    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.requirements.some((req) => req.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (location) {
      results = results.filter((job) => job.location.toLowerCase().includes(location.toLowerCase()))
    }

    setFilteredJobs(results)
  }

  const filterByTab = (tab: string) => {
    setActiveTab(tab)

    if (tab === "all") {
      handleSearch()
      return
    }

    // Filter by recency
    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = 7 * oneDay

    let results = jobs

    if (searchTerm || location) {
      results = filteredJobs
    }

    if (tab === "recent") {
      results = results.filter((job) => {
        const postedDate = new Date(job.posted_date)
        return now.getTime() - postedDate.getTime() <= oneWeek
      })
    }

    setFilteredJobs(results)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Next Opportunity</CardTitle>
          <CardDescription>Search for jobs by keyword, title, or company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Keywords</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Job title, skills, or company"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="City or region"
                  className="pl-8"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                Search Jobs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={filterByTab}>
          <TabsList>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="recent">Recent (7 days)</TabsTrigger>
          </TabsList>
        </Tabs>

        {!hasAccessToPrivateJobs && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Lock className="mr-1 h-4 w-4" />
            <span>Upgrade to see private job listings</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      {job.company} - {job.location}
                    </CardDescription>
                  </div>
                  {!job.is_public && (
                    <Badge variant="secondary" className="ml-2">
                      Premium
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="mr-1 h-4 w-4" />
                    <span>{job.salary}</span>
                    <Clock className="ml-4 mr-1 h-4 w-4" />
                    <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                  </div>

                  <p className="line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="outline">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/job-board/${job.id}`}>View Details</Link>
                </Button>
                <Button>Apply Now</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
