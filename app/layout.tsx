import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CV Chap - AI Resume & Cover Letter Generator",
  description: "Generate professional resumes and cover letters using AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header>
              <nav>{/* Add your navigation menu here with proper ARIA labels */}</nav>
            </header>
            <main className="flex-1" id="main-content">
              <a href="#main-content" className="sr-only focus:not-sr-only">
                Skip to main content
              </a>
              {children}
            </main>
            <footer>{/* Add your footer content here */}</footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
