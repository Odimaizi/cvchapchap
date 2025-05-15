"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function FreeDashboard() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Free Plan Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create your professional resume with our AI-powered tool.</p>
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
            <p className="mb-4">Generate a compelling cover letter for your job application.</p>
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
            <p className="mb-4">Search for job opportunities (limited for free plan).</p>
            <Button asChild>
              <Link href="/job-search">Search Jobs</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Get unlimited access to all features and premium templates.</p>
            <Button asChild>
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
