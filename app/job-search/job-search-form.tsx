"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function JobSearchForm() {
  const [keywords, setKeywords] = useState("")
  const [location, setLocation] = useState("")
  const [isRemote, setIsRemote] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically call an API to search for jobs
    console.log("Searching for jobs with:", { keywords, location, isRemote })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          placeholder="Job title, skills, or company"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City or County"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="remote" checked={isRemote} onCheckedChange={(checked) => setIsRemote(checked as boolean)} />
        <Label htmlFor="remote">Remote jobs only</Label>
      </div>
      <Button type="submit" className="w-full">
        Search Jobs
      </Button>
    </form>
  )
}
