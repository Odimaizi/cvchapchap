"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ResumePreview({ template, data }) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    if (template && data) {
      const htmlContent = generateResumeHtml(template.html_content || getDefaultTemplate(), data)
      setHtml(htmlContent)
    }
  }, [template, data])

  const generateResumeHtml = (htmlTemplate, data) => {
    let html = htmlTemplate

    // Replace personal information placeholders
    if (data.personal) {
      html = html.replace(/{FULL_NAME}/g, data.personal.fullName || "")
      html = html.replace(/{NAME}/g, data.personal.firstName || "")
      html = html.replace(/{SURNAME}/g, data.personal.lastName || "")
      html = html.replace(/{TAGLINE}/g, data.personal.tagline || "")
      html = html.replace(/{CITY}/g, data.personal.city || "")
      html = html.replace(/{COUNTY}/g, data.personal.county || "")
      html = html.replace(/{POSTCODE}/g, data.personal.postcode || "")
      html = html.replace(/{PHONE}/g, data.personal.phone || "")
      html = html.replace(/{EMAIL}/g, data.personal.email || "")
      html = html.replace(/{PROFESSIONAL_SUMMARY}/g, data.personal.professionalSummary || "")
    }

    // Generate work experience HTML
    let workExperienceHtml = ""
    if (data.workExperience && Array.isArray(data.workExperience)) {
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
        html = html.replace(new RegExp(`{JOB_TITLE_${index + 1}}`, "g"), exp.jobTitle || "")
        html = html.replace(new RegExp(`{EMPLOYER_${index + 1}}`, "g"), exp.employer || "")
        html = html.replace(new RegExp(`{WORK_LOCATION_${index + 1}}`, "g"), exp.location || "")
        html = html.replace(new RegExp(`{WORK_START_DATE_${index + 1}}`, "g"), exp.startDate || "")
        html = html.replace(new RegExp(`{WORK_END_DATE_${index + 1}}`, "g"), exp.endDate || "Present")
        html = html.replace(new RegExp(`{WORK_DESCRIPTION_${index + 1}}`, "g"), exp.description || "")
        html = html.replace(new RegExp(`{WORK_ACHIEVEMENTS_${index + 1}}`, "g"), exp.achievements || "")
        html = html.replace(
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
    }
    html = html.replace(/{WORK_EXPERIENCE}/g, workExperienceHtml)

    // Generate education HTML
    let educationHtml = ""
    if (data.education && Array.isArray(data.education)) {
      data.education.forEach((edu, index) => {
        educationHtml += `
          <div class="education-item">
            <div class="degree">${edu.degree || ""}</div>
            <div class="institution">${edu.institution || ""}</div>
            <div class="location">${edu.location || ""}</div>
            <div class="graduation-date">${edu.graduationDate || ""}</div>
            <div class="description">${edu.description || ""}</div>
          </div>
        `

        // Replace individual education placeholders
        html = html.replace(new RegExp(`{INSTITUTION_${index + 1}}`, "g"), edu.institution || "")
        html = html.replace(new RegExp(`{EDUCATION_LOCATION_${index + 1}}`, "g"), edu.location || "")
        html = html.replace(new RegExp(`{DEGREE_${index + 1}}`, "g"), edu.degree || "")
        html = html.replace(new RegExp(`{FIELD_OF_STUDY_${index + 1}}`, "g"), edu.fieldOfStudy || "")
        html = html.replace(new RegExp(`{GRADUATION_DATE_${index + 1}}`, "g"), edu.graduationDate || "")
        html = html.replace(new RegExp(`{EDUCATION_DESCRIPTION_${index + 1}}`, "g"), edu.description || "")
        html = html.replace(
          new RegExp(`{EDUCATION_${index + 1}}`, "g"),
          `
          <div class="education-item">
            <div class="degree">${edu.degree || ""}</div>
            <div class="institution">${edu.institution || ""}</div>
            <div class="location">${edu.location || ""}</div>
            <div class="graduation-date">${edu.graduationDate || ""}</div>
            <div class="description">${edu.description || ""}</div>
          </div>
        `,
        )
      })
    }
    html = html.replace(/{EDUCATION}/g, educationHtml)

    // Generate skills HTML
    let skillsHtml = ""
    if (data.skills && Array.isArray(data.skills)) {
      skillsHtml = `<ul class="skills-list">${data.skills.map((skill) => `<li>${skill}</li>`).join("")}</ul>`

      // Replace individual skill placeholders
      data.skills.forEach((skill, index) => {
        html = html.replace(new RegExp(`{SKILL_${index + 1}}`, "g"), skill)
      })
    }
    html = html.replace(/{SKILLS}/g, skillsHtml)

    // Generate references HTML
    let referencesHtml = ""
    if (data.references && Array.isArray(data.references)) {
      data.references.forEach((ref, index) => {
        referencesHtml += `
          <div class="reference-item">
            <div class="reference-name">${ref.name || ""}</div>
            <div class="reference-position">${ref.position || ""}</div>
            <div class="reference-company">${ref.company || ""}</div>
            <div class="reference-phone">${ref.phone || ""}</div>
            <div class="reference-email">${ref.email || ""}</div>
          </div>
        `

        // Replace individual reference placeholders
        html = html.replace(new RegExp(`{REFERENCE_NAME_${index + 1}}`, "g"), ref.name || "")
        html = html.replace(new RegExp(`{REFERENCE_POSITION_${index + 1}}`, "g"), ref.position || "")
        html = html.replace(new RegExp(`{REFERENCE_COMPANY_${index + 1}}`, "g"), ref.company || "")
        html = html.replace(new RegExp(`{REFERENCE_PHONE_${index + 1}}`, "g"), ref.phone || "")
        html = html.replace(new RegExp(`{REFERENCE_EMAIL_${index + 1}}`, "g"), ref.email || "")
        html = html.replace(
          new RegExp(`{REFERENCE_${index + 1}}`, "g"),
          `
          <div class="reference-item">
            <div class="reference-name">${ref.name || ""}</div>
            <div class="reference-position">${ref.position || ""}</div>
            <div class="reference-company">${ref.company || ""}</div>
            <div class="reference-phone">${ref.phone || ""}</div>
            <div class="reference-email">${ref.email || ""}</div>
          </div>
        `,
        )
      })
    }
    html = html.replace(/{REFERENCES}/g, referencesHtml)

    // Replace other section placeholders
    if (data.certifications) {
      html = html.replace(/{CERTIFICATIONS}/g, data.certifications)
    }
    if (data.languages) {
      html = html.replace(/{LANGUAGES}/g, data.languages)
    }
    if (data.websites) {
      html = html.replace(/{WEBSITES}/g, data.websites)
    }
    if (data.software) {
      html = html.replace(/{SOFTWARE}/g, data.software)
    }
    if (data.accomplishments) {
      html = html.replace(/{ACCOMPLISHMENTS}/g, data.accomplishments)
    }
    if (data.additionalInfo) {
      html = html.replace(/{ADDITIONALINFO}/g, data.additionalInfo)
    }
    if (data.affiliations) {
      html = html.replace(/{AFFILIATIONS}/g, data.affiliations)
    }
    if (data.interests) {
      html = html.replace(/{INTERESTS}/g, data.interests)
    }

    // Clean up any unused placeholders
    html = html.replace(/{[A-Z_0-9]+}/g, "")

    return html
  }

  const getDefaultTemplate = () => {
    return `
      <div class="resume">
        <h1>{FULL_NAME}</h1>
        <p>{EMAIL} | {PHONE} | {CITY}, {COUNTY} {POSTCODE}</p>
        <h2>Professional Summary</h2>
        <p>{PROFESSIONAL_SUMMARY}</p>
        <h2>Work Experience</h2>
        {WORK_EXPERIENCE}
        <h2>Education</h2>
        {EDUCATION}
        <h2>Skills</h2>
        {SKILLS}
      </div>
    `
  }

  return (
    <Card>
      <CardContent>
        <div className="resume-preview" dangerouslySetInnerHTML={{ __html: html }} />
        <Button onClick={() => window.print()} className="mt-4">
          Print Resume
        </Button>
      </CardContent>
    </Card>
  )
}
