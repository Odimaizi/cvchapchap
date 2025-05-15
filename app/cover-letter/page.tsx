"use client"
import { useSubscription } from "@/contexts/subscription-context"
import { CoverLetterBuilder } from "./cover-letter-builder"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CoverLetterPage() {
  const { plan, usage, canCreateCoverLetter } = useSubscription()

  if (!canCreateCoverLetter()) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Cover Letter Limit Reached</CardTitle>
            <CardDescription>
              {plan === "free"
                ? "You've used all 5 of your free cover letters"
                : "You've reached your monthly limit of 10 cover letters"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {plan === "free"
                ? "Upgrade to our Premium plan to get 10 cover letters per month, or to our Professional plan for unlimited cover letters."
                : "Upgrade to our Professional plan for unlimited cover letters."}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Create a Cover Letter</h1>
      <p className="text-lg mb-8">
        Craft a compelling cover letter that complements your resume and highlights your qualifications.
      </p>

      {plan === "free" && (
        <div className="bg-muted p-4 rounded-lg mb-8">
          <p className="text-sm">You have used {usage.coverLettersUsed} of 5 free cover letters.</p>
        </div>
      )}

      {plan === "premium" && (
        <div className="bg-muted p-4 rounded-lg mb-8">
          <p className="text-sm">You have used {usage.coverLettersUsed} of 10 monthly cover letters.</p>
        </div>
      )}

      <CoverLetterBuilder />
    </div>
  )
}
