"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { generateAIContent } from "@/app/actions/ai-actions"
import { useToast } from "@/components/ui/use-toast"

export function AIAssistant({ section, data, onUpdate, isLoading, setIsLoading }) {
  const [prompt, setPrompt] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const { toast } = useToast()

  const getSectionTitle = () => {
    switch (section) {
      case "personal":
        return "Personal Information"
      case "experience":
        return "Work Experience"
      case "education":
        return "Education"
      case "skills":
        return "Skills"
      case "achievements":
        return "Achievements"
      case "references":
        return "References"
      default:
        return "Content"
    }
  }

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt for the AI assistant.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setSuggestion("")

      const aiContent = await generateAIContent(section, prompt, data)
      setSuggestion(aiContent)
    } catch (error) {
      console.error("Error generating AI content:", error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySuggestion = () => {
    if (!suggestion) return

    const updatedData = { ...data }

    switch (section) {
      case "personal":
        updatedData.personal.professionalSummary = suggestion
        break
      case "experience":
        if (updatedData.workExperience.length > 0) {
          updatedData.workExperience[0].description = suggestion
        }
        break
      case "education":
        if (updatedData.education.length > 0) {
          updatedData.education[0].description = suggestion
        }
        break
      case "skills":
        // Split the suggestion into individual skills
        const skills = suggestion
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
        updatedData.skills = skills.slice(0, 10) // Limit to 10 skills
        break
      case "achievements":
        // Split the suggestion into individual achievements
        const achievements = suggestion
          .split("\n")
          .map((achievement) => achievement.trim())
          .filter(Boolean)
        updatedData.achievements = achievements.slice(0, 5) // Limit to 5 achievements
        break
      default:
        break
    }

    onUpdate(updatedData)
    setSuggestion("")
    toast({
      title: "Applied suggestion",
      description: `The AI suggestion has been applied to your ${getSectionTitle().toLowerCase()}.`,
    })
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={`Ask AI to help with your ${getSectionTitle().toLowerCase()}...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={handleGenerateContent} disabled={isLoading || !prompt.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Generate
        </Button>
      </div>

      {suggestion && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm whitespace-pre-wrap">{suggestion}</p>
            <Button size="sm" className="mt-2" onClick={handleApplySuggestion}>
              Apply Suggestion
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
