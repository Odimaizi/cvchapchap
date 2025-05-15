import { FeatureAccess } from "@/components/FeatureAccess"
import { InterviewPrepClient } from "./interview-prep-client"

export default function InterviewPrepPage() {
  return (
    <FeatureAccess
      feature="interview"
      title="Interview Preparation"
      description="Practice for your interviews with AI-powered mock interviews and feedback."
    >
      <InterviewPrepClient />
    </FeatureAccess>
  )
}
