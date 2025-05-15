"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AdminDashboard() {
  const [apiKey, setApiKey] = useState("")
  const [templateName, setTemplateName] = useState("")
  const [templateHtml, setTemplateHtml] = useState("")
  const [templateCss, setTemplateCss] = useState("")

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("API Key submitted:", apiKey)
    // Implement API key management logic here
  }

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Template submitted:", { templateName, templateHtml, templateCss })
    // Implement template management logic here
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Implement user management UI here */}
              <p>User management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>Manage API Keys</CardTitle>
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
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Implement analytics UI here */}
              <p>Analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
