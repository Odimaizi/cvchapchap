"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function PaymentButton({ amount, currency = "USD" }) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Intasend checkout page
        window.location.href = data.checkout_url
      } else {
        console.error("Payment creation failed:", data.error)
        alert("Payment creation failed. Please try again.")
      }
    } catch (error) {
      console.error("Error creating payment:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading}>
      {isLoading ? "Processing..." : `Pay ${amount} ${currency}`}
    </Button>
  )
}
