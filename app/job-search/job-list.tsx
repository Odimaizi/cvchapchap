import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const MOCK_JOBS = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovations Kenya",
    location: "Nairobi",
    salary: "KSh 100,000 - KSh 150,000 per month",
    description: "We are seeking a talented Software Engineer to join our growing team...",
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Brand Builders Ltd",
    location: "Mombasa",
    salary: "KSh 80,000 - KSh 120,000 per month",
    description: "Brand Builders Ltd is looking for an experienced Marketing Manager to lead our marketing efforts...",
  },
  {
    id: 3,
    title: "Financial Analyst",
    company: "Kenyan Investment Bank",
    location: "Nairobi",
    salary: "KSh 90,000 - KSh 130,000 per month",
    description: "Join our team of financial experts and help drive investment decisions...",
  },
]

export function JobList() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Latest Job Openings</h3>
      {MOCK_JOBS.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>
              {job.company} - {job.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{job.salary}</p>
            <p className="mt-2">{job.description}</p>
            <Button className="mt-4">Apply Now</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
