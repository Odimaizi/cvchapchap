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

export default function ResumeBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [resumeData, setResumeData] = useState({
    personalInfo: { name: "", email: "", phone: "", location: "" },
    experience: [],
    education: [],
    skills: [],
  })
  const { toast } = useToast()

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

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Resume Builder</h1>
      <Tabs defaultValue="template">
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
        <Button size="lg" onClick={() => console.log("Exporting resume...")}>
          Export Resume
        </Button>
      </div>
    </div>
  )
}
