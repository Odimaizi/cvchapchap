"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_api_key || "")

interface CoverLetterData {
  fullName: string
  email: string
  phone: string
  company: string
  position: string
  jobDescription: string
  relevantExperience: string
  tone: string
  emphasis: string
}

export async function generateCoverLetter(data: CoverLetterData): Promise<string> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Construct the prompt
    const prompt = `
      Create a professional cover letter with the following details:
      
      Applicant Information:
      - Name: ${data.fullName}
      - Email: ${data.email}
      - Phone: ${data.phone}
      
      Job Details:
      - Company: ${data.company}
      - Position: ${data.position}
      - Job Description: ${data.jobDescription}
      
      Applicant Experience:
      ${data.relevantExperience}
      
      Customization:
      - Tone: ${data.tone}
      ${data.emphasis ? `- Points to Emphasize: ${data.emphasis}` : ""}
      
      Format the cover letter professionally with proper spacing and paragraphs. Include today's date, recipient information, greeting, body paragraphs, closing, and signature.
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error("Error generating cover letter:", error)
    throw new Error("Failed to generate cover letter. Please try again.")
  }
}
