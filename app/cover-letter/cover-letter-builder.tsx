"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSubscription } from "@/contexts/subscription-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Download, Copy } from "lucide-react"
import { generateCoverLetter } from "../actions/generate-cover-letter"

export function CoverLetterBuilder() {
  const { incrementCoverLetterUsage } = useSubscription()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    jobDescription: "",
    relevantExperience: "",
    tone: "professional",
    emphasis: "",
  })
  const [generatedLetter, setGeneratedLetter] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tone: value }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Record usage
      await incrementCoverLetterUsage()

      // Generate cover letter using Gemini AI
      const letter = await generateCoverLetter(formData)
      setGeneratedLetter(letter)

      toast({
        title: "Cover letter generated",
        description: "Your cover letter has been created successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error generating cover letter",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter)
    toast({
      title: "Copied to clipboard",
      description: "Cover letter has been copied to your clipboard.",
    })
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedLetter], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "cover-letter.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <form className="space-y-6">
          <Accordion type="single" collapsible defaultValue="job">
            <AccordionItem value="job">
              <AccordionTrigger>Job Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                      placeholder="Paste the job description here"
                      rows={5}
                      required
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="personal">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger>Relevant Experience</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Label htmlFor="relevantExperience">Key Achievements & Experience</Label>
                  <Textarea
                    id="relevantExperience"
                    name="relevantExperience"
                    value={formData.relevantExperience}
                    onChange={handleInputChange}
                    placeholder="Describe your relevant experience and achievements"
                    rows={5}
                    required
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="customization">
              <AccordionTrigger>Customization</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Writing Tone</Label>
                    <Select value={formData.tone} onValueChange={handleToneChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="confident">Confident</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emphasis">Key Points to Emphasize</Label>
                    <Textarea
                      id="emphasis"
                      name="emphasis"
                      value={formData.emphasis}
                      onChange={handleInputChange}
                      placeholder="What specific points would you like to emphasize?"
                      rows={3}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button type="button" className="w-full" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate Cover Letter"
            )}
          </Button>
        </form>
      </div>

      <div>
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              {generatedLetter && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </div>
              )}
            </div>
            <div className="min-h-[500px] border rounded-md p-4 whitespace-pre-wrap font-serif">
              {generatedLetter ? (
                generatedLetter
              ) : (
                <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                  Your cover letter will appear here after generation
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
