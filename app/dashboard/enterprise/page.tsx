"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function EnterpriseDashboard() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Enterprise Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Resume Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create and manage resumes for your organization.</p>
            <Button asChild>
              <Link href="/enterprise/resumes">Manage Resumes</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Post and manage job openings for your company.</p>
            <Button asChild>
              <Link href="/enterprise/job-postings">Manage Jobs</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Applicant Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Track and manage applicants for your job postings.</p>
            <Button asChild>
              <Link href="/enterprise/applicants">Track Applicants</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ATS Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Optimize and score resumes using our ATS system.</p>
            <Button asChild>
              <Link href="/enterprise/ats">ATS Tools</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Access advanced analytics and reporting for your hiring process.</p>
            <Button asChild>
              <Link href="/enterprise/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Integrate our services with your existing systems using our API.</p>
            <Button asChild>
              <Link href="/enterprise/api">API Documentation</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
