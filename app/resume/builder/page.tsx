import type { Metadata } from "next"
import ResumeBuilder from "./ResumeBuilder"

export const metadata: Metadata = {
  title: "Resume Builder | CV Chap",
  description: "Create a professional resume with our interactive resume builder.",
}

export default function ResumeBuilderPage() {
  return <ResumeBuilder />
}
