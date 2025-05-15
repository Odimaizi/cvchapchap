"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Perform logout logic here (e.g., clear session, remove tokens)
      // This is a placeholder for the actual logout API call
      await fetch("/api/logout", { method: "POST" })

      // Redirect to the external homepage
      window.location.href = "https://oscars-cv-chap-chap.webflow.io/"
    } catch (error) {
      console.error("Logout failed:", error)
      // Handle logout error (e.g., show an error message to the user)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  )
}
