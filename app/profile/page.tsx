import { ProfileClient } from "./profile-client"
import { FeatureAccess } from "@/components/FeatureAccess"

export default function ProfilePage() {
  return (
    <FeatureAccess
      feature="ats"
      title="Profile Management"
      description="Create and manage your professional profile to improve your CV score and job matches."
    >
      <ProfileClient />
    </FeatureAccess>
  )
}
