"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "success" | "error">("loading")
  const [tablesStatus, setTablesStatus] = useState<"loading" | "success" | "error">("loading")
  const [authStatus, setAuthStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test 1: Conexión básica
      const { data, error: connectionError } = await supabase.from("usuarios").select("count", { count: "exact" })

      if (connectionError) {
        setConnectionStatus("error")
        setError(`Error de conexión: ${connectionError.message}`)
        return
      }

      setConnectionStatus("success")

      // Test 2: Verificar tablas
      const { data: usuarios, error: usuariosError } = await supabase.from("usuarios").select("*").limit(1)
      const { data: compras, error: comprasError } = await supabase.from("compras").select("*").limit(1)

      if (usuariosError || comprasError) {
        setTablesStatus("error")
        setError(`Error en tablas: ${usuariosError?.message || comprasError?.message}`)
        return
      }

      setTablesStatus("success")

      // Test 3: Verificar autenticación
      const { data: session } = await supabase.auth.getSession()
      setAuthStatus("success")
    } catch (err) {
      setConnectionStatus("error")
      setTablesStatus("error")
      setAuthStatus("error")
      setError(`Error general: ${err instanceof Error ? err.message : "Error desconocido"}`)
    }
  }

  const testGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/test-supabase`,
        },
      })
      if (error) throw error
    } catch (error) {
      alert(`Error con Google Auth: ${error instanceof Error ? error.message : "Error desconocido"}`)
    }
  }

  const StatusIcon = ({ status }: { status: "loading" | "success" | "error" }) => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#69d9d7] mb-8 text-center">Test de Conexión Supabase</h1>

        <div className="space-y-6">
          {/* Test de Conexión */}
          <Card className="bg-[#343434]/50 border-[#343434]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <StatusIcon status={connectionStatus} />
                Conexión a Supabase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                {connectionStatus === "loading" && "Probando conexión..."}
                {connectionStatus === "success" && "✅ Conexión exitosa a Supabase"}
                {connectionStatus === "error" && "❌ Error de conexión"}
              </p>
            </CardContent>
          </Card>

          {/* Test de Tablas */}
          <Card className="bg-[#343434]/50 border-[#343434]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <StatusIcon status={tablesStatus} />
                Tablas de Base de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                {tablesStatus === "loading" && "Verificando tablas..."}
                {tablesStatus === "success" && "✅ Tablas 'usuarios' y 'compras' creadas correctamente"}
                {tablesStatus === "error" && "❌ Error en las tablas"}
              </p>
            </CardContent>
          </Card>

          {/* Test de Autenticación */}
          <Card className="bg-[#343434]/50 border-[#343434]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <StatusIcon status={authStatus} />
                Sistema de Autenticación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                {authStatus === "loading" && "Verificando autenticación..."}
                {authStatus === "success" && "✅ Sistema de autenticación funcionando"}
                {authStatus === "error" && "❌ Error en autenticación"}
              </p>

              {authStatus === "success" && (
                <Button onClick={testGoogleAuth} className="bg-white hover:bg-gray-100 text-black">
                  🔍 Probar Login con Google
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Error Details */}
          {error && (
            <Card className="bg-red-500/20 border-red-500/50">
              <CardHeader>
                <CardTitle className="text-red-400">Detalles del Error</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
              </CardContent>
            </Card>
          )}

          {/* Información de Configuración */}
          <Card className="bg-[#343434]/50 border-[#343434]">
            <CardHeader>
              <CardTitle className="text-white">Información de Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-400">Supabase URL: </span>
                <span className="text-white font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ No configurada"}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Anon Key: </span>
                <span className="text-white font-mono">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
                    : "❌ No configurada"}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
