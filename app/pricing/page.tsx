"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"

const plans = [
  {
    name: "Free Plan",
    price: "0",
    description: "Get started with basic features",
    features: [
      { name: "5 free cover letters", included: true },
      { name: "Resumes ($5 each)", included: true },
      { name: "ATS Optimizer", included: false },
      { name: "Interview Prep", included: false },
      { name: "Job Board (public jobs only)", included: true },
    ],
    ctaText: "Get Started",
    href: "/dashboard/free",
  },
  {
    name: "Premium",
    price: "15",
    description: "Perfect for job seekers",
    features: [
      { name: "10 cover letters/month", included: true },
      { name: "5 resumes/month", included: true },
      { name: "ATS Optimizer", included: true },
      { name: "Interview Prep", included: true },
      { name: "Job Board (public + private jobs)", included: true },
    ],
    ctaText: "Subscribe",
    href: "/checkout/premium",
  },
  {
    name: "Professional",
    price: "25",
    description: "Unlimited access to all features",
    features: [
      { name: "Unlimited cover letters", included: true },
      { name: "Unlimited resumes", included: true },
      { name: "ATS Optimizer", included: true },
      { name: "Interview Prep", included: true },
      { name: "Job Board (all listings)", included: true },
    ],
    ctaText: "Subscribe",
    href: "/checkout/professional",
  },
]

export default function PricingPage() {
  const router = useRouter()

  const handlePlanSelection = (href: string) => {
    router.push(href)
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your needs. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-3xl font-bold mb-6">
                ${plan.price}
                {plan.price !== "0" && <span className="text-base font-normal text-muted-foreground">/month</span>}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handlePlanSelection(plan.href)}
                variant={plan.name === "Professional" ? "default" : plan.name === "Premium" ? "default" : "outline"}
              >
                {plan.ctaText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>All plans include access to our community support and basic job search features.</p>
        <p className="mt-2">
          Need a custom plan for your organization?{" "}
          <a href="/contact" className="underline">
            Contact us
          </a>
          .
        </p>
      </div>
    </div>
  )
}
