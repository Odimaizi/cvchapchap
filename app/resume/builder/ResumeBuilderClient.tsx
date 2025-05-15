"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const templates = {
  1: { name: "Modern Professional", primaryColor: "#007bff", fontFamily: "Arial, sans-serif" },
  2: { name: "Creative Design", primaryColor: "#ff6b6b", fontFamily: "Helvetica, sans-serif" },
  3: { name: "Executive", primaryColor: "#2c3e50", fontFamily: "Georgia, serif" },
  4: { name: "Simple Clean", primaryColor: "#4caf50", fontFamily: "Roboto, sans-serif" },
  5: { name: "Tech Savvy", primaryColor: "#9c27b0", fontFamily: "Courier New, monospace" },
  6: { name: "Traditional", primaryColor: "#795548", fontFamily: "Times New Roman, serif" },
}

export function ResumeBuilderClient() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template") || "1"
  const [selectedTemplate, setSelectedTemplate] = useState(templates[templateId])

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  })

  const [experience, setExperience] = useState([
    { company: "", position: "", startDate: "", endDate: "", description: "" },
  ])

  const [education, setEducation] = useState([{ institution: "", degree: "", graduationDate: "" }])

  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...experience]
    newExperience[index][field] = value
    setExperience(newExperience)
  }

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...education]
    newEducation[index][field] = value
    setEducation(newEducation)
  }

  const addExperience = () => {
    setExperience([...experience, { company: "", position: "", startDate: "", endDate: "", description: "" }])
  }

  const addEducation = () => {
    setEducation([...education, { institution: "", degree: "", graduationDate: "" }])
  }

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templates[templateId])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Build Your Resume</h1>
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Enter your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={personalInfo.location}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Add your relevant work experience</CardDescription>
            </CardHeader>
            <CardContent>
              {experience.map((exp, index) => (
                <div key={index} className="mb-6 p-4 border rounded">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input
                        id={`company-${index}`}
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`position-${index}`}>Position</Label>
                      <Input
                        id={`position-${index}`}
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`startDate-${index}`}
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`endDate-${index}`}>End Date</Label>
                        <Input
                          id={`endDate-${index}`}
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addExperience}>Add Experience</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Add your educational background</CardDescription>
            </CardHeader>
            <CardContent>
              {education.map((edu, index) => (
                <div key={index} className="mb-6 p-4 border rounded">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`institution-${index}`}>Institution</Label>
                      <Input
                        id={`institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`graduationDate-${index}`}>Graduation Date</Label>
                      <Input
                        id={`graduationDate-${index}`}
                        type="date"
                        value={edu.graduationDate}
                        onChange={(e) => handleEducationChange(index, "graduationDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addEducation}>Add Education</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add your professional skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input placeholder="Enter a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                  <Button onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                      <span>{skill}</span>
                      <button className="ml-2 text-red-500 font-bold" onClick={() => removeSkill(skill)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Choose Template</CardTitle>
              <CardDescription>Select and customize your resume template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select onValueChange={handleTemplateChange} defaultValue={templateId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(templates).map(([id, template]) => (
                        <SelectItem key={id} value={id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={selectedTemplate.primaryColor}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, primaryColor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input
                    id="fontFamily"
                    value={selectedTemplate.fontFamily}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, fontFamily: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-8">
        <Button size="lg">Generate Resume</Button>
      </div>
    </div>
  )
}
