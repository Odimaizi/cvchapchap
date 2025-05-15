import { FeatureAccess } from "@/components/FeatureAccess"
import { ATSOptimizer } from "./ats-optimizer"

export default function ATSOptimizationPage() {
  return (
    <FeatureAccess
      feature="ats"
      title="ATS Optimization"
      description="Optimize your resume to pass through Applicant Tracking Systems."
    >
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">ATS Resume Optimization</h1>
        <p className="text-lg mb-8">
          Optimize your resume to ensure it passes through Applicant Tracking Systems (ATS) and reaches human
          recruiters.
        </p>
        <ATSOptimizer />
      </div>
    </FeatureAccess>
  )
}
