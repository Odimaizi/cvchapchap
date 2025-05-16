"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function NewJobPosting() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [jobData, setJobData] = useState({
    title: "",
    company_name: "",
    location: "",
    job_type: "full-time",
    salary_range: "",
    description: "",
    requirements: "",
    is_active: true,
    is_premium: false,
    application_url: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setJobData({
      ...jobData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setJobData({
      ...jobData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name, checked) => {
    setJobData({
      ...jobData,
      [name]: checked,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to post a job.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      // Get company data
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", session.user.id)
        .single()

      if (companyError) {
        // Create company if it doesn't exist
        const { data: newCompany, error: newCompanyError } = await supabase
          .from("companies")
          .insert({
            user_id: session.user.id,
            name: jobData.company_name,
            industry: "Technology", // Default
            size: "1-50", // Default
          })
          .select()

        if (newCompanyError) {
          throw newCompanyError
        }

        // Create job posting
        const { error: jobError } = await supabase.from("jobs").insert({
          company_id: newCompany[0].id,
          ...jobData,
        })

        if (jobError) {
          throw jobError
        }
      } else {
        // Create job posting with existing company
        const { error: jobError } = await supabase.from("jobs").insert({
          company_id: company.id,
          ...jobData,
        })

        if (jobError) {
          throw jobError
        }
      }

      toast({
        title: "Job Posted",
        description: "Your job has been posted successfully.",
      })

      router.push("/corporate/jobs")
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Fill in the details of the job you want to post</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" value={jobData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={jobData.company_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  required
                  placeholder="City, Country or Remote"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type">Job Type</Label>
                <Select value={jobData.job_type} onValueChange={(value) => handleSelectChange("job_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range">Salary Range (Optional)</Label>
              <Input
                id="salary_range"
                name="salary_range"
                value={jobData.salary_range}
                onChange={handleChange}
                placeholder="e.g. $50,000 - $70,000 per year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                required
                rows={6}
                placeholder="List the skills, qualifications, and experience required for this position"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_url">Application URL (Optional)</Label>
              <Input
                id="application_url"
                name="application_url"
                value={jobData.application_url}
                onChange={handleChange}
                placeholder="External application link (leave empty to use our system)"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={jobData.is_active}
                  onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Publish immediately</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_premium"
                  checked={jobData.is_premium}
                  onCheckedChange={(checked) => handleSwitchChange("is_premium", checked)}
                />
                <Label htmlFor="is_premium">Feature as premium job</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
