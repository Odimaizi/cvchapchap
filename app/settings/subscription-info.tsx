"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SubscriptionInfo() {
  const isSubscribed = false // This would typically come from your user data

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubscribed ? (
            <>
              <p className="font-semibold">Monthly Subscription</p>
              <p>KSh 500 per month</p>
              <Button className="mt-4" variant="outline">
                Manage Subscription
              </Button>
            </>
          ) : (
            <>
              <p className="font-semibold">Free Plan</p>
              <p>1 free cover letter</p>
              <Button className="mt-4">Upgrade to Premium</Button>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Choose the plan that works for you</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Free: 1 cover letter</li>
            <li>Per Resume: KSh 300</li>
            <li>Monthly Subscription: KSh 500 (unlimited resumes and cover letters)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
