"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, MinusCircle } from "lucide-react"

export function ResumeForm({ data, onChange }) {
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    onChange({
      ...data,
      personal: { ...data.personal, [name]: value },
    })

    // Auto-update fullName when firstName or lastName changes
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : data.personal.firstName
      const lastName = name === "lastName" ? value : data.personal.lastName
      onChange({
        ...data,
        personal: {
          ...data.personal,
          [name]: value,
          fullName: `${firstName} ${lastName}`.trim(),
        },
      })
    }
  }

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperience = [...data.workExperience]
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value }
    onChange({ ...data, workExperience: newWorkExperience })
  }

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...data.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    onChange({ ...data, education: newEducation })
  }

  const handleSkillChange = (index, value) => {
    const newSkills = [...data.skills]
    newSkills[index] = value
    onChange({ ...data, skills: newSkills })
  }

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...data.achievements]
    newAchievements[index] = value
    onChange({ ...data, achievements: newAchievements })
  }

  const handleReferenceChange = (index, field, value) => {
    const newReferences = [...data.references]
    newReferences[index] = { ...newReferences[index], [field]: value }
    onChange({ ...data, references: newReferences })
  }

  const handleAdditionalSectionChange = (section, value) => {
    onChange({
      ...data,
      additionalSections: { ...data.additionalSections, [section]: value },
    })
  }

  const addWorkExperience = () => {
    onChange({
      ...data,
      workExperience: [
        ...data.workExperience,
        {
          jobTitle: "",
          employer: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: "",
        },
      ],
    })
  }

  const removeWorkExperience = (index) => {
    const newWorkExperience = [...data.workExperience]
    newWorkExperience.splice(index, 1)
    onChange({ ...data, workExperience: newWorkExperience })
  }

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        {
          institution: "",
          location: "",
          degree: "",
          fieldOfStudy: "",
          graduationDate: "",
          description: "",
        },
      ],
    })
  }

  const removeEducation = (index) => {
    const newEducation = [...data.education]
    newEducation.splice(index, 1)
    onChange({ ...data, education: newEducation })
  }

  const addSkill = () => {
    onChange({
      ...data,
      skills: [...data.skills, ""],
    })
  }

  const removeSkill = (index) => {
    const newSkills = [...data.skills]
    newSkills.splice(index, 1)
    onChange({ ...data, skills: newSkills })
  }

  const addAchievement = () => {
    onChange({
      ...data,
      achievements: [...data.achievements, ""],
    })
  }

  const removeAchievement = (index) => {
    const newAchievements = [...data.achievements]
    newAchievements.splice(index, 1)
    onChange({ ...data, achievements: newAchievements })
  }

  const addReference = () => {
    onChange({
      ...data,
      references: [
        ...data.references,
        {
          name: "",
          position: "",
          company: "",
          phone: "",
          email: "",
        },
      ],
    })
  }

  const removeReference = (index) => {
    const newReferences = [...data.references]
    newReferences.splice(index, 1)
    onChange({ ...data, references: newReferences })
  }

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="mb-4">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="references">References</TabsTrigger>
        <TabsTrigger value="additional">Additional</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={data.personal.firstName}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={data.personal.lastName}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tagline">Professional Tagline</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  value={data.personal.tagline}
                  onChange={handlePersonalInfoChange}
                  placeholder="e.g. Senior Software Engineer with 10+ years of experience"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={data.personal.email}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={data.personal.phone} onChange={handlePersonalInfoChange} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={data.personal.city} onChange={handlePersonalInfoChange} />
                </div>
                <div>
                  <Label htmlFor="county">County/State</Label>
                  <Input id="county" name="county" value={data.personal.county} onChange={handlePersonalInfoChange} />
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode/ZIP</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={data.personal.postcode}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="professionalSummary">Professional Summary</Label>
                <Textarea
                  id="professionalSummary"
                  name="professionalSummary"
                  value={data.personal.professionalSummary}
                  onChange={handlePersonalInfoChange}
                  rows={4}
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
          </CardHeader>
          <CardContent>
            {data.workExperience.map((exp, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Position {index + 1}</h3>
                  {data.workExperience.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeWorkExperience(index)}>
                      <MinusCircle className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                      <Input
                        id={`jobTitle-${index}`}
                        value={exp.jobTitle}
                        onChange={(e) => handleWorkExperienceChange(index, "jobTitle", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`employer-${index}`}>Employer</Label>
                      <Input
                        id={`employer-${index}`}
                        value={exp.employer}
                        onChange={(e) => handleWorkExperienceChange(index, "employer", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`location-${index}`}>Location</Label>
                    <Input
                      id={`location-${index}`}
                      value={exp.location}
                      onChange={(e) => handleWorkExperienceChange(index, "location", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`startDate-${index}`}
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleWorkExperienceChange(index, "startDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`endDate-${index}`}>End Date</Label>
                      <Input
                        id={`endDate-${index}`}
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleWorkExperienceChange(index, "endDate", e.target.value)}
                        placeholder="Leave blank for 'Present'"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={exp.description}
                      onChange={(e) => handleWorkExperienceChange(index, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`achievements-${index}`}>Key Achievements</Label>
                    <Textarea
                      id={`achievements-${index}`}
                      value={exp.achievements}
                      onChange={(e) => handleWorkExperienceChange(index, "achievements", e.target.value)}
                      rows={3}
                      placeholder="List your key achievements and contributions"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addWorkExperience}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Work Experience
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="education">
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Education {index + 1}</h3>
                  {data.education.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeEducation(index)}>
                      <MinusCircle className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
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
                    <Label htmlFor={`location-${index}`}>Location</Label>
                    <Input
                      id={`location-${index}`}
                      value={edu.location}
                      onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        placeholder="e.g. Bachelor of Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`fieldOfStudy-${index}`}>Field of Study</Label>
                      <Input
                        id={`fieldOfStudy-${index}`}
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`graduationDate-${index}`}>Graduation Date</Label>
                    <Input
                      id={`graduationDate-${index}`}
                      type="month"
                      value={edu.graduationDate}
                      onChange={(e) => handleEducationChange(index, "graduationDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={edu.description}
                      onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                      rows={3}
                      placeholder="Relevant coursework, honors, activities, etc."
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addEducation}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills">
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {data.skills.map((skill, index) => (
              <div key={index} className="mb-4 flex items-center gap-2">
                <Input
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder={`Skill ${index + 1}`}
                />
                {data.skills.length > 1 && (
                  <Button variant="outline" size="icon" onClick={() => removeSkill(index)}>
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addSkill}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="achievements">
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {data.achievements.map((achievement, index) => (
              <div key={index} className="mb-4 flex items-center gap-2">
                <Input
                  value={achievement}
                  onChange={(e) => handleAchievementChange(index, e.target.value)}
                  placeholder={`Achievement ${index + 1}`}
                />
                {data.achievements.length > 1 && (
                  <Button variant="outline" size="icon" onClick={() => removeAchievement(index)}>
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addAchievement}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Achievement
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="references">
        <Card>
          <CardHeader>
            <CardTitle>References</CardTitle>
          </CardHeader>
          <CardContent>
            {data.references.map((reference, index) => (
              <div key={index} className="mb-6 p-4 border rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Reference {index + 1}</h3>
                  {data.references.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeReference(index)}>
                      <MinusCircle className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor={`refName-${index}`}>Name</Label>
                    <Input
                      id={`refName-${index}`}
                      value={reference.name}
                      onChange={(e) => handleReferenceChange(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`refPosition-${index}`}>Position</Label>
                      <Input
                        id={`refPosition-${index}`}
                        value={reference.position}
                        onChange={(e) => handleReferenceChange(index, "position", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`refCompany-${index}`}>Company</Label>
                      <Input
                        id={`refCompany-${index}`}
                        value={reference.company}
                        onChange={(e) => handleReferenceChange(index, "company", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`refPhone-${index}`}>Phone</Label>
                      <Input
                        id={`refPhone-${index}`}
                        value={reference.phone}
                        onChange={(e) => handleReferenceChange(index, "phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`refEmail-${index}`}>Email</Label>
                      <Input
                        id={`refEmail-${index}`}
                        value={reference.email}
                        onChange={(e) => handleReferenceChange(index, "email", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addReference}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Reference
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="additional">
        <Card>
          <CardHeader>
            <CardTitle>Additional Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  value={data.additionalSections.certifications}
                  onChange={(e) => handleAdditionalSectionChange("certifications", e.target.value)}
                  rows={3}
                  placeholder="List your certifications"
                />
              </div>
              <div>
                <Label htmlFor="languages">Languages</Label>
                <Textarea
                  id="languages"
                  value={data.additionalSections.languages}
                  onChange={(e) => handleAdditionalSectionChange("languages", e.target.value)}
                  rows={3}
                  placeholder="List languages you speak and proficiency level"
                />
              </div>
              <div>
                <Label htmlFor="websites">Websites & Profiles</Label>
                <Textarea
                  id="websites"
                  value={data.additionalSections.websites}
                  onChange={(e) => handleAdditionalSectionChange("websites", e.target.value)}
                  rows={3}
                  placeholder="Personal website, LinkedIn, GitHub, etc."
                />
              </div>
              <div>
                <Label htmlFor="software">Software Proficiency</Label>
                <Textarea
                  id="software"
                  value={data.additionalSections.software}
                  onChange={(e) => handleAdditionalSectionChange("software", e.target.value)}
                  rows={3}
                  placeholder="List software and tools you're proficient with"
                />
              </div>
              <div>
                <Label htmlFor="interests">Interests</Label>
                <Textarea
                  id="interests"
                  value={data.additionalSections.interests}
                  onChange={(e) => handleAdditionalSectionChange("interests", e.target.value)}
                  rows={3}
                  placeholder="List your hobbies and interests"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
