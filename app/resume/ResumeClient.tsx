"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResumeLandingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">AI-Powered Resume Builder</h1>
      <p className="text-xl mb-8">Create a professional, ATS-optimized resume tailored for the Kenyan job market.</p>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>AI-powered content suggestions</li>
              <li>ATS-friendly templates</li>
              <li>Customizable designs</li>
              <li>Industry-specific keyword optimization</li>
              <li>Easy-to-use interface</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Our Resume Builder?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our AI-powered resume builder is specifically designed for the Kenyan job market. It helps you create a
              standout resume that highlights your skills and experiences in a way that appeals to both human recruiters
              and Applicant Tracking Systems.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/resume/templates">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}
