"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

export function ResumePreview({ data, templateId, templates, onTemplateChange }) {
  const [html, setHtml] = useState("")
  const [activeView, setActiveView] = useState("preview")

  useEffect(() => {
    if (!templateId || !templates) return

    const selectedTemplate = templates.find((t) => t.id === templateId)
    if (!selectedTemplate) return

    let processedHtml = selectedTemplate.html_content

    // Replace placeholders with actual data
    processedHtml = processedHtml.replace(/{FULL_NAME}/g, data.personal.fullName || "Your Name")
    processedHtml = processedHtml.replace(/{EMAIL}/g, data.personal.email || "email@example.com")
    processedHtml = processedHtml.replace(/{PHONE}/g, data.personal.phone || "123-456-7890")
    processedHtml = processedHtml.replace(/{CITY}/g, data.personal.city || "City")
    processedHtml = processedHtml.replace(/{COUNTY}/g, data.personal.county || "County")
    processedHtml = processedHtml.replace(/{POSTCODE}/g, data.personal.postcode || "Postcode")
    processedHtml = processedHtml.replace(/{TAGLINE}/g, data.personal.tagline || "Professional Tagline")
    processedHtml = processedHtml.replace(
      /{PROFESSIONAL_SUMMARY}/g,
      data.personal.professionalSummary || "Professional summary goes here.",
    )

    // Process work experience
    let workExperienceHtml = ""
    if (data.workExperience && data.workExperience.length > 0) {
      data.workExperience.forEach((exp) => {
        workExperienceHtml += `
          <div class="experience-item">
            <div class="job-header">
              <div class="job-title">${exp.position || "Position"}</div>
              <div class="dates">${exp.startDate || "Start Date"} - ${exp.endDate || "Present"}</div>
            </div>
            <div class="employer">${exp.company || "Company"}</div>
            <div class="location">${exp.location || "Location"}</div>
            <div class="description">${exp.description || "Job description"}</div>
          </div>
        `
      })
    } else {
      workExperienceHtml = `
        <div class="experience-item">
          <div class="job-header">
            <div class="job-title">Position Title</div>
            <div class="dates">MM/YYYY - Present</div>
          </div>
          <div class="employer">Company Name</div>
          <div class="location">Location</div>
          <div class="description">Job description and responsibilities</div>
        </div>
      `
    }
    processedHtml = processedHtml.replace(/{WORK_EXPERIENCE}/g, workExperienceHtml)

    // Process education
    let educationHtml = ""
    if (data.education && data.education.length > 0) {
      data.education.forEach((edu) => {
        educationHtml += `
          <div class="education-item">
            <div class="education-header">
              <div class="institution">${edu.institution || "Institution"}</div>
              <div class="dates">${edu.graduationDate || "Graduation Date"}</div>
            </div>
            <div class="degree">${edu.degree || "Degree"}</div>
            <div class="location">${edu.location || "Location"}</div>
            <div class="description">${edu.description || ""}</div>
          </div>
        `
      })
    } else {
      educationHtml = `
        <div class="education-item">
          <div class="education-header">
            <div class="institution">University Name</div>
            <div class="dates">MM/YYYY</div>
          </div>
          <div class="degree">Degree</div>
          <div class="location">Location</div>
        </div>
      `
    }
    processedHtml = processedHtml.replace(/{EDUCATION}/g, educationHtml)

    // Process skills
    let skillsHtml = ""
    if (data.skills && data.skills.length > 0) {
      data.skills.forEach((skill) => {
        skillsHtml += `<div class="skill">${skill}</div>`
      })
    } else {
      skillsHtml = `
        <div class="skill">Skill 1</div>
        <div class="skill">Skill 2</div>
        <div class="skill">Skill 3</div>
      `
    }
    processedHtml = processedHtml.replace(/{SKILLS}/g, skillsHtml)

    // Process achievements
    let achievementsHtml = ""
    if (data.achievements && data.achievements.length > 0) {
      data.achievements.forEach((achievement) => {
        achievementsHtml += `<li>${achievement}</li>`
      })
    } else {
      achievementsHtml = `
        <li>Achievement 1</li>
        <li>Achievement 2</li>
      `
    }
    processedHtml = processedHtml.replace(/{ACHIEVEMENTS}/g, achievementsHtml)

    // Process references
    let referencesHtml = ""
    if (data.references && data.references.length > 0) {
      data.references.forEach((ref) => {
        referencesHtml += `
          <div class="reference-item">
            <div class="reference-name">${ref.name || "Reference Name"}</div>
            <div>${ref.position || "Position"}, ${ref.company || "Company"}</div>
            <div>Email: ${ref.email || "email@example.com"}</div>
            <div>Phone: ${ref.phone || "123-456-7890"}</div>
          </div>
        `
      })
    } else {
      referencesHtml = `
        <div class="reference-item">
          <div class="reference-name">Reference Name</div>
          <div>Position, Company</div>
          <div>Email: email@example.com</div>
          <div>Phone: 123-456-7890</div>
        </div>
      `
    }
    processedHtml = processedHtml.replace(/{REFERENCES}/g, referencesHtml)

    setHtml(processedHtml)
  }, [data, templateId, templates])

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Resume Preview</h2>
          <p className="text-sm text-muted-foreground">See how your resume will look to employers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Template</label>
        <select
          value={templateId}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {templates?.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} - {template.category}
            </option>
          ))}
        </select>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="flex-1">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">HTML</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="flex-1 h-[calc(100%-40px)]">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <iframe
                srcDoc={html}
                title="Resume Preview"
                className="w-full h-full border-0"
                style={{ minHeight: "800px" }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="code" className="flex-1 h-[calc(100%-40px)]">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              <pre className="overflow-auto h-full text-xs">{html}</pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
