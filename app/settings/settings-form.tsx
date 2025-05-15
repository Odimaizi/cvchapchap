"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

export function SettingsForm() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [notifications, setNotifications] = useState(true)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically call an API to update user settings
    console.log("Updating settings:", { name, email, notifications })
  }

  const handleLogout = () => {
    // Here you would typically call an API to log out the user
    console.log("Logging out")
    // After logout, redirect to the home page
    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
        <Label htmlFor="notifications">Receive email notifications</Label>
      </div>
      <Button type="submit" className="w-full">
        Save Changes
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={handleLogout}>
        Log Out
      </Button>
    </form>
  )
}
