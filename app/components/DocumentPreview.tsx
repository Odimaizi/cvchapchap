"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

interface DocumentPreviewProps {
  content: string
}

export function DocumentPreview({ content }: DocumentPreviewProps) {
  const downloadDocument = () => {
    // Create a blob from the content
    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume-and-cover-letter.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Split content into resume and cover letter sections
  const [resume, coverLetter] = content.split("COVER LETTER:")

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={downloadDocument} className="gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap font-mono text-sm">{resume}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap font-mono text-sm">
              {coverLetter || "Cover letter will appear here"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
