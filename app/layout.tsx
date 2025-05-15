import type React from "react"
import { Providers } from "./providers"
import { TopNavigation } from "@/components/TopNavigation"
import "./globals.css"

export const metadata = {
  title: "CV Chap Chap - Professional Resume Builder",
  description: "Create professional resumes and cover letters with AI assistance",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <TopNavigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
