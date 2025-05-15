"use client"

import { useState } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResumePaymentWall } from "@/components/ResumePaymentWall"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Download } from "lucide-react"

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional design with a modern touch",
    image: "/placeholder.svg?height=400&width=300",
    previewImage: "/placeholder.svg?height=800&width=600",
    category: "professional",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout that works for all industries",
    image: "/placeholder.svg?height=400&width=300",
    previewImage: "/placeholder.svg?height=800&width=600",
    category: "professional",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with a unique and eye-catching design",
    image: "/placeholder.svg?height=400&width=300",
    previewImage: "/placeholder.svg?height=800&width=600",
    category: "creative",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant design focusing on content",
    image: "/placeholder.svg?height=400&width=300",
    previewImage: "/placeholder.svg?height=800&width=600",
    category: "minimal",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior professionals",
    image: "/placeholder.svg?height=400&width=300",
    previewImage: "/placeholder.svg?height=800&width=600",
    category: "professional",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Modern design for tech professionals",
    image: "/placeholder.svg?height=400&width=300",
    previewImage: "/placeholder.svg?height=800&width=600",
    category: "creative",
  },
]

export default function TemplatesPage() {
  const { plan, canCreateResume, incrementResumeUsage } = useSubscription()
  const [showPaymentWall, setShowPaymentWall] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
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

  const filteredTemplates =
    activeCategory === "all" ? TEMPLATES : TEMPLATES.filter((template) => template.category === activeCategory)

  if (showPaymentWall) {
    return <ResumePaymentWall onPaymentComplete={handlePaymentComplete} />
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose a Resume Template</h1>
        <p className="text-lg text-muted-foreground">Select a template to get started with your professional resume</p>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
            All Templates
          </TabsTrigger>
          <TabsTrigger value="professional" onClick={() => setActiveCategory("professional")}>
            Professional
          </TabsTrigger>
          <TabsTrigger value="creative" onClick={() => setActiveCategory("creative")}>
            Creative
          </TabsTrigger>
          <TabsTrigger value="minimal" onClick={() => setActiveCategory("minimal")}>
            Minimal
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="aspect-[3/4] relative">
              <img
                src={template.image || "/placeholder.svg"}
                alt={template.name}
                className="object-cover w-full h-full"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="absolute top-2 right-2">
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[80vh]">
                  <div className="h-full overflow-auto p-4">
                    <img
                      src={template.previewImage || "/placeholder.svg"}
                      alt={`${template.name} Preview`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Sample
              </Button>
              <Button onClick={() => handleTemplateSelect(template.id)}>Use Template</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
