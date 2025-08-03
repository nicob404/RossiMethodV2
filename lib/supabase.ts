import { createClient } from "@supabase/supabase-js"

// Ensure these are loaded from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 Supabase URL or Anon Key is not set in environment variables.")
  // In a real application, you might want to throw an error or handle this more gracefully
  // For now, we'll proceed but expect issues if not configured.
} else {
  console.log("🔧 Supabase client inicializado con URL:", supabaseUrl)
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "")
