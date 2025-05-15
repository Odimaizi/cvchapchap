import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create user record in the users table
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user?.id,
      email,
      name,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error creating user record:", insertError)
      // Continue anyway since the auth user was created
    }

    // Initialize usage record
    const { error: usageError } = await supabase.from("usage").insert({
      user_id: data.user?.id,
      resumes_used: 0,
      cover_letters_used: 0,
      created_at: new Date().toISOString(),
    })

    if (usageError) {
      console.error("Error creating usage record:", usageError)
      // Continue anyway since the auth user was created
    }

    return NextResponse.json(
      { message: "User created successfully. Please check your email to confirm your account." },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
