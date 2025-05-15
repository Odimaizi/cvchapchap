"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export type PlanType = "free" | "premium" | "professional"

interface UsageStats {
  resumesUsed: number
  coverLettersUsed: number
  resumesLimit: number | null // null means unlimited
  coverLettersLimit: number | null // null means unlimited
}

interface SubscriptionContextType {
  plan: PlanType
  usage: UsageStats
  hasAccessTo: (feature: "ats" | "interview" | "private-jobs") => boolean
  canCreateResume: () => boolean
  canCreateCoverLetter: () => boolean
  incrementResumeUsage: () => Promise<boolean>
  incrementCoverLetterUsage: () => Promise<boolean>
  refreshUsage: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient()
  const [plan, setPlan] = useState<PlanType>("free")
  const [usage, setUsage] = useState<UsageStats>({
    resumesUsed: 0,
    coverLettersUsed: 0,
    resumesLimit: 0,
    coverLettersLimit: 5,
  })

  useEffect(() => {
    const fetchSubscription = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Fetch user's subscription from your database
        const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", session.user.id).single()

        if (error || !data) {
          // Default to free plan if no subscription found
          setPlan("free")
          setUsage({
            resumesUsed: 0,
            coverLettersUsed: 0,
            resumesLimit: 0, // Pay per resume for free plan
            coverLettersLimit: 5,
          })
          return
        }

        setPlan(data.plan_type)

        // Set limits based on plan
        let resumesLimit = 0
        let coverLettersLimit = 5

        if (data.plan_type === "premium") {
          resumesLimit = 5
          coverLettersLimit = 10
        } else if (data.plan_type === "professional") {
          resumesLimit = null // unlimited
          coverLettersLimit = null // unlimited
        }

        // Fetch usage
        const { data: usageData, error: usageError } = await supabase
          .from("usage")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (!usageError && usageData) {
          setUsage({
            resumesUsed: usageData.resumes_used || 0,
            coverLettersUsed: usageData.cover_letters_used || 0,
            resumesLimit,
            coverLettersLimit,
          })
        } else {
          setUsage({
            resumesUsed: 0,
            coverLettersUsed: 0,
            resumesLimit,
            coverLettersLimit,
          })
        }
      }
    }

    fetchSubscription()
  }, [supabase])

  const hasAccessTo = (feature: "ats" | "interview" | "private-jobs") => {
    if (plan === "professional") return true
    if (plan === "premium") return true
    return false // Free plan has no access
  }

  const canCreateResume = () => {
    if (plan === "professional") return true
    if (plan === "premium" && usage.resumesLimit !== null && usage.resumesUsed < usage.resumesLimit) return true
    // Free plan users can create resumes but need to pay per resume
    return true
  }

  const canCreateCoverLetter = () => {
    if (plan === "professional") return true
    if (usage.coverLettersLimit === null) return true
    return usage.coverLettersUsed < usage.coverLettersLimit
  }

  const incrementResumeUsage = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return false

    // For free plan, this would trigger payment flow instead
    if (plan === "free") {
      // Redirect to payment for resume
      return false
    }

    const { error } = await supabase.rpc("increment_resume_usage", {
      user_id: session.user.id,
    })

    if (error) return false

    setUsage((prev) => ({
      ...prev,
      resumesUsed: prev.resumesUsed + 1,
    }))

    return true
  }

  const incrementCoverLetterUsage = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return false

    const { error } = await supabase.rpc("increment_cover_letter_usage", {
      user_id: session.user.id,
    })

    if (error) return false

    setUsage((prev) => ({
      ...prev,
      coverLettersUsed: prev.coverLettersUsed + 1,
    }))

    return true
  }

  const refreshUsage = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await supabase.from("usage").select("*").eq("user_id", session.user.id).single()

    if (!error && data) {
      setUsage((prev) => ({
        ...prev,
        resumesUsed: data.resumes_used || 0,
        coverLettersUsed: data.cover_letters_used || 0,
      }))
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        usage,
        hasAccessTo,
        canCreateResume,
        canCreateCoverLetter,
        incrementResumeUsage,
        incrementCoverLetterUsage,
        refreshUsage,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
