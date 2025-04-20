import { createClient } from "@supabase/supabase-js"

// Define types based on the provided schema
export type User = {
  id: number
  email: string
  name: string
  created_at: string
  updated_at: string
  role: "user" | "admin"
  subscription_tier: "free" | "premium" | "professional"
  subscription_expires_at: string | null
}

export type Template = {
  id: number
  name: string
  description: string | null
  html: string
  css: string | null
  js: string | null
  category: "resume" | "cover_letter"
  is_premium: boolean
  created_at: string
  updated_at: string
  created_by: number | null
}

export type File = {
  id: number
  filename: string
  original_filename: string
  file_path: string
  file_type: string
  file_size: number
  user_id: number
  created_at: string
}

export type UserDocument = {
  id: number
  user_id: number
  title: string
  content: any // JSON content
  document_type: "resume" | "cover_letter"
  template_id: number | null
  created_at: string
  updated_at: string
  is_public: boolean
}

export type JobApplication = {
  id: number
  user_id: number
  company_name: string
  job_title: string
  job_description: string | null
  application_date: string
  status: "applied" | "interviewing" | "rejected" | "offered" | "accepted" | "saved"
  resume_id: number | null
  cover_letter_id: number | null
  notes: string | null
}

export type UserProfile = {
  user_id: number
  profile_picture: string | null
  headline: string | null
  summary: string | null
  location: string | null
  phone: string | null
  website: string | null
  linkedin: string | null
  github: string | null
  twitter: string | null
}

// Create a singleton Supabase client for interacting with your database
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const createSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Please check your .env file or environment configuration.")
    throw new Error("Missing Supabase environment variables")
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
    return supabaseInstance
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    throw new Error("Failed to initialize Supabase client")
  }
}

// Verify Supabase connection
export const verifySupabaseConnection = async () => {
  try {
    const supabase = createSupabaseClient()

    // Try a simple query to verify connection
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Supabase connection verification failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Supabase connection verified successfully" }
  } catch (error: any) {
    console.error("Error verifying Supabase connection:", error)
    return { success: false, error: error.message || "Unknown error occurred" }
  }
}

// Helper functions for authentication
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const supabase = createSupabaseClient()

    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Error signing up:", authError)
      return { error: authError }
    }

    if (!authData.user) {
      return { error: { message: "Failed to create user" } }
    }

    // Then, insert the user into our custom users table
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          role: "user",
          subscription_tier: "free",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating user profile:", error)
      return { error }
    }

    return { data, user: authData.user }
  } catch (error: any) {
    console.error("Unexpected error during signup:", error)
    return { error: { message: error.message || "An unexpected error occurred" } }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in:", error)
      return { error }
    }

    return { data }
  } catch (error: any) {
    console.error("Unexpected error during signin:", error)
    return { error: { message: error.message || "An unexpected error occurred" } }
  }
}

export const signOut = async () => {
  try {
    const supabase = createSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
      return { error }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error during signout:", error)
    return { error: { message: error.message || "An unexpected error occurred" } }
  }
}

export const getCurrentUser = async () => {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return { user: null }
    }

    // Get the user's profile from our custom users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return { user: null }
    }

    return { user: { ...data.user, ...userData } }
  } catch (error: any) {
    console.error("Unexpected error getting current user:", error)
    return { user: null, error: error.message || "An unexpected error occurred" }
  }
}

// Types based on the provided schema for resumes and resume templates
export type ResumeTemplate = {
  id: string
  name: string
  html_content: string
  css_content?: string
  preview_image?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export type Resume = {
  id: string
  user_id: string
  template_id: string
  content: any // JSONB content
  created_at: string
  updated_at: string
}

// Helper functions for templates
export const getTemplates = async (category?: "resume" | "cover_letter") => {
  try {
    const supabase = createSupabaseClient()

    let query = supabase.from("templates").select("*")

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching templates:", error)
      return []
    }

    return data as Template[]
  } catch (error) {
    console.error("Unexpected error fetching templates:", error)
    return []
  }
}

export const getTemplate = async (id: number) => {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.from("templates").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching template:", error)
      return null
    }

    return data as Template
  } catch (error) {
    console.error("Unexpected error fetching template:", error)
    return null
  }
}

// Helper functions for resume templates
export const getResumeTemplates = async () => {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.from("resume_templates").select("*")

    if (error) {
      console.error("Error fetching resume templates:", error)
      return []
    }

    return data as ResumeTemplate[]
  } catch (error) {
    console.error("Unexpected error fetching resume templates:", error)
    return []
  }
}

export const getResumeTemplate = async (id: string) => {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.from("resume_templates").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching resume template:", error)
      return null
    }

    return data as ResumeTemplate
  } catch (error) {
    console.error("Unexpected error fetching resume template:", error)
    return null
  }
}

