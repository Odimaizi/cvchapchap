"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ProDashboard() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">CV Pro's Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create unlimited professional resumes with advanced AI assistance.</p>
            <Button asChild>
              <Link href="/resume-builder">Create Resume</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Write Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Generate unlimited compelling cover letters for your job applications.</p>
            <Button asChild>
              <Link href="/cover-letter">Write Cover Letter</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Job Search</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Access unlimited job search with advanced filters and recommendations.</p>
            <Button asChild>
              <Link href="/job-search">Search Jobs</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ATS Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Optimize your resume to pass Applicant Tracking Systems.</p>
            <Button asChild>
              <Link href="/ats-optimization">Optimize Resume</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CV Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Get expert feedback on your CV from professionals.</p>
            <Button asChild>
              <Link href="/cv-assessment">Get Assessment</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Priority Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Access priority support for any questions or issues.</p>
            <Button asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
