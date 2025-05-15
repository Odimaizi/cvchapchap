"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Check, CreditCard, AlertCircle } from "lucide-react"

export default function CheckoutPage({ params }: { params: { plan: string } }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  const planDetails = {
    premium: {
      name: "Premium Plan",
      price: 15,
      features: [
        "10 cover letters/month",
        "5 resumes/month",
        "ATS Optimizer",
        "Interview Prep",
        "Job Board (public + private jobs)",
      ],
    },
    professional: {
      name: "Professional Plan",
      price: 25,
      features: [
        "Unlimited cover letters",
        "Unlimited resumes",
        "ATS Optimizer",
        "Interview Prep",
        "Job Board (all listings)",
      ],
    },
  }

  const plan = params.plan as "premium" | "professional"

  if (!planDetails[plan]) {
    router.push("/pricing")
    return null
  }

  const handleSubscribe = async () => {
    setIsProcessing(true)
    setPaymentError("")

    try {
      // In a real app, this would integrate with a payment processor
      // For now, we'll simulate a successful subscription
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user's subscription in the database
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { error } = await supabase.from("subscriptions").upsert({
          user_id: session.user.id,
          plan_type: plan,
          active: true,
          start_date: new Date().toISOString(),
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })

        if (error) {
          throw new Error("Failed to update subscription")
        }
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Subscription error:", error)
      setPaymentError("Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Complete Your Subscription</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your payment details to subscribe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg flex items-center mb-4">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {paymentError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Smith" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input id="card" placeholder="4242 4242 4242 4242" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubscribe} disabled={isProcessing}>
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" /> Subscribe Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{planDetails[plan].name}</CardTitle>
              <CardDescription>Monthly subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">${planDetails[plan].price}/month</div>

              <Separator />

              <div className="space-y-2">
                {planDetails[plan].features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
