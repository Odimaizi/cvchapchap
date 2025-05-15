"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateAIContent(section: string, prompt: string, data: any) {
  const context = `
    Resume data:
    ${JSON.stringify(data, null, 2)}

    Section: ${section}
    User prompt: ${prompt}
  `

  const aiPrompt = `
    You are an AI assistant helping to generate content for a resume. 
    Based on the provided resume data, section, and user prompt, generate appropriate content.
    Keep the response concise and professional.
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: aiPrompt + context,
      temperature: 0.7,
      max_tokens: 150,
    })

    return text
  } catch (error) {
    console.error("Error generating AI content:", error)
    throw new Error("Failed to generate AI content")
  }
}
