"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Mail, Lock, ChromeIcon as Google, CheckCircle } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!email || !password) {
      setError("Por favor, ingresa tu email y contraseña.")
      return
    }

    if (isLogin) {
      const { error: authError } = await signInWithEmail(email, password)
      if (authError) {
        setError(authError.message || "Error al iniciar sesión. Verifica tus credenciales.")
      } else {
        setSuccessMessage("¡Sesión iniciada con éxito!")
        onSuccess()
      }
    } else {
      const { error: authError } = await signUpWithEmail(email, password)
      if (authError) {
        setError(authError.message || "Error al registrarse. Intenta con otro email o contraseña.")
      } else {
        setSuccessMessage("¡Registro exitoso! Revisa tu email para confirmar tu cuenta.")
        // No call onSuccess here, as email confirmation is pending
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setSuccessMessage(null)
    const { error: authError } = await signInWithGoogle()
    if (authError) {
      setError(authError.message || "Error al iniciar sesión con Google.")
    } else {
      // Google sign-in redirects, so onSuccess will be handled by the callback route
      console.log("Google sign-in initiated, redirecting...")
    }
  }

  const handleClose = () => {
    setEmail("")
    setPassword("")
    setError(null)
    setSuccessMessage(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white border-[#343434]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-[#69d9d7]">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {isLogin ? "Accede a tu cuenta para ver tus programas." : "Crea una cuenta nueva para empezar."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="bg-green-500/20 text-green-400 border-green-500">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black font-semibold"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#343434]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-400">O</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full border-[#343434] text-white hover:bg-[#343434]/50 flex items-center gap-2 bg-transparent"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Google className="h-4 w-4" />}
          {isLogin ? "Iniciar Sesión con Google" : "Registrarse con Google"}
        </Button>
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-[#69d9d7] hover:text-[#d8f494]">
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia Sesión"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
