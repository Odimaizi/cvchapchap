"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlusCircle, MinusCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const TEMPLATES = [
  { id: "template1", name: "Modern", image: "/templates/modern.png" },
  { id: "template2", name: "Classic", image: "/templates/classic.png" },
  { id: "template3", name: "Creative", image: "/templates/creative.png" },
]

export function ResumeBuilder() {
  const [experiences, setExperiences] = useState([{ id: 1 }])
  const [education, setEducation] = useState([{ id: 1 }])
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id)
  const [atsOptimize, setAtsOptimize] = useState(true)

  const addExperience = () => {
    setExperiences([...experiences, { id: experiences.length + 1 }])
  }

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const addEducation = () => {
    setEducation([...education, { id: education.length + 1 }])
  }

  const removeEducation = (id: number) => {
    setEducation(education.filter((edu) => edu.id !== id))
  }

  return (
    <form className="space-y-6">
      <Accordion type="single" collapsible defaultValue="personal">
        <AccordionItem value="template">
          <AccordionTrigger>Choose Template</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="grid grid-cols-3 gap-4">
              {TEMPLATES.map((template) => (
                <div key={template.id}>
                  <RadioGroupItem value={template.id} id={template.id} className="sr-only" />
                  <Label
                    htmlFor={template.id}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <img
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      className="mb-2 w-full h-auto"
                    />
                    {template.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="personal">
          <AccordionTrigger>Personal Information</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input id="title" name="title" placeholder="e.g., Kickass Lawyer" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="City, Country" required />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Work Experience</AccordionTrigger>
          <AccordionContent>
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Experience {exp.id}</h4>
                  {experiences.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input name={`company-${exp.id}`} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input name={`position-${exp.id}`} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="month" name={`start-${exp.id}`} required />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="month" name={`end-${exp.id}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name={`description-${exp.id}`} required />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full mt-4" onClick={addExperience}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger>Education</AccordionTrigger>
          <AccordionContent>
            {education.map((edu) => (
              <div key={edu.id} className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Education {edu.id}</h4>
                  {education.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input name={`institution-${edu.id}`} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input name={`degree-${edu.id}`} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="month" name={`edu-start-${edu.id}`} required />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="month" name={`edu-end-${edu.id}`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full mt-4" onClick={addEducation}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills">
          <AccordionTrigger>Skills</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Label htmlFor="skills">Professional Skills</Label>
              <Textarea id="skills" name="skills" placeholder="Enter your skills, separated by commas" required />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ats">
          <AccordionTrigger>ATS Optimization</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ats"
                checked={atsOptimize}
                onCheckedChange={(checked) => setAtsOptimize(checked as boolean)}
              />
              <Label htmlFor="ats">Optimize resume for Applicant Tracking Systems (ATS)</Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This will ensure your resume is easily readable by ATS software used by many employers.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button type="submit" className="w-full">
        Generate Resume
      </Button>
    </form>
  )
}
