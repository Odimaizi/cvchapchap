"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ATSOptimizer() {
  const [resume, setResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [optimizedResume, setOptimizedResume] = useState("")

  const handleOptimize = async () => {
    // Here you would typically call your AI service to optimize the resume
    // For now, we'll just simulate the optimization
    setOptimizedResume(`Optimized version of your resume:

${resume}

Optimized for the following job description:

${jobDescription}

[AI-generated optimizations would appear here]`)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resume">Your Resume</Label>
        <Textarea
          id="resume"
          placeholder="Paste your current resume here"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={10}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the job description here"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={5}
        />
      </div>
      <Button onClick={handleOptimize} className="w-full">
        Optimize for ATS
      </Button>
      {optimizedResume && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="optimizedResume">Optimized Resume</Label>
          <Textarea id="optimizedResume" value={optimizedResume} readOnly rows={10} />
        </div>
      )}
    </div>
  )
}
