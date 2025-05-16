"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Loader2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function ResumeTemplates() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("resume_templates").select("*")

        if (error) {
          throw error
        }

        console.log("Fetched templates:", data)
        setTemplates(data || [])
        setFilteredTemplates(data || [])
      } catch (error) {
        console.error("Error fetching templates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [supabase])

  useEffect(() => {
    // Filter templates based on search query and active category
    let filtered = templates

    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((template) => template.category === activeCategory)
    }

    setFilteredTemplates(filtered)
  }, [searchQuery, activeCategory, templates])

  const handleTemplateSelect = (templateId) => {
    router.push(`/resume/builder?template=${templateId}`)
  }

  const categories = ["all", "professional", "creative", "minimal", "technical", "academic"]

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Resume Templates</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" /> Filter Options
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img
                  src={template.thumbnail_url || "/placeholder.svg?height=400&width=300&text=" + template.name}
                  alt={template.name}
                  className="object-cover w-full h-full"
                />
                {template.is_premium && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    Premium
                  </Badge>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" className="absolute top-2 left-2">
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh]">
                    <div className="h-full overflow-auto p-4">
                      <div dangerouslySetInnerHTML={{ __html: template.html_content }} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <CardContent className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <Button onClick={() => handleTemplateSelect(template.id)} className="w-full">
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
