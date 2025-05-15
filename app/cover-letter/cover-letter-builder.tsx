"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function CoverLetterBuilder() {
  return (
    <form className="space-y-6">
      <Accordion type="single" collapsible defaultValue="job">
        <AccordionItem value="job">
          <AccordionTrigger>Job Details</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" name="company" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" name="position" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Paste the job description here"
                  required
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="personal">
          <AccordionTrigger>Personal Information</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
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
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Relevant Experience</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Label htmlFor="relevantExperience">Key Achievements & Experience</Label>
              <Textarea
                id="relevantExperience"
                name="relevantExperience"
                placeholder="Describe your relevant experience and achievements"
                required
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="customization">
          <AccordionTrigger>Customization</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Writing Tone</Label>
                <select id="tone" name="tone" className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="professional">Professional</option>
                  <option value="confident">Confident</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emphasis">Key Points to Emphasize</Label>
                <Textarea
                  id="emphasis"
                  name="emphasis"
                  placeholder="What specific points would you like to emphasize?"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button type="submit" className="w-full">
        Generate Cover Letter
      </Button>
    </form>
  )
}
