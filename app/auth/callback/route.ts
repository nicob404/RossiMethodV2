import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server" // Assuming you have a server-side Supabase client

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createClient() // Use your server-side Supabase client
    console.log("🔄 Auth Callback: Attempting to exchange code for session...")
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error("🚨 Auth Callback Error:", error.message)
      // Redirect to an error page or home with an error message
      return NextResponse.redirect(`${origin}/?error=${error.message}`)
    }
    console.log("✅ Auth Callback: Session exchanged successfully. Redirecting to:", next)
  } else {
    console.warn("⚠️ Auth Callback: No code found in URL.")
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${next}`)
}
