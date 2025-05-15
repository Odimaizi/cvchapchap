import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CVAssessmentForm } from "./cv-assessment-form"

export default function CVAssessmentPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">CV Assessment</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Get Expert Feedback on Your CV</CardTitle>
            <CardDescription>Have your CV reviewed by experienced Kenyan professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <CVAssessmentForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Why Get a CV Assessment?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Receive personalized feedback from Kenyan industry experts</li>
              <li>Identify areas for improvement in your CV</li>
              <li>Learn how to highlight your skills and achievements effectively</li>
              <li>Increase your chances of landing interviews</li>
              <li>Get insights on industry-specific CV requirements in Kenya</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Expert Reviewers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Our CV assessments are conducted by a team of experienced professionals, including:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>HR managers from top Kenyan companies</li>
              <li>Career coaches with expertise in the Kenyan job market</li>
              <li>Industry specialists across various sectors</li>
              <li>Recruitment consultants with years of experience</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
