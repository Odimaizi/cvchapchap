"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function ProfileClient() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileScore, setProfileScore] = useState(0)
  const [profile, setProfile] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      summary: "",
    },
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: {
      technical: "",
      soft: "",
      languages: "",
      certifications: "",
    },
    preferences: {
      jobTypes: [],
      industries: [],
      locations: [],
      salary: "",
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data, error } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single()

        if (data && !error) {
          setProfile(data.profile_data)
          calculateProfileScore(data.profile_data)
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  const calculateProfileScore = (profileData: any) => {
    // Simple scoring algorithm
    let score = 0
    const total = 100

    // Personal section (25%)
    const personalFields = Object.values(profileData.personal).filter(Boolean).length
    score += (personalFields / 6) * 25

    // Experience section (25%)
    const hasExperience = profileData.experience.some((exp: any) => exp.company && exp.position && exp.description)
    if (hasExperience) score += 25

    // Education section (20%)
    const hasEducation = profileData.education.some((edu: any) => edu.institution && edu.degree)
    if (hasEducation) score += 20

    // Skills section (20%)
    const skillsFields = Object.values(profileData.skills).filter(Boolean).length
    score += (skillsFields / 4) * 20

    // Preferences section (10%)
    const preferencesFields =
      (profileData.preferences.jobTypes?.length ? 1 : 0) +
      (profileData.preferences.industries?.length ? 1 : 0) +
      (profileData.preferences.locations?.length ? 1 : 0) +
      (profileData.preferences.salary ? 1 : 0)
    score += (preferencesFields / 4) * 10

    setProfileScore(Math.round(score))
  }

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      personal: {
        ...profile.personal,
        [name]: value,
      },
    })
  }

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExperience = [...profile.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    setProfile({
      ...profile,
      experience: newExperience,
    })
  }

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [
        ...profile.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    })
  }

  const removeExperience = (index: number) => {
    const newExperience = [...profile.experience]
    newExperience.splice(index, 1)
    setProfile({
      ...profile,
      experience: newExperience,
    })
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...profile.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setProfile({
      ...profile,
      education: newEducation,
    })
  }

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        {
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        },
      ],
    })
  }

  const removeEducation = (index: number) => {
    const newEducation = [...profile.education]
    newEducation.splice(index, 1)
    setProfile({
      ...profile,
      education: newEducation,
    })
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      skills: {
        ...profile.skills,
        [name]: value,
      },
    })
  }

  const handlePreferenceChange = (field: string, value: any) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [field]: value,
      },
    })
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        throw new Error("No user logged in")
      }

      calculateProfileScore(profile)

      const { error } = await supabase.from("profiles").upsert({
        user_id: session.user.id,
        profile_data: profile,
        profile_score: profileScore,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Profile</h1>
          <p className="text-muted-foreground">Complete your profile to improve your CV score and job matches</p>
        </div>
        <Card className="w-full md:w-auto">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">Profile Completion</div>
                <Progress value={profileScore} className="h-2" />
              </div>
              <div className="text-2xl font-bold">{profileScore}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                This information will be used to personalize your resume and cover letter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={profile.personal.fullName}
                    onChange={handlePersonalChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={profile.personal.title}
                    onChange={handlePersonalChange}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.personal.email}
                    onChange={handlePersonalChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={profile.personal.phone} onChange={handlePersonalChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={profile.personal.location}
                  onChange={handlePersonalChange}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={profile.personal.summary}
                  onChange={handlePersonalChange}
                  rows={4}
                  placeholder="A brief summary of your professional background and career goals"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Add your relevant work experience to enhance your resume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    {profile.experience.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeExperience(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input
                        id={`company-${index}`}
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`position-${index}`}>Position</Label>
                      <Input
                        id={`position-${index}`}
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`startDate-${index}`}
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${index}`}>End Date</Label>
                      <Input
                        id={`endDate-${index}`}
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                      rows={3}
                      placeholder="Describe your responsibilities and achievements"
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addExperience}>
                Add Experience
              </Button>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Add your educational background to strengthen your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Education {index + 1}</h3>
                    {profile.education.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removeEducation(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`institution-${index}`}>Institution</Label>
                      <Input
                        id={`institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        placeholder="e.g. Bachelor of Science"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`field-${index}`}>Field of Study</Label>
                    <Input
                      id={`field-${index}`}
                      value={edu.field}
                      onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`eduStartDate-${index}`}>Start Date</Label>
                      <Input
                        id={`eduStartDate-${index}`}
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`eduEndDate-${index}`}>End Date</Label>
                      <Input
                        id={`eduEndDate-${index}`}
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addEducation}>
                Add Education
              </Button>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>List your skills to highlight your qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="technical">Technical Skills</Label>
                <Textarea
                  id="technical"
                  name="technical"
                  value={profile.skills.technical}
                  onChange={handleSkillsChange}
                  rows={3}
                  placeholder="e.g. JavaScript, React, Node.js, SQL (separate with commas)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soft">Soft Skills</Label>
                <Textarea
                  id="soft"
                  name="soft"
                  value={profile.skills.soft}
                  onChange={handleSkillsChange}
                  rows={3}
                  placeholder="e.g. Communication, Leadership, Problem-solving (separate with commas)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="languages">Languages</Label>
                <Textarea
                  id="languages"
                  name="languages"
                  value={profile.skills.languages}
                  onChange={handleSkillsChange}
                  rows={2}
                  placeholder="e.g. English (Fluent), French (Intermediate) (separate with commas)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  name="certifications"
                  value={profile.skills.certifications}
                  onChange={handleSkillsChange}
                  rows={2}
                  placeholder="e.g. AWS Certified Developer, PMP (separate with commas)"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
              <CardDescription>Set your job preferences to get better job recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTypes">Job Types</Label>
                <Select
                  value={profile.preferences.jobTypes?.[0] || ""}
                  onValueChange={(value) => handlePreferenceChange("jobTypes", [value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industries">Preferred Industries</Label>
                <Select
                  value={profile.preferences.industries?.[0] || ""}
                  onValueChange={(value) => handlePreferenceChange("industries", [value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="locations">Preferred Locations</Label>
                <Select
                  value={profile.preferences.locations?.[0] || ""}
                  onValueChange={(value) => handlePreferenceChange("locations", [value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nairobi">Nairobi</SelectItem>
                    <SelectItem value="mombasa">Mombasa</SelectItem>
                    <SelectItem value="kisumu">Kisumu</SelectItem>
                    <SelectItem value="nakuru">Nakuru</SelectItem>
                    <SelectItem value="eldoret">Eldoret</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Expected Salary (KSh)</Label>
                <Input
                  id="salary"
                  value={profile.preferences.salary}
                  onChange={(e) => handlePreferenceChange("salary", e.target.value)}
                  placeholder="e.g. 100,000 - 150,000"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
