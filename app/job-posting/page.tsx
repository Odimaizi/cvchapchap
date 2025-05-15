import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobPostingForm } from "./job-posting-form"

export default function JobPostingPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Post a Job</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Create a New Job Listing</CardTitle>
            <CardDescription>Reach thousands of qualified candidates across Kenya</CardDescription>
          </CardHeader>
          <CardContent>
            <JobPostingForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Why Post with Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Reach a wide pool of Kenyan talent</li>
              <li>AI-powered candidate matching</li>
              <li>Easy-to-use dashboard for managing applications</li>
              <li>Competitive pricing plans</li>
              <li>Dedicated support team</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Basic Listing: KSh 5,000 for 30 days</li>
              <li>Featured Listing: KSh 10,000 for 30 days</li>
              <li>Premium Package: KSh 25,000 for 60 days + social media promotion</li>
              <li>Custom packages available for bulk postings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
