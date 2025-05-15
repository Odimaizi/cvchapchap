import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "../../../../lib/mongodb"
import User from "../../../../models/User"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
