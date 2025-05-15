"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateAIContent } from "@/app/actions/ai-actions"

export function AIAssistant({ data, onUpdate }) {
  const [section, setSection] = useState("experience")
  const [prompt, setPrompt] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateContent = async () => {
    setIsLoading(true)
    try {
      const content = await generateAIContent(section, prompt, data)
      setAiResponse(content)
    } catch (error) {
      console.error("Error generating AI content:", error)
      setAiResponse("An error occurred while generating content. Please try again.")
    }
    setIsLoading(false)
  }

  const handleApplyContent = () => {
    if (section === "experience") {
      onUpdate({
        ...data,
        experience: [
          ...data.experience,
          {
            company: "AI Generated",
            position: "AI Generated Position",
            startDate: "",
            endDate: "",
            description: aiResponse,
          },
        ],
      })
    } else if (section === "education") {
      onUpdate({
        ...data,
        education: [
          ...data.education,
          {
            institution: "AI Generated",
            degree: "AI Generated Degree",
            graduationDate: "",
            description: aiResponse,
          },
        ],
      })
    } else if (section === "skills") {
      onUpdate({
        ...data,
        skills: [...data.skills, ...aiResponse.split(",").map((skill) => skill.trim())],
      })
    }
    setAiResponse("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700">
              Select Section
            </label>
            <select
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="experience">Experience</option>
              <option value="education">Education</option>
              <option value="skills">Skills</option>
            </select>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Prompt
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt for the AI assistant"
              rows={3}
            />
          </div>
          <Button onClick={handleGenerateContent} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Content"}
          </Button>
          {aiResponse && (
            <div>
              <h3 className="text-lg font-medium text-gray-900">AI Generated Content:</h3>
              <p className="mt-1 text-sm text-gray-600">{aiResponse}</p>
              <Button onClick={handleApplyContent} className="mt-2">
                Apply to Resume
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
