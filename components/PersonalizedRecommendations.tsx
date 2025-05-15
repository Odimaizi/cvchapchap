import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PersonalizedRecommendationsProps {
  cvBoraScore: number
  profileCompletion: number
}

export function PersonalizedRecommendations({ cvBoraScore, profileCompletion }: PersonalizedRecommendationsProps) {
  const recommendations = []

  if (cvBoraScore < 70) {
    recommendations.push({
      title: "Improve Your CV",
      description: "Your CV score is below average. Consider using our CV Assessment tool to get expert feedback.",
      action: "Go to CV Assessment",
      link: "/cv-assessment",
    })
  }

  if (profileCompletion < 100) {
    recommendations.push({
      title: "Complete Your Profile",
      description:
        "A complete profile increases your chances of finding the right job. Fill in any missing information.",
      action: "Update Profile",
      link: "/profile",
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Great Job!",
      description: "Your profile is complete and your CV score is high. Keep up the good work!",
      action: "Explore Job Opportunities",
      link: "/job-search",
    })
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{recommendation.title}</h3>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              </div>
              <Button variant="outline" asChild>
                <a href={recommendation.link}>{recommendation.action}</a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
