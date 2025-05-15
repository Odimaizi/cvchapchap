"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const DEFAULT_TEMPLATES = [
  { id: "modern", name: "Modern", image: "/templates/modern.jpg" },
  { id: "classic", name: "Classic", image: "/templates/classic.jpg" },
  { id: "creative", name: "Creative", image: "/templates/creative.jpg" },
]

export function TemplateSelector({ onSelect }) {
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    onSelect(template)
  }

  const handleTemplateUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newTemplate = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          image: e.target.result,
          html: e.target.result,
        }
        setTemplates([...templates, newTemplate])
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all ${
              selectedTemplate?.id === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={template.image || "/placeholder.svg"}
                alt={template.name}
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-md"
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="file"
          accept=".html,.htm"
          onChange={handleTemplateUpload}
          className="hidden"
          id="template-upload"
        />
        <Button asChild>
          <label htmlFor="template-upload">Upload Custom Template</label>
        </Button>
      </div>
    </div>
  )
}
