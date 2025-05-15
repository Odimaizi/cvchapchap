"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const MOCK_JOBS = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovations Kenya",
    location: "Nairobi",
    description: "We are seeking a talented Software Engineer to join our growing team...",
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Brand Builders Ltd",
    location: "Mombasa",
    description: "Brand Builders Ltd is looking for an experienced Marketing Manager to lead our marketing efforts...",
  },
  {
    id: 3,
    title: "Financial Analyst",
    company: "Kenyan Investment Bank",
    location: "Nairobi",
    description: "Join our team of financial experts and help drive investment decisions...",
  },
]

export default function JobSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = () => {
    // In a real implementation, you'd call an API to perform the search
    // For this example, we'll filter the mock jobs
    const results = MOCK_JOBS.filter(
      (job) =>
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
        job.location.toLowerCase().includes(location.toLowerCase()),
    )
    setSearchResults(results)
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Job Search</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search for Jobs</CardTitle>
          <CardDescription>Enter keywords and location to find relevant job openings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="search-term">Keywords</Label>
              <Input
                id="search-term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job title, skills, or company"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or region"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        {searchResults.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>
                {job.company} - {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{job.description}</p>
              <Button className="mt-4">Apply Now</Button>
            </CardContent>
          </Card>
        ))}
        {searchResults.length === 0 && searchTerm && <p>No jobs found matching your search criteria.</p>}
      </div>
    </div>
  )
}
