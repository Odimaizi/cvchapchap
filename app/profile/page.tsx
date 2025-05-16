import { ProfileClient } from "./profile-client"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Profile Management</h1>
      <p className="text-muted-foreground mb-8">
        Complete your profile to improve your CV score and job matches. Your profile information will be used to
        personalize your experience and provide better recommendations.
      </p>
      <ProfileClient />
    </div>
  )
}
