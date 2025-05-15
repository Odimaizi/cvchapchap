"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, MinusCircle } from "lucide-react"

export function ResumeForm({ data, onChange }) {
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [name]: value },
    })
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...data.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    onChange({ ...data, experience: newExperience })
  }

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...data.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    onChange({ ...data, education: newEducation })
  }

  const addExperience = () => {
    onChange({
      ...data,
      experience: [...data.experience, { company: "", position: "", startDate: "", endDate: "", description: "" }],
    })
  }

  const removeExperience = (index) => {
    const newExperience = [...data.experience]
    newExperience.splice(index, 1)
    onChange({ ...data, experience: newExperience })
  }

  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, { institution: "", degree: "", graduationDate: "" }],
    })
  }

  const removeEducation = (index) => {
    const newEducation = [...data.education]
    newEducation.splice(index, 1)
    onChange({ ...data, education: newEducation })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={data.personalInfo.name} onChange={handlePersonalInfoChange} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={data.personalInfo.email}
                  onChange={handlePersonalInfoChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={data.personalInfo.location}
                  onChange={handlePersonalInfoChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="grid gap-4">
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
              {data.experience.length > 1 && (
                <Button variant="outline" onClick={() => removeExperience(index)} className="mt-2">
                  <MinusCircle className="mr-2 h-4 w-4" /> Remove Experience
                </Button>
              )}
            </div>
          ))}
          <Button onClick={addExperience}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="grid gap-4">
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
              {data.education.length > 1 && (
                <Button variant="outline" onClick={() => removeEducation(index)} className="mt-2">
                  <MinusCircle className="mr-2 h-4 w-4" /> Remove Education
                </Button>
              )}
            </div>
          ))}
          <Button onClick={addEducation}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Textarea
            id="skills"
            value={data.skills.join(", ")}
            onChange={(e) => onChange({ ...data, skills: e.target.value.split(",").map((skill) => skill.trim()) })}
            placeholder="Enter your skills, separated by commas"
          />
        </CardContent>
      </Card>
    </div>
  )
}
