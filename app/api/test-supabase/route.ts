import { NextResponse } from "next/server"
import { createSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    // First check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Supabase environment variables",
          details: {
            url: supabaseUrl ? "Set" : "Not set",
            key: supabaseAnonKey ? "Set" : "Not set",
          },
        },
        { status: 500 },
      )
    }

    // Try to initialize the Supabase client
    try {
      const supabase = createSupabaseClient()

      // Test the connection with a simple query
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Supabase connection test failed:", error)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to connect to Supabase",
            error: error.message,
            details: {
              url: supabaseUrl.substring(0, 8) + "...",
              key: supabaseAnonKey.substring(0, 5) + "...",
            },
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Successfully connected to Supabase",
        data: data ? "Session data retrieved" : "No active session",
      })
    } catch (clientError: any) {
      console.error("Error initializing Supabase client:", clientError)
      return NextResponse.json(
        {
          success: false,
          message: "Error initializing Supabase client",
          error: clientError.message,
          details: {
            url: supabaseUrl.substring(0, 8) + "...",
            key: supabaseAnonKey.substring(0, 5) + "...",
          },
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error testing Supabase connection:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error testing Supabase connection",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

