"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ResumePreview({ template, data }) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    if (template && data) {
      let templateHtml = template.html || getDefaultTemplate()
      templateHtml = replaceVariables(templateHtml, data)
      setHtml(templateHtml)
    }
  }, [template, data])

  const replaceVariables = (html, data) => {
    return html
      .replace("{{name}}", data.personalInfo.name)
      .replace("{{email}}", data.personalInfo.email)
      .replace("{{phone}}", data.personalInfo.phone)
      .replace("{{location}}", data.personalInfo.location)
      .replace("{{experience}}", generateExperienceHtml(data.experience))
      .replace("{{education}}", generateEducationHtml(data.education))
      .replace("{{skills}}", data.skills.join(", "))
  }

  const generateExperienceHtml = (experience) => {
    return experience
      .map(
        (exp) => `
      <div class="experience-item">
        <h3>${exp.position} at ${exp.company}</h3>
        <p>${exp.startDate} - ${exp.endDate}</p>
        <p>${exp.description}</p>
      </div>
    `,
      )
      .join("")
  }

  const generateEducationHtml = (education) => {
    return education
      .map(
        (edu) => `
      <div class="education-item">
        <h3>${edu.degree}</h3>
        <p>${edu.institution}</p>
        <p>${edu.graduationDate}</p>
      </div>
    `,
      )
      .join("")
  }

  const getDefaultTemplate = () => {
    return `
      <div class="resume">
        <h1>{{name}}</h1>
        <p>{{email}} | {{phone}} | {{location}}</p>
        <h2>Experience</h2>
        {{experience}}
        <h2>Education</h2>
        {{education}}
        <h2>Skills</h2>
        <p>{{skills}}</p>
      </div>
    `
  }

  return (
    <Card>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <Button onClick={() => window.print()} className="mt-4">
          Print Resume
        </Button>
      </CardContent>
    </Card>
  )
}
