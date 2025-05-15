"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PDFTemplate {
  id: string
  name: string
  url: string
}

export function PDFTemplateSelector({ onSelectTemplate }: { onSelectTemplate: (template: PDFTemplate) => void }) {
  const [templates, setTemplates] = useState<PDFTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchTemplates() {
      try {
        console.log("Fetching templates...")
        const { data, error } = await supabase.storage.from("pdf-templates").list()

        if (error) {
          console.error("Error fetching templates:", error)
          throw new Error("Error fetching templates")
        }

        console.log("Templates fetched:", data)

        if (!data || data.length === 0) {
          console.log("No templates found in the bucket")
          setTemplates([])
          setLoading(false)
          return
        }

        const templatesData = await Promise.all(
          data.map(async (file) => {
            const {
              data: { publicUrl },
              error,
            } = supabase.storage.from("pdf-templates").getPublicUrl(file.name)

            if (error) {
              console.error(`Error getting public URL for ${file.name}:`, error)
              throw new Error(`Error getting public URL for ${file.name}`)
            }

            console.log(`Public URL for ${file.name}:`, publicUrl)

            return {
              id: file.id,
              name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              url: publicUrl,
            }
          }),
        )

        console.log("Processed templates:", templatesData)
        setTemplates(templatesData)
      } catch (err) {
        console.error("Error in fetchTemplates:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [supabase])

  if (loading) return <div>Loading templates...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.length === 0 ? (
        <div>No templates found. Please check your Supabase storage.</div>
      ) : (
        templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-3 aspect-h-4 mb-4">
                <Image
                  src={template.url || "/placeholder.svg"}
                  alt={template.name}
                  width={300}
                  height={400}
                  className="rounded-md object-cover"
                />
              </div>
              <Button onClick={() => onSelectTemplate(template)} className="w-full">
                Select Template
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
