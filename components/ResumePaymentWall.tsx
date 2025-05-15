"use client"

import { useState } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Check, AlertCircle } from "lucide-react"
import Link from "next/link"

interface ResumePaymentWallProps {
  onPaymentComplete: () => void
}

export function ResumePaymentWall({ onPaymentComplete }: ResumePaymentWallProps) {
  const { plan } = useSubscription()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentError("")

    try {
      // In a real app, this would integrate with a payment processor
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Call the callback to continue
      onPaymentComplete()
    } catch (error) {
      setPaymentError("Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Resume Creation</CardTitle>
          <CardDescription>
            {plan === "free" ? "Pay per resume on the Free plan" : "You've reached your monthly limit"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Resume Creation</span>
              <span className="font-bold">$5.00</span>
            </div>
            <p className="text-sm text-muted-foreground">Create a professional resume with our AI-powered tools</p>
          </div>

          {paymentError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {paymentError}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Professional templates</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>AI-powered content suggestions</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>PDF and Word downloads</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" /> Pay $5.00
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Want unlimited resumes?</p>
            <Link href="/pricing" className="underline">
              Upgrade to Premium or Professional
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
