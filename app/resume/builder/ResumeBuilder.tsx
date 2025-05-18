"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIAssistant } from "./AIAssistant"
import { ResumePreview } from "./ResumePreview"
import { User, Briefcase, GraduationCap, Award, Star, UserCheck, Save, Download, Loader2 } from "lucide-react"

export function ResumeBuilder({ initialData, templates, onSave }) {
  const [activeTab, setActiveTab] = useState("personal")
  const [resumeData, setResumeData] = useState(
    initialData || {
      personal: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        county: "",
        postcode: "",
        professionalSummary: "",
        tagline: "",
      },
      workExperience: [],
      education: [],
      skills: [],
      achievements: [],
      references: [],
    },
  )
  const [selectedTemplate, setSelectedTemplate] = useState(templates?.[0]?.id || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateData = (newData) => {
    setResumeData(newData)
  }

  const handleSaveResume = async () => {
    setIsSaving(true)
    try {
      await onSave(resumeData, selectedTemplate)
    } catch (error) {
      console.error("Error saving resume:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddExperience = () => {
    setResumeData({
      ...resumeData,
      workExperience: [
        ...resumeData.workExperience,
        {
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    })
  }

  const handleUpdateExperience = (index, field, value) => {
    const updatedExperience = [...resumeData.workExperience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      workExperience: updatedExperience,
    })
  }

  const handleRemoveExperience = (index) => {
    const updatedExperience = [...resumeData.workExperience]
    updatedExperience.splice(index, 1)
    setResumeData({
      ...resumeData,
      workExperience: updatedExperience,
    })
  }

  const handleAddEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          institution: "",
          degree: "",
          location: "",
          graduationDate: "",
          description: "",
        },
      ],
    })
  }

  const handleUpdateEducation = (index, field, value) => {
    const updatedEducation = [...resumeData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    })
  }

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...resumeData.education]
    updatedEducation.splice(index, 1)
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    })
  }

  const handleUpdatePersonal = (field, value) => {
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [field]: value,
      },
    })
  }

  const handleAddSkill = (skill) => {
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, skill],
      })
    }
  }

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...resumeData.skills]
    updatedSkills.splice(index, 1)
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    })
  }

  const handleAddAchievement = (achievement) => {
    if (achievement) {
      setResumeData({
        ...resumeData,
        achievements: [...resumeData.achievements, achievement],
      })
    }
  }

  const handleRemoveAchievement = (index) => {
    const updatedAchievements = [...resumeData.achievements]
    updatedAchievements.splice(index, 1)
    setResumeData({
      ...resumeData,
      achievements: updatedAchievements,
    })
  }

  const handleAddReference = () => {
    setResumeData({
      ...resumeData,
      references: [
        ...resumeData.references,
        {
          name: "",
          position: "",
          company: "",
          email: "",
          phone: "",
        },
      ],
    })
  }

  const handleUpdateReference = (index, field, value) => {
    const updatedReferences = [...resumeData.references]
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      references: updatedReferences,
    })
  }

  const handleRemoveReference = (index) => {
    const updatedReferences = [...resumeData.references]
    updatedReferences.splice(index, 1)
    setResumeData({
      ...resumeData,
      references: updatedReferences,
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/3">
        <Card>
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4">
                <TabsTrigger value="personal" className="flex flex-col items-center gap-1 py-2">
                  <User className="h-4 w-4" />
                  <span className="text-xs">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex flex-col items-center gap-1 py-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-xs">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex flex-col items-center gap-1 py-2">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-xs">Education</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex flex-col items-center gap-1 py-2">
                  <Star className="h-4 w-4" />
                  <span className="text-xs">Skills</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex flex-col items-center gap-1 py-2">
                  <Award className="h-4 w-4" />
                  <span className="text-xs">Achievements</span>
                </TabsTrigger>
                <TabsTrigger value="references" className="flex flex-col items-center gap-1 py-2">
                  <UserCheck className="h-4 w-4" />
                  <span className="text-xs">References</span>
                </TabsTrigger>
              </TabsList>

              <AIAssistant
                section={activeTab}
                data={resumeData}
                onUpdate={handleUpdateData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />

              <TabsContent value="personal">
                {/* Personal Information Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.personal.fullName || ""}
                        onChange={(e) => handleUpdatePersonal("fullName", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tagline</label>
                      <input
                        type="text"
                        value={resumeData.personal.tagline || ""}
                        onChange={(e) => handleUpdatePersonal("tagline", e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={resumeData.personal.email || ""}
                        onChange={(e) => handleUpdatePersonal("email", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={resumeData.personal.phone || ""}
                        onChange={(e) => handleUpdatePersonal("phone", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={resumeData.personal.city || ""}
                        onChange={(e) => handleUpdatePersonal("city", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">County</label>
                      <input
                        type="text"
                        value={resumeData.personal.county || ""}
                        onChange={(e) => handleUpdatePersonal("county", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Postcode</label>
                      <input
                        type="text"
                        value={resumeData.personal.postcode || ""}
                        onChange={(e) => handleUpdatePersonal("postcode", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Professional Summary</label>
                      <textarea
                        value={resumeData.personal.professionalSummary || ""}
                        onChange={(e) => handleUpdatePersonal("professionalSummary", e.target.value)}
                        className="w-full p-2 border rounded-md"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience">
                {/* Work Experience Form */}
                <div className="space-y-6">
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Experience #{index + 1}</h3>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveExperience(index)}>
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company || ""}
                            onChange={(e) => handleUpdateExperience(index, "company", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Position</label>
                          <input
                            type="text"
                            value={exp.position || ""}
                            onChange={(e) => handleUpdateExperience(index, "position", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location || ""}
                            onChange={(e) => handleUpdateExperience(index, "location", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate || ""}
                              onChange={(e) => handleUpdateExperience(index, "startDate", e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="MM/YYYY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <input
                              type="text"
                              value={exp.endDate || ""}
                              onChange={(e) => handleUpdateExperience(index, "endDate", e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="MM/YYYY or Present"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={exp.description || ""}
                            onChange={(e) => handleUpdateExperience(index, "description", e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleAddExperience} className="w-full">
                    Add Work Experience
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="education">
                {/* Education Form */}
                <div className="space-y-6">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Education #{index + 1}</h3>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveEducation(index)}>
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.institution || ""}
                            onChange={(e) => handleUpdateEducation(index, "institution", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree || ""}
                            onChange={(e) => handleUpdateEducation(index, "degree", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Location</label>
                          <input
                            type="text"
                            value={edu.location || ""}
                            onChange={(e) => handleUpdateEducation(index, "location", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Graduation Date</label>
                          <input
                            type="text"
                            value={edu.graduationDate || ""}
                            onChange={(e) => handleUpdateEducation(index, "graduationDate", e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={edu.description || ""}
                            onChange={(e) => handleUpdateEducation(index, "description", e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleAddEducation} className="w-full">
                    Add Education
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="skills">
                {/* Skills Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Add Skill</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="skill"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., JavaScript"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddSkill(e.target.value)
                            e.target.value = ""
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById("skill") as HTMLInputElement
                          handleAddSkill(input.value)
                          input.value = ""
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                        <span>{skill}</span>
                        <button onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:text-red-700">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements">
                {/* Achievements Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Add Achievement</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="achievement"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., Increased sales by 20%"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddAchievement(e.target.value)
                            e.target.value = ""
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById("achievement") as HTMLInputElement
                          handleAddAchievement(input.value)
                          input.value = ""
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    {resumeData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span>{achievement}</span>
                        <button
                          onClick={() => handleRemoveAchievement(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="references">
                {/* References Form */}
                <div className="space-y-6">
                  {resumeData.references.map((ref, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Reference #{index + 1}</h3>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveReference(index)}>
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input
                            type="text"
                            value={ref.name || ""}
                            onChange={(e) => handleUpdateReference(index, "name", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Position</label>
                          <input
                            type="text"
                            value={ref.position || ""}
                            onChange={(e) => handleUpdateReference(index, "position", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Company</label>
                          <input
                            type="text"
                            value={ref.company || ""}
                            onChange={(e) => handleUpdateReference(index, "company", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={ref.email || ""}
                            onChange={(e) => handleUpdateReference(index, "email", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <input
                            type="tel"
                            value={ref.phone || ""}
                            onChange={(e) => handleUpdateReference(index, "phone", e.target.value)}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleAddReference} className="w-full">
                    Add Reference
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleSaveResume} className="flex-1" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Resume
              </>
            )}
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="w-full lg:w-2/3">
        <Card className="h-full">
          <CardContent className="p-4 h-full">
            <ResumePreview
              data={resumeData}
              templateId={selectedTemplate}
              templates={templates}
              onTemplateChange={setSelectedTemplate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
