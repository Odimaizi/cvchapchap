import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ResumeBuilder } from "./ResumeBuilder"

async function getTemplates(supabase) {
  const { data: templates, error } = await supabase
    .from("resume_templates")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching templates:", error)
    return []
  }

  return templates
}

async function getUserResume(supabase, userId) {
  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user resume:", error)
    return null
  }

  return data
}

export default async function ResumeBuilderPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login?redirect=/resume/builder")
  }

  const templates = await getTemplates(supabase)
  const resumeData = await getUserResume(supabase, session.user.id)

  const saveResume = async (data, templateId) => {
    "use server"

    const supabase = createServerComponentClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error("Not authenticated")
    }

    const resumeToSave = {
      user_id: session.user.id,
      template_id: templateId,
      resume_data: data,
      updated_at: new Date().toISOString(),
    }

    if (resumeData?.id) {
      // Update existing resume
      const { error } = await supabase.from("resumes").update(resumeToSave).eq("id", resumeData.id)

      if (error) {
        console.error("Error updating resume:", error)
        throw new Error("Failed to update resume")
      }
    } else {
      // Create new resume
      const { error } = await supabase.from("resumes").insert({
        ...resumeToSave,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error creating resume:", error)
        throw new Error("Failed to create resume")
      }
    }

    return true
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Resume Builder</h1>
      <ResumeBuilder initialData={resumeData?.resume_data} templates={templates} onSave={saveResume} />
    </div>
  )
}

// "use client"

// import { useState, useEffect } from "react"
// import { useSearchParams } from "next/navigation"
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ResumeForm } from "./ResumeForm"
// import { ResumePreview } from "./ResumePreview"
// import { Loader2, Save, Download } from 'lucide-react'
// import { useToast } from "@/components/ui/use-toast"
// import { ResumePaymentWall } from "@/components/ResumePaymentWall"
// import { useSubscription } from "@/contexts/subscription-context"
// import { AIAssistant } from "./AIAssistant"

// export default function ResumeBuilder() {
//   const searchParams = useSearchParams()
//   const templateId = searchParams.get("template")
//   const supabase = createClientComponentClient()
//   const { toast } = useToast()
//   const { plan, usage } = useSubscription()

//   const [loading, setLoading] = useState(true)
//   const [template, setTemplate] = useState(null)
//   const [activeTab, setActiveTab] = useState("personal")
//   const [showPaymentWall, setShowPaymentWall] = useState(false)
//   const [aiSuggesting, setAiSuggesting] = useState(false)
//   const [resumeData, setResumeData] = useState({
//     personal: {
//       fullName: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       city: "",
//       county: "",
//       postcode: "",
//       tagline: "",
//       professionalSummary: "",
//     },
//     workExperience: [
//       {
//         jobTitle: "",
//         employer: "",
//         location: "",
//         startDate: "",
//         endDate: "",
//         description: "",
//         achievements: "",
//       },
//     ],
//     education: [
//       {
//         institution: "",
//         location: "",
//         degree: "",
//         fieldOfStudy: "",
//         graduationDate: "",
//         description: "",
//       },
//     ],
//     skills: ["", "", ""],
//     achievements: ["", "", ""],
//     references: [
//       {
//         name: "",
//         position: "",
//         company: "",
//         phone: "",
//         email: "",
//       },
//     ],
//     additionalSections: {
//       certifications: "",
//       languages: "",
//       websites: "",
//       software: "",
//       accomplishments: "",
//       additionalInfo: "",
//       affiliations: "",
//       interests: "",
//     },
//   })

//   useEffect(() => {
//     const fetchTemplate = async () => {
//       if (!templateId) {
//         // Redirect to templates page if no template ID is provided
//         window.location.href = "/resume/templates"
//         return
//       }

//       try {
//         setLoading(true)
//         console.log("Fetching template with ID:", templateId)

//         // Fetch template from Supabase
//         const { data, error } = await supabase.from("resume_templates").select("*").eq("id", templateId).single()

//         if (error) {
//           console.error("Error fetching template:", error)
//           throw error
//         }

//         console.log("Fetched template:", data)

