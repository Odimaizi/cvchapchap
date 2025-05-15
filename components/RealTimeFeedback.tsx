"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeedbackItem {
  type: "suggestion" | "warning" | "error"
  message: string
}

interface RealTimeFeedbackProps {
  content: string
}

export function RealTimeFeedback({ content }: RealTimeFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])

  useEffect(() => {
    // This is a placeholder for the actual AI-powered analysis
    // In a real implementation, you would call an API to get the feedback
    const dummyAnalysis = () => {
      const newFeedback: FeedbackItem[] = []
      if (content.length < 100) {
        newFeedback.push({
          type: "suggestion",
          message: "Consider adding more content to make your document more comprehensive.",
        })
      }
      if (!content.includes("experience")) {
        newFeedback.push({
          type: "warning",
          message:
            "You haven't mentioned your work experience. This is usually an important part of a resume or cover letter.",
        })
      }
      if (content.includes("Lorem ipsum")) {
        newFeedback.push({
          type: "error",
          message: "Remove placeholder text before finalizing your document.",
        })
      }
      setFeedback(newFeedback)
    }

    const debounce = setTimeout(() => {
      dummyAnalysis()
    }, 500)

    return () => clearTimeout(debounce)
  }, [content])

  if (feedback.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {feedback.map((item, index) => (
            <li
              key={index}
              className={`text-${item.type === "error" ? "red" : item.type === "warning" ? "yellow" : "blue"}-500`}
            >
              {item.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
