import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function JobMatches() {
  // This is a placeholder. In a real implementation, you would fetch job matches from your API.
  const jobMatches = [
    { title: "Software Engineer", company: "Tech Co", match: 95 },
    { title: "Product Manager", company: "Startup Inc", match: 88 },
    { title: "Data Analyst", company: "Big Data Corp", match: 82 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobMatches.map((job, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{job.match}% Match</p>
                <Button variant="outline" size="sm">
                  View Job
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
