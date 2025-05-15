"use client"

import { useState, useEffect } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Lock, Filter } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { JobList } from "./job-list"

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
  job_type: string
  industry: string
  experience_level: string
}

// Sample job data
const SAMPLE_JOBS: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovations Kenya",
    location: "Nairobi",
    salary: "KSh 100,000 - 150,000",
    description:
      "We are seeking a talented Software Engineer to join our growing team. You will be responsible for developing and maintaining software applications, collaborating with cross-functional teams, and ensuring high-quality code standards.",
    requirements: ["3+ years of experience", "JavaScript", "React", "Node.js"],
    posted_date: "2023-05-10",
    is_public: true,
    job_type: "Full-time",
    industry: "Technology",
    experience_level: "Mid-level",
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Brand Builders Ltd",
    location: "Mombasa",
    salary: "KSh 80,000 - 120,000",
    description:
      "Brand Builders Ltd is looking for an experienced Marketing Manager to lead our marketing efforts. You will develop and implement marketing strategies, manage campaigns, and analyze market trends to drive business growth.",
    requirements: ["5+ years of experience", "Digital Marketing", "Campaign Management", "Analytics"],
    posted_date: "2023-05-12",
    is_public: true,
    job_type: "Full-time",
    industry: "Marketing",
    experience_level: "Senior",
  },
  {
    id: 3,
    title: "Financial Analyst",
    company: "Kenyan Investment Bank",
    location: "Nairobi",
    salary: "KSh 90,000 - 130,000",
    description:
      "Join our team of financial experts and help drive investment decisions. You will analyze financial data, prepare reports, and provide recommendations to support business strategy and growth.",
    requirements: ["Finance degree", "Excel", "Financial modeling", "Investment analysis"],
    posted_date: "2023-05-15",
    is_public: false,
    job_type: "Full-time",
    industry: "Finance",
    experience_level: "Mid-level",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Innovation Hub",
    location: "Nairobi",
    salary: "KSh 120,000 - 180,000",
    description:
      "Lead product development and strategy for our flagship products. You will work with cross-functional teams to define product vision, gather requirements, and drive product launches.",
    requirements: ["Product management experience", "Agile", "User research", "Roadmap planning"],
    posted_date: "2023-05-16",
    is_public: false,
    job_type: "Full-time",
    industry: "Technology",
    experience_level: "Senior",
  },
  {
    id: 5,
    title: "UX Designer",
    company: "Creative Solutions",
    location: "Kisumu",
    salary: "KSh 70,000 - 100,000",
    description:
      "Design intuitive and engaging user experiences for our clients. You will create wireframes, prototypes, and user flows to deliver exceptional digital products.",
    requirements: ["UI/UX experience", "Figma", "User testing", "Prototyping"],
    posted_date: "2023-05-18",
    is_public: true,
    job_type: "Contract",
    industry: "Design",
    experience_level: "Mid-level",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Data Insights Kenya",
    location: "Nairobi",
    salary: "KSh 110,000 - 160,000",
    description:
      "Analyze complex data sets to extract insights and drive business decisions. You will develop machine learning models, create data visualizations, and communicate findings to stakeholders.",
    requirements: ["Python", "Machine Learning", "Data Analysis", "Statistics"],
    posted_date: "2023-05-20",
    is_public: true,
    job_type: "Full-time",
    industry: "Technology",
    experience_level: "Senior",
  },
  {
    id: 7,
    title: "HR Manager",
    company: "Corporate Services Ltd",
    location: "Nairobi",
    salary: "KSh 85,000 - 120,000",
    description:
      "Oversee all aspects of human resources management including recruitment, employee relations, and policy development. You will ensure compliance with labor laws and foster a positive work environment.",
    requirements: ["HR certification", "Employee relations", "Recruitment", "Policy development"],
    posted_date: "2023-05-22",
    is_public: false,
    job_type: "Full-time",
    industry: "Human Resources",
    experience_level: "Senior",
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
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    jobType: "",
    industry: "",
    experienceLevel: "",
    salary: "",
    remote: false,
  })
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

    // Apply additional filters
    if (filters.jobType) {
      results = results.filter((job) => job.job_type === filters.jobType)
    }

    if (filters.industry) {
      results = results.filter((job) => job.industry === filters.industry)
    }

    if (filters.experienceLevel) {
      results = results.filter((job) => job.experience_level === filters.experienceLevel)
    }

    if (filters.remote) {
      results = results.filter((job) => job.location.toLowerCase().includes("remote"))
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

    if (searchTerm || location || Object.values(filters).some(Boolean)) {
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

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    handleSearch()
  }, [filters])

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
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                Search Jobs
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Toggle filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select value={filters.jobType} onValueChange={(value) => handleFilterChange("jobType", value)}>
                  <SelectTrigger id="jobType">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={filters.industry} onValueChange={(value) => handleFilterChange("industry", value)}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="All industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All industries</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={filters.experienceLevel}
                  onValueChange={(value) => handleFilterChange("experienceLevel", value)}
                >
                  <SelectTrigger id="experienceLevel">
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="remote"
                  checked={filters.remote}
                  onCheckedChange={(checked) => handleFilterChange("remote", checked)}
                />
                <Label htmlFor="remote">Remote jobs only</Label>
              </div>
            </div>
          )}
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

      <JobList jobs={filteredJobs} />
    </div>
  )
}
