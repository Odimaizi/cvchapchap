"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { SubscriptionProvider } from "@/contexts/subscription-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SubscriptionProvider>{children}</SubscriptionProvider>
    </ThemeProvider>
  )
}
