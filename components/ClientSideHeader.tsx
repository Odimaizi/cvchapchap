"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ClientSideHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link className="flex items-center justify-center" href="/">
          <Image src="/logo.png" alt="CV Chap Logo" width={120} height={40} />
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-primary" href="#testimonials">
            Testimonials
          </Link>
          <Link className="text-sm font-medium hover:text-primary" href="#about">
            About
          </Link>
        </nav>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
