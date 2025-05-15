import type { Metadata } from "next"
import ResumeLandingPage from "./ResumeClient"

export const metadata: Metadata = {
  title: "AI-Powered Resume Builder | CV Chap",
  description:
    "Create a professional, ATS-optimized resume tailored for the Kenyan job market with our AI-powered resume builder.",
}

export default function ResumePage() {
  return <ResumeLandingPage />
}
