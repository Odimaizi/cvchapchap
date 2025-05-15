"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CVAssessmentForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [industry, setIndustry] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically call an API to submit the CV for assessment
    console.log("Submitting CV for assessment:", { name, email, industry, experienceLevel, cvFile, additionalInfo })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="experienceLevel">Experience Level</Label>
        <Select value={experienceLevel} onValueChange={setExperienceLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
            <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
            <SelectItem value="senior">Senior Level (6+ years)</SelectItem>
            <SelectItem value="executive">Executive Level</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cvFile">Upload Your CV</Label>
        <Input
          id="cvFile"
          type="file"
          onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
          accept=".pdf,.doc,.docx"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Any specific areas you'd like feedback on?"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full">
        Submit for Assessment
      </Button>
    </form>
  )
}
