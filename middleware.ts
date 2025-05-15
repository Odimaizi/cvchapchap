import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not signed in and the current path is not / or /login, redirect the user to /login
  if (
    !session &&
    req.nextUrl.pathname !== "/" &&
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/signup"
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If the user is signed in and the current path is / or /login, redirect the user to /dashboard
  if (session && (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/pricing",
    "/resume/:path*",
    "/cover-letter",
    "/ats-optimization",
    "/interview-prep",
    "/job-board",
    "/job-posting",
    "/cv-assessment",
    "/checkout/:path*",
  ],
}
