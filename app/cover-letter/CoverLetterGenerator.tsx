"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CoverLetterGenerator() {
  const [coverLetterData, setCoverLetterData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    letter: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCoverLetterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    // In a real implementation, you'd call an API to generate the cover letter
    // For this example, we'll simulate the generation
    const generatedLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${coverLetterData.position} position at ${coverLetterData.company}. With my skills and experience, I believe I would be a valuable asset to your team.

[AI-generated content based on the job description and user's experience would go here]

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to ${coverLetterData.company}'s success.

Sincerely,
${coverLetterData.name}`

    setCoverLetterData((prev) => ({ ...prev, letter: generatedLetter }))
  }

  return (
    <div className="container mx-auto py-12 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/2">
        <h1 className="text-3xl font-bold mb-8">Cover Letter Generator</h1>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={coverLetterData.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={coverLetterData.email} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={coverLetterData.phone} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" name="company" value={coverLetterData.company} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" name="position" value={coverLetterData.position} onChange={handleInputChange} />
          </div>
          <Button type="button" onClick={handleGenerate}>
            Generate Cover Letter
          </Button>
        </form>
      </div>
      <div className="w-full lg:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="letter"
              name="letter"
              value={coverLetterData.letter}
              onChange={handleInputChange}
              rows={20}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