//         if (data) {
//           setTemplate(data)
//         } else {
//           toast({
//             title: "Template not found",
//             description: "The requested template could not be found.",
//             variant: "destructive",
//           })
//           // Redirect to templates page
//           window.location.href = "/resume/templates"
//         }
//       } catch (error) {
//         console.error("Error fetching template:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load template. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchTemplate()
//   }, [templateId, supabase, toast])

//   const handleResumeDataChange = (newData) => {
//     setResumeData(newData)
//   }

//   const handleExportClick = () => {
//     // Check if user needs to pay
//     if (plan === "free" || (plan === "premium" && usage.resumesUsed >= usage.resumesLimit)) {
//       setShowPaymentWall(true)
//     } else {
//       // Process export directly
//       handleExport()
//     }
//   }

//   const handleExport = async () => {
//     try {
//       // Get current user
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (!session) {
//         toast({
//           title: "Authentication required",
//           description: "Please log in to save your resume.",
//           variant: "destructive",
//         })
//         return
//       }

//       // Generate HTML content with placeholders replaced
//       const htmlContent = generateResumeHtml(template.html_content, resumeData)

//       // Save resume to database
//       const { data, error } = await supabase
//         .from("resumes")
//         .insert({
//           user_id: session.user.id,
//           template_id: template.id,
//           resume_data: resumeData,
//           html_content: htmlContent,
//           name: `Resume - ${new Date().toLocaleDateString()}`,
//         })
//         .select()

//       if (error) throw error

//       toast({
//         title: "Resume Saved",
//         description: "Your resume has been saved successfully.",
//       })

//       // Increment usage counter
//       await supabase.rpc("increment_resume_usage", { user_id: session.user.id })
//     } catch (error) {
//       console.error("Error saving resume:", error)
//       toast({
//         title: "Error",
//         description: "Failed to save resume. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const generateResumeHtml = (htmlTemplate, data) => {
//     let html = htmlTemplate

//     // Replace personal information placeholders
//     html = html.replace(/{FULL_NAME}/g, data.personal.fullName || "")
//     html = html.replace(/{NAME}/g, data.personal.firstName || "")
//     html = html.replace(/{SURNAME}/g, data.personal.lastName || "")
//     html = html.replace(/{TAGLINE}/g, data.personal.tagline || "")
//     html = html.replace(/{CITY}/g, data.personal.city || "")
//     html = html.replace(/{COUNTY}/g, data.personal.county || "")
//     html = html.replace(/{POSTCODE}/g, data.personal.postcode || "")
//     html = html.replace(/{PHONE}/g, data.personal.phone || "")
//     html = html.replace(/{EMAIL}/g, data.personal.email || "")
//     html = html.replace(/{PROFESSIONAL_SUMMARY}/g, data.personal.professionalSummary || "")

//     // Generate work experience HTML
//     let workExperienceHtml = ""
//     data.workExperience.forEach((exp, index) => {
//       workExperienceHtml += `
//         <div class="experience-item">
//           <div class="job-header">
//             <span class="job-title">${exp.jobTitle || ""}</span> at
//             <span class="employer">${exp.employer || ""}</span>
//             <span class="dates">${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
//           </div>
//           <div class="location">${exp.location || ""}</div>
//           <div class="description">${exp.description || ""}</div>
//           <div class="achievements">${exp.achievements || ""}</div>
//         </div>
//       `

//       // Replace individual work experience placeholders
//       html = html.replace(new RegExp(`{JOB_TITLE_${index + 1}}`, "g"), exp.jobTitle || "")
//       html = html.replace(new RegExp(`{EMPLOYER_${index + 1}}`, "g"), exp.employer || "")
//       html = html.replace(new RegExp(`{WORK_LOCATION_${index + 1}}`, "g"), exp.location || "")
//       html = html.replace(new RegExp(`{WORK_START_DATE_${index + 1}}`, "g"), exp.startDate || "")
//       html = html.replace(new RegExp(`{WORK_END_DATE_${index + 1}}`, "g"), exp.endDate || "Present")
//       html = html.replace(new RegExp(`{WORK_DESCRIPTION_${index + 1}}`, "g"), exp.description || "")
//       html = html.replace(new RegExp(`{WORK_ACHIEVEMENTS_${index + 1}}`, "g"), exp.achievements || "")
//       html = html.replace(
//         new RegExp(`{WORK_EXPERIENCE_${index + 1}}`, "g"),
//         `
//         <div class="experience-item">
//           <div class="job-header">
//             <span class="job-title">${exp.jobTitle || ""}</span> at
//             <span class="employer">${exp.employer || ""}</span>
//             <span class="dates">${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
//           </div>
//           <div class="location">${exp.location || ""}</div>
//           <div class="description">${exp.description || ""}</div>
//           <div class="achievements">${exp.achievements || ""}</div>
//         </div>
//       `,
//       )
//     })

//     // Replace combined work experience placeholder
//     html = html.replace(/{WORK_EXPERIENCE}/g, workExperienceHtml)

//     // Generate education HTML
//     let educationHtml = ""
//     data.education.forEach((edu, index) => {
//       educationHtml += `
//         <div class="education-item">
//           <div class="education-header">
//             <span class="institution">${edu.institution || ""}</span>
//             <span class="dates">${edu.graduationDate || ""}</span>
//           </div>
//           <div class="location">${edu.location || ""}</div>
//           <div class="degree">${edu.degree || ""} in ${edu.fieldOfStudy || ""}</div>
//           <div class="description">${edu.description || ""}</div>
//         </div>
//       `

//       // Replace individual education placeholders
//       html = html.replace(new RegExp(`{INSTITUTION_${index + 1}}`, "g"), edu.institution || "")
//       html = html.replace(new RegExp(`{EDUCATION_LOCATION_${index + 1}}`, "g"), edu.location || "")
//       html = html.replace(new RegExp(`{DEGREE_${index + 1}}`, "g"), edu.degree || "")
//       html = html.replace(new RegExp(`{FIELD_OF_STUDY_${index + 1}}`, "g"), edu.fieldOfStudy || "")
//       html = html.replace(new RegExp(`{GRADUATION_DATE_${index + 1}}`, "g"), edu.graduationDate || "")
//       html = html.replace(new RegExp(`{EDUCATION_DESCRIPTION_${index + 1}}`, "g"), edu.description || "")
//       html = html.replace(
//         new RegExp(`{EDUCATION_${index + 1}}`, "g"),
//         `
//         <div class="education-item">
//           <div class="education-header">
//             <span class="institution">${edu.institution || ""}</span>
//             <span class="dates">${edu.graduationDate || ""}</span>
//           </div>
//           <div class="location">${edu.location || ""}</div>
//           <div class="degree">${edu.degree || ""} in ${edu.fieldOfStudy || ""}</div>
//           <div class="description">${edu.description || ""}</div>
//         </div>
//       `,
//       )
//     })

//     // Replace combined education placeholder
//     html = html.replace(/{EDUCATION}/g, educationHtml)

//     // Generate skills HTML
//     let skillsHtml = ""
//     data.skills.forEach((skill, index) => {
//       if (skill) {
//         skillsHtml += `<span class="skill">${skill}</span>`
//         html = html.replace(new RegExp(`{SKILL_${index + 1}}`, "g"), skill)
//       }
//     })
//     html = html.replace(/{SKILLS}/g, skillsHtml)

//     // Generate achievements HTML
//     let achievementsHtml = ""
//     data.achievements.forEach((achievement, index) => {
//       if (achievement) {
//         achievementsHtml += `<li>${achievement}</li>`
//         html = html.replace(new RegExp(`{ACHIEVEMENT_${index + 1}}`, "g"), achievement)
//       }
//     })
//     html = html.replace(/{ACHIEVEMENTS}/g, achievementsHtml)

//     // Generate references HTML
//     let referencesHtml = ""
//     data.references.forEach((reference, index) => {
//       if (reference.name) {
//         referencesHtml += `
//           <div class="reference-item">
//             <div class="reference-name">${reference.name || ""}</div>
//             <div class="reference-position">${reference.position || ""} at ${reference.company || ""}</div>
//             <div class="reference-contact">${reference.phone || ""} | ${reference.email || ""}</div>
//           </div>
//         `

//         html = html.replace(new RegExp(`{REFERENCE_NAME_${index + 1}}`, "g"), reference.name || "")
//         html = html.replace(new RegExp(`{REFERENCE_POSITION_${index + 1}}`, "g"), reference.position || "")
//         html = html.replace(new RegExp(`{REFERENCE_COMPANY_${index + 1}}`, "g"), reference.company || "")
//         html = html.replace(new RegExp(`{REFERENCE_PHONE_${index + 1}}`, "g"), reference.phone || "")
//         html = html.replace(new RegExp(`{REFERENCE_EMAIL_${index + 1}}`, "g"), reference.email || "")
//         html = html.replace(
//           new RegExp(`{REFERENCE_${index + 1}}`, "g"),
//           `
//           <div class="reference-item">
//             <div class="reference-name">${reference.name || ""}</div>
//             <div class="reference-position">${reference.position || ""} at ${reference.company || ""}</div>
//             <div class="reference-contact">${reference.phone || ""} | ${reference.email || ""}</div>
//           </div>
//         `,
//         )
//       }
//     })
//     html = html.replace(/{REFERENCES}/g, referencesHtml)

//     // Replace additional sections
//     html = html.replace(/{CERTIFICATIONS}/g, data.additionalSections.certifications || "")
//     html = html.replace(/{LANGUAGES}/g, data.additionalSections.languages || "")
//     html = html.replace(/{WEBSITES}/g, data.additionalSections.websites || "")
//     html = html.replace(/{SOFTWARE}/g, data.additionalSections.software || "")
//     html = html.replace(/{ACCOMPLISHMENTS}/g, data.additionalSections.accomplishments || "")
//     html = html.replace(/{ADDITIONALINFO}/g, data.additionalSections.additionalInfo || "")
//     html = html.replace(/{AFFILIATIONS}/g, data.additionalSections.affiliations || "")
//     html = html.replace(/{INTERESTS}/g, data.additionalSections.interests || "")

//     // Remove any unused placeholders
//     html = html.replace(/{[A-Z0-9_]+}/g, "")

//     return html
//   }

//   const handlePaymentComplete = () => {
//     setShowPaymentWall(false)
//     handleExport()
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto py-12 flex justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (showPaymentWall) {
//     return <ResumePaymentWall onPaymentComplete={handlePaymentComplete} />
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Left side - Form */}
//         <div className="w-full lg:w-1/3">
//           <Card className="h-full">
//             <CardHeader>
//               <CardTitle>Resume Content</CardTitle>
//             </CardHeader>
//             <CardContent className="p-0">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid grid-cols-3 lg:grid-cols-2 mb-4">
//                   <TabsTrigger value="personal">Personal</TabsTrigger>
//                   <TabsTrigger value="experience">Experience</TabsTrigger>
//                   <TabsTrigger value="education">Education</TabsTrigger>
//                   <TabsTrigger value="skills">Skills</TabsTrigger>
//                   <TabsTrigger value="achievements">Achievements</TabsTrigger>
//                   <TabsTrigger value="references">References</TabsTrigger>
//                 </TabsList>

//                 <div className="px-4 pb-4">
//                   <AIAssistant
//                     section={activeTab}
//                     data={resumeData}
//                     onUpdate={(newData) => setResumeData(newData)}
//                     isLoading={aiSuggesting}
//                     setIsLoading={setAiSuggesting}
//                   />

//                   <ResumeForm data={resumeData} onChange={handleResumeDataChange} activeTab={activeTab} />
//                 </div>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right side - Preview */}
//         <div className="w-full lg:w-2/3">
//           <Card className="h-full">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle>Live Preview</CardTitle>
//               <div className="flex gap-2">
//                 <Button variant="outline" onClick={handleExport}>
//                   <Save className="mr-2 h-4 w-4" /> Save
//                 </Button>
//                 <Button onClick={handleExportClick}>
//                   <Download className="mr-2 h-4 w-4" /> Export
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <ResumePreview template={template} data={resumeData} />
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
