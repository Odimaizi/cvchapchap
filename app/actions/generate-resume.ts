"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateResume(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const experience = formData.get("experience") as string
  const education = formData.get("education") as string
  const skills = formData.get("skills") as string

  const prompt = `
    Create a professional resume and cover letter for the following person. 
    Format the response in two clear sections with "RESUME:" and "COVER LETTER:" headers.

    Person's Information:
    - Name: ${name}
    - Email: ${email}
    - Phone: ${phone}
    - Work Experience: ${experience}
    - Education: ${education}
    - Skills: ${skills}

    For the resume:
    - Use clear sections for Experience, Education, and Skills
    - Be concise and highlight achievements
    - Use bullet points for better readability

    For the cover letter:
    - Keep it to one page
    - Highlight key achievements from the resume
    - Make it engaging and professional
    - End with a call to action

    Start with "RESUME:" and then "COVER LETTER:" for clear separation.
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1000,
    })

    return text
  } catch (error) {
    console.error("Error generating resume:", error)
    return "An error occurred while generating the resume and cover letter. Please try again."
  }
}
