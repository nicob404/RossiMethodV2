"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔄 AuthProvider render")

    const getSession = async () => {
      console.log("Attempting to get session...")
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error.message)
          setUser(null)
        } else if (session) {
          console.log("✅ Session found:", session.user.email)
          setUser(session.user)
        } else {
          console.log("❌ No active session found.")
          setUser(null)
        }
      } catch (err) {
        console.error("Unexpected error in getSession:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth state changed:", event)
      if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user.email)
        setUser(session?.user || null)
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out.")
        setUser(null)
      }
      setLoading(false) // Ensure loading is false after any auth state change
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    console.log("Attempting email sign in for:", email)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      console.error("Email sign in error:", error.message)
      return { error }
    }
    console.log("Email sign in successful for:", data.user?.email)
    return { error: null }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true)
    console.log("Attempting email sign up for:", email)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      console.error("Email sign up error:", error.message)
      return { error }
    }
    console.log("Email sign up successful for:", data.user?.email)
    return { error: null }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    console.log("Attempting Google sign in...")
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://rossi-method.vercel.app/auth/callback",
      },
    })
    setLoading(false)
    if (error) {
      console.error("Google sign in error:", error.message)
      return { error }
    }
    console.log("Google sign in initiated, data:", data)
    return { error: null }
  }

  const signOut = async () => {
    setLoading(true)
    console.log("Attempting to sign out...")
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    if (error) {
      console.error("Sign out error:", error.message)
      return { error }
    }
    console.log("Sign out successful.")
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
