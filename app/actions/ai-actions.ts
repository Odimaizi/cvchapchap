"use server"

import { generateText } from "ai"
import { gemini } from "@ai-sdk/gemini"

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
    Keep the response concise, professional, and tailored to the specific section.
    
    For skills, provide a comma-separated list of relevant skills.
    For achievements, provide bullet points (one per line).
    For work descriptions, focus on impact and quantifiable results.
    
    Respond only with the content to be used in the resume, without any explanations or additional text.
  `

  try {
    const { text } = await generateText({
      model: gemini("gemini-1.5-flash"),
      prompt: aiPrompt + context,
      temperature: 0.7,
      maxTokens: 500,
    })

    return text
  } catch (error) {
    console.error("Error generating AI content:", error)
    throw new Error("Failed to generate AI content")
  }
}

export async function analyzeResume(resumeData: any) {
  const prompt = `
    Analyze this resume data and provide a score out of 100 along with 3-5 specific improvement suggestions.
    Focus on content quality, formatting, and impact. Be specific and actionable in your suggestions.
    
    Resume data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Format your response as JSON with the following structure:
    {
      "score": number,
      "suggestions": string[]
    }
  `

  try {
    const { text } = await generateText({
      model: gemini("gemini-1.5-flash"),
      prompt,
      temperature: 0.3,
      maxTokens: 1000,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error analyzing resume:", error)
    throw new Error("Failed to analyze resume")
  }
}

export async function generateJobMatches(resumeData: any, count = 5) {
  const prompt = `
    Based on this resume data, suggest ${count} job titles that would be a good match for this candidate.
    For each job title, provide a brief explanation of why it's a good match based on the skills and experience.
    
    Resume data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Format your response as JSON with the following structure:
    [
      {
        "title": string,
        "reason": string
      }
    ]
  `

  try {
    const { text } = await generateText({
      model: gemini("gemini-1.5-flash"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating job matches:", error)
    throw new Error("Failed to generate job matches")
  }
}