// Helper functions for user documents
export const getUserDocuments = async (userId: string, documentType?: "resume" | "cover_letter") => {
  try {
    const supabase = createSupabaseClient()

    let query = supabase.from("user_documents").select("*, templates(*)").eq("user_id", userId)

    if (documentType) {
      query = query.eq("document_type", documentType)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching user documents:", error)
      return []
    }

    return data as (UserDocument & { templates: Template | null })[]
  } catch (error) {
    console.error("Unexpected error fetching user documents:", error)
    return []
  }
}

export const saveUserDocument = async (document: Omit<UserDocument, "id" | "created_at" | "updated_at">) => {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.from("user_documents").upsert(document).select().single()

    if (error) {
      console.error("Error saving document:", error)
      return null
    }

    return data as UserDocument
  } catch (error) {
    console.error("Unexpected error saving document:", error)
    return null
  }
}

export const deleteUserDocument = async (id: number) => {
  try {
    const supabase = createSupabaseClient()

    const { error } = await supabase.from("user_documents").delete().eq("id", id)

    if (error) {
      console.error("Error deleting document:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error deleting document:", error)
    return false
  }
}

// Helper functions for user resumes
export const getUserResumes = async (userId: string) => {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.from("resumes").select("*, resume_templates(*)").eq("user_id", userId)

    if (error) {
      console.error("Error fetching user resumes:", error)
      return []
    }

    return data as (Resume & { resume_templates: ResumeTemplate })[]
  } catch (error) {
    console.error("Unexpected error fetching user resumes:", error)
    return []
  }
}

export const saveResume = async (resume: Omit<Resume, "id" | "created_at" | "updated_at">) => {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.from("resumes").upsert(resume).select().single()

    if (error) {
      console.error("Error saving resume:", error)
      return null
    }

    return data as Resume
  } catch (error) {
    console.error("Unexpected error saving resume:", error)
    return null
  }
}

export const deleteResume = async (id: string) => {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.from("resumes").delete().eq("id", id)

    if (error) {
      console.error("Error deleting resume:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error deleting resume:", error)
    return false
  }
}

// Helper functions for job applications
export const getUserJobApplications = async (userId: string) => {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from("job_applications")
      .select("*, resume:resume_id(id, title), cover_letter:cover_letter_id(id, title)")
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching job applications:", error)
      return []
    }

    return data as (JobApplication & {
      resume: Pick<UserDocument, "id" | "title"> | null
      cover_letter: Pick<UserDocument, "id" | "title"> | null
    })[]
  } catch (error) {
    console.error("Unexpected error fetching job applications:", error)
    return []
  }
}

export const saveJobApplication = async (application: Omit<JobApplication, "id" | "application_date">) => {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.from("job_applications").upsert(application).select().single()

    if (error) {
      console.error("Error saving job application:", error)
      return null
    }

    return data as JobApplication
  } catch (error) {
    console.error("Unexpected error saving job application:", error)
    return null
  }
}

export const deleteJobApplication = async (id: number) => {
  try {
    const supabase = createSupabaseClient()

    const { error } = await supabase.from("job_applications").delete().eq("id", id)

    if (error) {
      console.error("Error deleting job application:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error deleting job application:", error)
    return false
  }
}

// Helper functions for user profiles
export const getUserProfile = async (userId: string) => {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error("Unexpected error fetching user profile:", error)
    return null
  }
}

export const saveUserProfile = async (profile: UserProfile) => {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.from("user_profiles").upsert(profile).select().single()

    if (error) {
      console.error("Error saving user profile:", error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error("Unexpected error saving user profile:", error)
    return null
  }
}

// Helper functions for file uploads
export const uploadFile = async (userId: string, file: File & { name: string; type: string; size: number }) => {
  try {
    const supabase = createSupabaseClient()

    // Generate a unique filename
    const timestamp = new Date().getTime()
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${timestamp}.${fileExt}`

    // Upload to storage
    const { data: storageData, error: storageError } = await supabase.storage.from("user_files").upload(fileName, file)

    if (storageError) {
      console.error("Error uploading file:", storageError)
      return { error: storageError }
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from("user_files").getPublicUrl(fileName)

    // Insert file record
    const { data, error } = await supabase
      .from("files")
      .insert([
        {
          user_id: userId,
          filename: fileName,
          original_filename: file.name,
          file_path: publicUrlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error saving file record:", error)
      return { error }
    }

    return { data }
  } catch (error: any) {
    console.error("Unexpected error uploading file:", error)
    return { error: { message: error.message || "An unexpected error occurred" } }
  }
}

// Optional: Group exports under a default object for easier imports
const supabase = {
  createSupabaseClient,
  verifySupabaseConnection,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getTemplates,
  getTemplate,
  getResumeTemplates,
  getResumeTemplate,
  getUserDocuments,
  saveUserDocument,
  deleteUserDocument,
  getUserResumes,
  saveResume,
  deleteResume,
  getUserJobApplications,
  saveJobApplication,
  deleteJobApplication,
  getUserProfile,
  saveUserProfile,
  uploadFile,
}

export default supabase
