"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, ExternalLink, Copy, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function SetupGooglePage() {
  const [copied, setCopied] = useState("")

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(""), 2000)
  }

  const currentUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#69d9d7]">Configurar Google OAuth</h1>
          <p className="text-gray-300">Sigue estos pasos para habilitar el login con Google</p>
        </div>

        <div className="grid gap-6">
          {/* Paso 1 */}
          <Card className="bg-[#1a1a1a] border-[#343434]">
            <CardHeader>
              <CardTitle className="text-[#69d9d7] flex items-center gap-2">
                <span className="bg-[#69d9d7] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Configurar en Supabase
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configura Google OAuth en tu proyecto de Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-white">1. Ve a tu proyecto en Supabase Dashboard</p>
                <p className="text-white">2. Ve a Authentication → Providers</p>
                <p className="text-white">3. Habilita Google Provider</p>
                <p className="text-white">4. Agrega estas URLs de redirección:</p>

                <div className="bg-[#343434] p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="text-[#69d9d7]">{currentUrl}/auth/callback</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(`${currentUrl}/auth/callback`, "callback")}
                      className="text-gray-400 hover:text-white"
                    >
                      {copied === "callback" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 2 */}
          <Card className="bg-[#1a1a1a] border-[#343434]">
            <CardHeader>
              <CardTitle className="text-[#69d9d7] flex items-center gap-2">
                <span className="bg-[#69d9d7] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Crear proyecto en Google Cloud
              </CardTitle>
              <CardDescription className="text-gray-300">Configura las credenciales de Google OAuth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-white">1. Ve a Google Cloud Console</p>
                <Button
                  variant="outline"
                  className="border-[#343434] text-white hover:bg-[#343434] bg-transparent"
                  onClick={() => window.open("https://console.cloud.google.com", "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Google Cloud Console
                </Button>

                <p className="text-white">2. Crea un nuevo proyecto o selecciona uno existente</p>
                <p className="text-white">3. Ve a APIs & Services → Credentials</p>
                <p className="text-white">4. Crea OAuth 2.0 Client ID</p>
                <p className="text-white">5. Configura estas URLs:</p>

                <div className="bg-[#343434] p-3 rounded-lg space-y-2">
                  <div>
                    <p className="text-gray-300 text-sm">Authorized JavaScript origins:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-[#69d9d7]">{currentUrl}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(currentUrl, "origin")}
                        className="text-gray-400 hover:text-white"
                      >
                        {copied === "origin" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-300 text-sm">Authorized redirect URIs:</p>
                    <div className="flex items-center justify-between">
                      <code className="text-[#69d9d7]">https://tu-proyecto.supabase.co/auth/v1/callback</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard("https://tu-proyecto.supabase.co/auth/v1/callback", "redirect")}
                        className="text-gray-400 hover:text-white"
                      >
                        {copied === "redirect" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">Reemplaza "tu-proyecto" con tu URL real de Supabase</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 3 */}
          <Card className="bg-[#1a1a1a] border-[#343434]">
            <CardHeader>
              <CardTitle className="text-[#69d9d7] flex items-center gap-2">
                <span className="bg-[#69d9d7] text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Configurar credenciales en Supabase
              </CardTitle>
              <CardDescription className="text-gray-300">Agrega las credenciales de Google a Supabase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-white">1. Copia el Client ID y Client Secret de Google Cloud</p>
                <p className="text-white">2. Ve a Supabase → Authentication → Providers → Google</p>
                <p className="text-white">3. Pega las credenciales</p>
                <p className="text-white">4. Guarda los cambios</p>
              </div>
            </CardContent>
          </Card>

          {/* Alertas importantes */}
          <Alert className="border-yellow-500 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-400">
              <strong>Importante:</strong> Asegúrate de que las URLs coincidan exactamente. Un error común es usar HTTP
              en lugar de HTTPS en producción.
            </AlertDescription>
          </Alert>

          <Alert className="border-blue-500 bg-blue-500/10">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-400">
              <strong>Tip:</strong> Si estás en desarrollo local, puedes usar http://localhost:3000. En producción, usa
              tu dominio real con HTTPS.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black font-semibold"
            >
              Volver a la página principal
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
