"use client"

import { useState } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResumePaymentWall } from "@/components/ResumePaymentWall"
import { useRouter } from "next/navigation"

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional design with a modern touch",
    image: "/templates/modern.png",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout that works for all industries",
    image: "/templates/classic.png",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with a unique and eye-catching design",
    image: "/templates/creative.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design focusing on content",
    image: "/templates/minimal.png",
  },
]

export default function TemplatesPage() {
  const { plan, canCreateResume, incrementResumeUsage } = useSubscription()
  const [showPaymentWall, setShowPaymentWall] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const router = useRouter()

  const handleTemplateSelect = async (templateId: string) => {
    if (plan === "free") {
      // For free plan, show payment wall
      setSelectedTemplate(templateId)
      setShowPaymentWall(true)
      return
    }

    if (!canCreateResume()) {
      // User has reached their limit
      setSelectedTemplate(templateId)
      setShowPaymentWall(true)
      return
    }

    // User can create resume
    await incrementResumeUsage()
    router.push(`/resume/builder?template=${templateId}`)
  }

  const handlePaymentComplete = async () => {
    // Payment completed, proceed to resume builder
    await incrementResumeUsage()
    router.push(`/resume/builder?template=${selectedTemplate}`)
  }

  if (showPaymentWall) {
    return <ResumePaymentWall onPaymentComplete={handlePaymentComplete} />
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose a Resume Template</h1>
        <p className="text-lg text-muted-foreground">Select a template to get started with your professional resume</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="aspect-[3/4] relative">
              <img
                src={template.image || "/placeholder.svg?height=400&width=300"}
                alt={template.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => handleTemplateSelect(template.id)}>
                Use This Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
