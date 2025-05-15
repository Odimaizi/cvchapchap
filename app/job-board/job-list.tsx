"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Briefcase, Clock, Building, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

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
  job_type?: string
  industry?: string
  experience_level?: string
}

interface JobListProps {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No jobs found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
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
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View Details</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>{job.title}</DialogTitle>
                  <DialogDescription>
                    {job.company} - {job.location}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex flex-wrap gap-4 text-sm">
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

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                    <p className="whitespace-pre-line">{job.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button variant="outline" asChild>
                      <Link href={`/job-board/${job.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" /> Full Details
                      </Link>
                    </Button>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button>Apply Now</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
