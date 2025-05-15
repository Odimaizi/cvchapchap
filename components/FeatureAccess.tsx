"use client"

import type { ReactNode } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"

interface FeatureAccessProps {
  feature: "ats" | "interview" | "private-jobs"
  children: ReactNode
  title: string
  description: string
}

export function FeatureAccess({ feature, children, title, description }: FeatureAccessProps) {
  const { hasAccessTo, plan } = useSubscription()

  const hasAccess = hasAccessTo(feature)

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-muted rounded-full p-3">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-center">{title} is a Premium Feature</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Upgrade to our Premium or Professional plan to access this feature and many more.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/pricing">View Pricing Plans</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
