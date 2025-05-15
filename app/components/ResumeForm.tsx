"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateResume } from "../actions/generate-resume"
import { DocumentPreview } from "./DocumentPreview"
import { LoadingState } from "./LoadingState"

export default function ResumeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setResult(null)

    const formData = new FormData(event.currentTarget)
    const response = await generateResume(formData)

    setResult(response)
    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience">Work Experience</Label>
        <Textarea id="experience" name="experience" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Textarea id="education" name="education" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Textarea id="skills" name="skills" required />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Resume & Cover Letter"}
      </Button>
      {isLoading ? (
        <div className="mt-8">
          <LoadingState />
        </div>
      ) : result ? (
        <div className="mt-8">
          <DocumentPreview content={result} />
        </div>
      ) : null}
    </form>
  )
}
