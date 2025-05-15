"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Clock, MapPin, Building, Calendar, ArrowLeft, Share2, Bookmark, BookmarkCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Sample job data (same as in job-board-client.tsx)
const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovations Kenya",
    location: "Nairobi",
    salary: "KSh 100,000 - 150,000",
    description:
      "We are seeking a talented Software Engineer to join our growing team. You will be responsible for developing and maintaining software applications, collaborating with cross-functional teams, and ensuring high-quality code standards.\n\nResponsibilities:\n• Design, develop, and maintain software applications\n• Write clean, efficient, and well-documented code\n• Collaborate with cross-functional teams to define and implement new features\n• Troubleshoot and debug applications\n• Participate in code reviews and contribute to team knowledge sharing\n• Stay up-to-date with emerging trends and technologies",
    requirements: [
      "3+ years of experience",
      "JavaScript",
      "React",
      "Node.js",
      "Bachelor's degree in Computer Science or related field",
      "Strong problem-solving skills",
      "Excellent communication skills",
    ],
    posted_date: "2023-05-10",
    is_public: true,
    job_type: "Full-time",
    industry: "Technology",
    experience_level: "Mid-level",
    company_description:
      "Tech Innovations Kenya is a leading technology company specializing in innovative software solutions for businesses across East Africa. We are committed to creating cutting-edge products that solve real-world problems.",
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Flexible working hours",
      "Professional development opportunities",
      "Modern office in Nairobi CBD",
    ],
    application_process:
      "Submit your resume and cover letter through our online portal. Shortlisted candidates will be invited for a technical assessment followed by interviews with the team.",
  },
  // ... other jobs
]

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    // In a real app, this would fetch from your database
    const jobId = Number(params.id)
    const foundJob = SAMPLE_JOBS.find((j) => j.id === jobId)

    if (foundJob) {
      setJob(foundJob)
    } else {
      router.push("/job-board")
    }

    setLoading(false)
  }, [params.id, router])

  const handleSaveJob = () => {
    setSaved(!saved)
    toast({
      title: saved ? "Job removed from saved jobs" : "Job saved successfully",
      description: saved
        ? "The job has been removed from your saved jobs."
        : "You can view your saved jobs in your dashboard.",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this job with others.",
    })
  }

  const handleApply = () => {
    // In a real app, this would open an application form or redirect to an application page
    toast({
      title: "Application started",
      description: "You are now applying for this job.",
    })
  }

  if (loading) {
    return <div className="container mx-auto py-12">Loading...</div>
  }

  if (!job) {
    return <div className="container mx-auto py-12">Job not found</div>
  }

  return (
    <div className="container mx-auto py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <CardDescription className="text-lg">
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
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Briefcase className="mr-1 h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
                </div>
                {job.job_type && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{job.job_type}</span>
                  </div>
                )}
                {job.industry && (
                  <div className="flex items-center">
                    <Building className="mr-1 h-4 w-4" />
                    <span>{job.industry}</span>
                  </div>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                  <TabsTrigger value="application">How to Apply</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                    <p className="whitespace-pre-line">{job.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.requirements.map((req: string, index: number) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {job.benefits && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {job.benefits.map((benefit: string, index: number) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="company" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About {job.company}</h3>
                    <p>{job.company_description || "No company description available."}</p>
                  </div>
                </TabsContent>
                <TabsContent value="application" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Application Process</h3>
                    <p>{job.application_process || "Please click the Apply Now button to start your application."}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveJob}>
                  {saved ? (
                    <>
                      <BookmarkCheck className="mr-2 h-4 w-4" /> Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" /> Save
                    </>
                  )}
                </Button>
              </div>
              <Button onClick={handleApply}>Apply Now</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SAMPLE_JOBS.filter((j) => j.id !== job.id && j.industry === job.industry)
                  .slice(0, 3)
                  .map((similarJob) => (
                    <div key={similarJob.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium">{similarJob.title}</h3>
                      <p className="text-sm text-muted-foreground">{similarJob.company}</p>
                      <div className="flex items-center text-sm mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{similarJob.location}</span>
                      </div>
                      <Button variant="link" className="p-0 h-auto mt-1" asChild>
                        <a href={`/job-board/${similarJob.id}`}>View Job</a>
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Get notified when similar jobs are posted</p>
              <Button className="w-full mt-4">Create Job Alert</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
