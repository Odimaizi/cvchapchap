import { NextResponse } from "next/server"

const INTASEND_API_KEY = process.env.INTASEND_API_KEY
const INTASEND_PUBLISHABLE_KEY = process.env.INTASEND_PUBLISHABLE_KEY

export async function POST(req: Request) {
  const { amount, currency } = await req.json()

  if (!amount || !currency) {
    return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 })
  }

  try {
    const response = await fetch("https://sandbox.intasend.com/api/v1/checkout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${INTASEND_API_KEY}`,
      },
      body: JSON.stringify({
        public_key: INTASEND_PUBLISHABLE_KEY,
        amount: amount,
        currency: currency,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: data.message || "Payment creation failed" }, { status: response.status })
    }
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
