"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const handleImageUpload = async (file: File, updateFunction: (url: string) => void) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "your_cloudinary_upload_preset")

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  )

  const data = await response.json()
  updateFunction(data.secure_url)
}

export default function ContentManagement() {
  const [heroImage, setHeroImage] = useState(
    "https://www.pexels.com/photo/man-in-black-dress-shirt-sitting-on-chair-in-front-of-laptop-computer-5922405/",
  )
  const [featureIcons, setFeatureIcons] = useState(["", "", "", "", "", ""])
  const [testimonialImages, setTestimonialImages] = useState(["", "", ""])
  const [links, setLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
  })

  const handleFeatureIconChange = (index: number, value: string) => {
    const newFeatureIcons = [...featureIcons]
    newFeatureIcons[index] = value
    setFeatureIcons(newFeatureIcons)
  }

  const handleTestimonialImageChange = (index: number, value: string) => {
    const newTestimonialImages = [...testimonialImages]
    newTestimonialImages[index] = value
    setTestimonialImages(newTestimonialImages)
  }

  const handleLinkChange = (key: string, value: string) => {
    setLinks((prevLinks) => ({ ...prevLinks, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend API
    console.log({ heroImage, featureIcons, testimonialImages, links })
    // Implement API call to save changes
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Hero Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Image</Label>
              <Input
                id="heroImage"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, setHeroImage)
                }}
              />
              {heroImage && <img src={heroImage || "/placeholder.svg"} alt="Hero" className="mt-2 max-w-xs" />}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Feature Icons</CardTitle>
          </CardHeader>
          <CardContent>
            {featureIcons.map((icon, index) => (
              <div key={index} className="space-y-2 mb-4">
                <Label htmlFor={`featureIcon${index}`}>Feature Icon {index + 1}</Label>
                <Input
                  id={`featureIcon${index}`}
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, (url) => handleFeatureIconChange(index, url))
                  }}
                />
                {icon && (
                  <img src={icon || "/placeholder.svg"} alt={`Feature ${index + 1}`} className="mt-2 max-w-xs" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Testimonial Images</CardTitle>
          </CardHeader>
          <CardContent>
            {testimonialImages.map((image, index) => (
              <div key={index} className="space-y-2 mb-4">
                <Label htmlFor={`testimonialImage${index}`}>Testimonial Image {index + 1}</Label>
                <Input
                  id={`testimonialImage${index}`}
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, (url) => handleTestimonialImageChange(index, url))
                  }}
                />
                {image && (
                  <img src={image || "/placeholder.svg"} alt={`Testimonial ${index + 1}`} className="mt-2 max-w-xs" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(links).map(([key, value]) => (
              <div key={key} className="space-y-2 mb-4">
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)} URL</Label>
                <Input
                  id={key}
                  value={value}
                  onChange={(e) => handleLinkChange(key, e.target.value)}
                  placeholder={`https://www.${key}.com/your-profile`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}
