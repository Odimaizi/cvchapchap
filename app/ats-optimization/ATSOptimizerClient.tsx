"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ATSOptimizer() {
  const [resume, setResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [optimizedResume, setOptimizedResume] = useState("")
  const [score, setScore] = useState(null)

  const handleOptimize = async () => {
    // In a real implementation, you'd call an API to perform the optimization
    // For this example, we'll simulate the optimization process
    const simulatedScore = Math.floor(Math.random() * 41) + 60 // Random score between 60 and 100
    setScore(simulatedScore)

    const keywords = jobDescription.toLowerCase().split(" ")
    const optimized = resume
      .split("\n")
      .map((line) => {
        const lowercaseLine = line.toLowerCase()
        if (keywords.some((keyword) => lowercaseLine.includes(keyword))) {
          return line.toUpperCase()
        }
        return line
      })
      .join("\n")

    setOptimizedResume(optimized)
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">ATS Optimization</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Resume</CardTitle>
            <CardDescription>Paste your current resume here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={10}
              placeholder="Paste your resume here..."
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Paste the job description here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              placeholder="Paste the job description here..."
            />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-center">
        <Button onClick={handleOptimize} size="lg">
          Optimize for ATS
        </Button>
      </div>
      {optimizedResume && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Optimized Resume</CardTitle>
            <CardDescription>ATS Compatibility Score: {score}%</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={optimizedResume} readOnly rows={10} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
