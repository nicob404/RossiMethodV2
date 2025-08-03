"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Settings } from "lucide-react"

interface SetupGuardProps {
  children: React.ReactNode
}

export function SetupGuard({ children }: SetupGuardProps) {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const configured = isSupabaseConfigured()
    setIsConfigured(configured)
  }, [])

  // Mostrar loading mientras verificamos
  if (isConfigured === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#69d9d7] mx-auto mb-4"></div>
          <p className="text-gray-300">Verificando configuración...</p>
        </div>
      </div>
    )
  }

  // Si no está configurado, mostrar mensaje de configuración
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#69d9d7] mb-2">¡Configuración Requerida!</h1>
            <p className="text-gray-300">Tu aplicación necesita ser configurada antes de funcionar</p>
          </div>

          <Card className="bg-yellow-500/20 border-yellow-500/50 mb-8">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <AlertTriangle size={20} />
                Supabase no está configurado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-300">
                Para que tu aplicación funcione correctamente, necesitas configurar las credenciales de Supabase.
              </p>

              <div className="space-y-2">
                <h4 className="text-white font-semibold">¿Qué necesitas hacer?</h4>
                <ol className="text-yellow-300 text-sm space-y-1 ml-4">
                  <li>1. Crear un proyecto en Supabase (si no lo tienes)</li>
                  <li>2. Obtener tus credenciales de API</li>
                  <li>3. Configurar las variables de entorno</li>
                  <li>4. Inicializar la base de datos</li>
                </ol>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => router.push("/setup")} className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black">
                  <Settings className="w-4 h-4 mr-2" />
                  Ir a Configuración
                </Button>

                <Button
                  onClick={() => window.open("https://supabase.com", "_blank")}
                  variant="outline"
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                >
                  Crear cuenta en Supabase
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#343434]/30 border-[#343434]">
            <CardHeader>
              <CardTitle className="text-white text-lg">ℹ️ ¿Qué es Supabase?</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <p>• Supabase es una plataforma de base de datos que usamos para:</p>
              <p className="ml-4">- Autenticación de usuarios (login/registro)</p>
              <p className="ml-4">- Almacenar información de compras</p>
              <p className="ml-4">- Gestionar perfiles de usuarios</p>
              <p>• Es gratuito para proyectos pequeños</p>
              <p>• La configuración toma solo 5 minutos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Si está configurado, mostrar la aplicación normal
  return <>{children}</>
}
