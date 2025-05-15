"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function AdminDashboard() {
  const [apiKey, setApiKey] = useState("")
  const [templateName, setTemplateName] = useState("")
  const [templateHtml, setTemplateHtml] = useState("")
  const [templateCss, setTemplateCss] = useState("")

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("API Key submitted:", apiKey)
  }

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Template submitted:", { templateName, templateHtml, templateCss })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="api-keys">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>Manage API Keys</CardTitle>
              <CardDescription>Add or update API keys for various services</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApiKeySubmit}>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API key"
                  />
                </div>
                <Button type="submit" className="mt-4">
                  Save API Key
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Manage Templates</CardTitle>
              <CardDescription>Add or edit CV and resume templates</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTemplateSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="template-html">HTML</Label>
                  <Textarea
                    id="template-html"
                    value={templateHtml}
                    onChange={(e) => setTemplateHtml(e.target.value)}
                    placeholder="Enter template HTML"
                    rows={10}
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="template-css">CSS</Label>
                  <Textarea
                    id="template-css"
                    value={templateCss}
                    onChange={(e) => setTemplateCss(e.target.value)}
                    placeholder="Enter template CSS"
                    rows={10}
                  />
                </div>
                <Button type="submit" className="mt-4">
                  Save Template
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Manage Integrations</CardTitle>
              <CardDescription>Configure integrations with other services</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add integration management UI here */}
              <p>Integration management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
