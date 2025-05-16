"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

export function ResumePreview({ template, data }) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    if (template && data) {
      try {
        // Generate HTML content with placeholders replaced
        let htmlContent = template.html_content || getDefaultTemplate()

        // Replace personal information placeholders
        htmlContent = htmlContent.replace(/{FULL_NAME}/g, data.personal.fullName || "")
        htmlContent = htmlContent.replace(/{NAME}/g, data.personal.firstName || "")
        htmlContent = htmlContent.replace(/{SURNAME}/g, data.personal.lastName || "")
        htmlContent = htmlContent.replace(/{TAGLINE}/g, data.personal.tagline || "")
        htmlContent = htmlContent.replace(/{CITY}/g, data.personal.city || "")
        htmlContent = htmlContent.replace(/{COUNTY}/g, data.personal.county || "")
        htmlContent = htmlContent.replace(/{POSTCODE}/g, data.personal.postcode || "")
        htmlContent = htmlContent.replace(/{PHONE}/g, data.personal.phone || "")
        htmlContent = htmlContent.replace(/{EMAIL}/g, data.personal.email || "")
        htmlContent = htmlContent.replace(/{PROFESSIONAL_SUMMARY}/g, data.personal.professionalSummary || "")

        // Generate work experience HTML
        let workExperienceHtml = ""
        data.workExperience.forEach((exp, index) => {
          workExperienceHtml += `
            <div class="experience-item">
              <div class="job-header">
                <span class="job-title">${exp.jobTitle || ""}</span> at 
                <span class="employer">${exp.employer || ""}</span>
                <span class="dates">${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
              </div>
              <div class="location">${exp.location || ""}</div>
              <div class="description">${exp.description || ""}</div>
              <div class="achievements">${exp.achievements || ""}</div>
            </div>
          `

          // Replace individual work experience placeholders
          htmlContent = htmlContent.replace(new RegExp(`{JOB_TITLE_${index + 1}}`, "g"), exp.jobTitle || "")
          htmlContent = htmlContent.replace(new RegExp(`{EMPLOYER_${index + 1}}`, "g"), exp.employer || "")
          htmlContent = htmlContent.replace(new RegExp(`{WORK_LOCATION_${index + 1}}`, "g"), exp.location || "")
          htmlContent = htmlContent.replace(new RegExp(`{WORK_START_DATE_${index + 1}}`, "g"), exp.startDate || "")
          htmlContent = htmlContent.replace(new RegExp(`{WORK_END_DATE_${index + 1}}`, "g"), exp.endDate || "Present")
          htmlContent = htmlContent.replace(new RegExp(`{WORK_DESCRIPTION_${index + 1}}`, "g"), exp.description || "")
          htmlContent = htmlContent.replace(new RegExp(`{WORK_ACHIEVEMENTS_${index + 1}}`, "g"), exp.achievements || "")
          htmlContent = htmlContent.replace(
            new RegExp(`{WORK_EXPERIENCE_${index + 1}}`, "g"),
            `
            <div class="experience-item">
              <div class="job-header">
                <span class="job-title">${exp.jobTitle || ""}</span> at 
                <span class="employer">${exp.employer || ""}</span>
                <span class="dates">${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
              </div>
              <div class="location">${exp.location || ""}</div>
              <div class="description">${exp.description || ""}</div>
              <div class="achievements">${exp.achievements || ""}</div>
            </div>
          `,
          )
        })

        // Replace combined work experience placeholder
        htmlContent = htmlContent.replace(/{WORK_EXPERIENCE}/g, workExperienceHtml)

        // Generate education HTML
        let educationHtml = ""
        data.education.forEach((edu, index) => {
          educationHtml += `
            <div class="education-item">
              <div class="education-header">
                <span class="institution">${edu.institution || ""}</span>
                <span class="dates">${edu.graduationDate || ""}</span>
              </div>
              <div class="location">${edu.location || ""}</div>
              <div class="degree">${edu.degree || ""} in ${edu.fieldOfStudy || ""}</div>
              <div class="description">${edu.description || ""}</div>
            </div>
          `

          // Replace individual education placeholders
          htmlContent = htmlContent.replace(new RegExp(`{INSTITUTION_${index + 1}}`, "g"), edu.institution || "")
          htmlContent = htmlContent.replace(new RegExp(`{EDUCATION_LOCATION_${index + 1}}`, "g"), edu.location || "")
          htmlContent = htmlContent.replace(new RegExp(`{DEGREE_${index + 1}}`, "g"), edu.degree || "")
          htmlContent = htmlContent.replace(new RegExp(`{FIELD_OF_STUDY_${index + 1}}`, "g"), edu.fieldOfStudy || "")
          htmlContent = htmlContent.replace(new RegExp(`{GRADUATION_DATE_${index + 1}}`, "g"), edu.graduationDate || "")
          htmlContent = htmlContent.replace(
            new RegExp(`{EDUCATION_DESCRIPTION_${index + 1}}`, "g"),
            edu.description || "",
          )
          htmlContent = htmlContent.replace(
            new RegExp(`{EDUCATION_${index + 1}}`, "g"),
            `
            <div class="education-item">
              <div class="education-header">
                <span class="institution">${edu.institution || ""}</span>
                <span class="dates">${edu.graduationDate || ""}</span>
              </div>
              <div class="location">${edu.location || ""}</div>
              <div class="degree">${edu.degree || ""} in ${edu.fieldOfStudy || ""}</div>
              <div class="description">${edu.description || ""}</div>
            </div>
          `,
          )
        })

        // Replace combined education placeholder
        htmlContent = htmlContent.replace(/{EDUCATION}/g, educationHtml)

        // Generate skills HTML
        let skillsHtml = ""
        data.skills.forEach((skill, index) => {
          if (skill) {
            skillsHtml += `<span class="skill">${skill}</span>`
            htmlContent = htmlContent.replace(new RegExp(`{SKILL_${index + 1}}`, "g"), skill)
          }
        })
        htmlContent = htmlContent.replace(/{SKILLS}/g, skillsHtml)

        // Generate achievements HTML
        let achievementsHtml = ""
        data.achievements.forEach((achievement, index) => {
          if (achievement) {
            achievementsHtml += `<li>${achievement}</li>`
            htmlContent = htmlContent.replace(new RegExp(`{ACHIEVEMENT_${index + 1}}`, "g"), achievement)
          }
        })
        htmlContent = htmlContent.replace(/{ACHIEVEMENTS}/g, achievementsHtml)

        // Generate references HTML
        let referencesHtml = ""
        data.references.forEach((reference, index) => {
          if (reference.name) {
            referencesHtml += `
              <div class="reference-item">
                <div class="reference-name">${reference.name || ""}</div>
                <div class="reference-position">${reference.position || ""} at ${reference.company || ""}</div>
                <div class="reference-contact">${reference.phone || ""} | ${reference.email || ""}</div>
              </div>
            `

            htmlContent = htmlContent.replace(new RegExp(`{REFERENCE_NAME_${index + 1}}`, "g"), reference.name || "")
            htmlContent = htmlContent.replace(
              new RegExp(`{REFERENCE_POSITION_${index + 1}}`, "g"),
              reference.position || "",
            )
            htmlContent = htmlContent.replace(
              new RegExp(`{REFERENCE_COMPANY_${index + 1}}`, "g"),
              reference.company || "",
            )
            htmlContent = htmlContent.replace(new RegExp(`{REFERENCE_PHONE_${index + 1}}`, "g"), reference.phone || "")
            htmlContent = htmlContent.replace(new RegExp(`{REFERENCE_EMAIL_${index + 1}}`, "g"), reference.email || "")
            htmlContent = htmlContent.replace(
              new RegExp(`{REFERENCE_${index + 1}}`, "g"),
              `
              <div class="reference-item">
                <div class="reference-name">${reference.name || ""}</div>
                <div class="reference-position">${reference.position || ""} at ${reference.company || ""}</div>
                <div class="reference-contact">${reference.phone || ""} | ${reference.email || ""}</div>
              </div>
            `,
            )
          }
        })
        htmlContent = htmlContent.replace(/{REFERENCES}/g, referencesHtml)

        // Replace additional sections
        if (data.additionalSections) {
          htmlContent = htmlContent.replace(/{CERTIFICATIONS}/g, data.additionalSections.certifications || "")
          htmlContent = htmlContent.replace(/{LANGUAGES}/g, data.additionalSections.languages || "")
          htmlContent = htmlContent.replace(/{WEBSITES}/g, data.additionalSections.websites || "")
          htmlContent = htmlContent.replace(/{SOFTWARE}/g, data.additionalSections.software || "")
          htmlContent = htmlContent.replace(/{ACCOMPLISHMENTS}/g, data.additionalSections.accomplishments || "")
          htmlContent = htmlContent.replace(/{ADDITIONALINFO}/g, data.additionalSections.additionalInfo || "")
          htmlContent = htmlContent.replace(/{AFFILIATIONS}/g, data.additionalSections.affiliations || "")
          htmlContent = htmlContent.replace(/{INTERESTS}/g, data.additionalSections.interests || "")
        }

        // Remove any unused placeholders
        htmlContent = htmlContent.replace(/{[A-Z0-9_]+}/g, "")

        setHtml(htmlContent)
      } catch (error) {
        console.error("Error generating resume preview:", error)
        setHtml("<div>Error generating preview</div>")
      }
    }
  }, [template, data])

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume - ${data.personal.fullName || "Print"}</title>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    setTimeout(() => printWindow.close(), 1000)
  }

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${data.personal.fullName || "Resume"}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getDefaultTemplate = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #333;">{FULL_NAME}</h1>
        <p style="text-align: center; color: #666;">{EMAIL} | {PHONE} | {CITY}, {COUNTY} {POSTCODE}</p>
        
        <div style="margin-top: 20px;">
          <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">Professional Summary</h2>
          <p>{PROFESSIONAL_SUMMARY}</p>
        </div>
        
        <div style="margin-top: 20px;">
          <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">Work Experience</h2>
          {WORK_EXPERIENCE}
        </div>
        
        <div style="margin-top: 20px;">
          <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">Education</h2>
          {EDUCATION}
        </div>
        
        <div style="margin-top: 20px;">
          <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            {SKILLS}
          </div>
        </div>
      </div>
    `
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <div className="resume-preview" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        <Button onClick={handleDownload} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download HTML
        </Button>
      </div>
    </div>
  )
}
