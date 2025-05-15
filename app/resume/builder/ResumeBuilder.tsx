"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateSelector } from "./TemplateSelector"
import { ResumeForm } from "./ResumeForm"
import { ResumePreview } from "./ResumePreview"
import { AIAssistant } from "./AIAssistant"
import { useToast } from "@/components/ui/use-toast"
import { ResumePaymentWall } from "@/components/ResumePaymentWall"
import { useSubscription } from "@/contexts/subscription-context"

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [resumeData, setResumeData] = useState({
    personalInfo: { name: "", email: "", phone: "", location: "" },
    experience: [],
    education: [],
    skills: [],
  })
  const [activeTab, setActiveTab] = useState("template")
  const [showPaymentWall, setShowPaymentWall] = useState(false)
  const { toast } = useToast()
  const { plan, usage } = useSubscription()

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    toast({
      title: "Template Selected",
      description: `You've chosen the ${template.name} template.`,
    })
  }

  const handleResumeDataChange = (newData) => {
    setResumeData(newData)
  }

  const handleExportClick = () => {
    // Check if user needs to pay
    if (plan === "free" || (plan === "premium" && usage.resumesUsed >= usage.resumesLimit)) {
      setShowPaymentWall(true)
    } else {
      // Process export directly
      handleExport()
    }
  }

  const handleExport = () => {
    console.log("Exporting resume...")
    toast({
      title: "Resume Exported",
      description: "Your resume has been exported successfully.",
    })
    // Actual export logic would go here
  }

  const handlePaymentComplete = () => {
    setShowPaymentWall(false)
    handleExport()
  }

  if (showPaymentWall) {
    return <ResumePaymentWall onPaymentComplete={handlePaymentComplete} />
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Resume Builder</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="template">Choose Template</TabsTrigger>
          <TabsTrigger value="content">Add Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>
        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Select a Template</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateSelector onSelect={handleTemplateSelect} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <ResumeForm data={resumeData} onChange={handleResumeDataChange} />
        </TabsContent>
        <TabsContent value="preview">
          <ResumePreview template={selectedTemplate} data={resumeData} />
        </TabsContent>
        <TabsContent value="ai-assistant">
          <AIAssistant data={resumeData} onUpdate={handleResumeDataChange} />
        </TabsContent>
      </Tabs>
      <div className="mt-8 text-center">
        <Button size="lg" onClick={handleExportClick}>
          Export Resume
        </Button>
      </div>
    </div>
  )
}
