"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, AlertTriangle, Copy } from "lucide-react"
import { testConnection, initializeDatabase } from "@/lib/supabase-init"

interface SetupStep {
  id: string
  title: string
  status: "pending" | "loading" | "success" | "error"
  message?: string
  action?: () => Promise<void>
}

export default function SetupPage() {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: "env",
      title: "Variables de Entorno",
      status: "pending",
    },
    {
      id: "connection",
      title: "Conexión a Supabase",
      status: "pending",
      action: async () => {
        const result = await testConnection()
        if (!result.success) {
          throw new Error(result.error || "Error de conexión")
        }
      },
    },
    {
      id: "database",
      title: "Inicialización de Base de Datos",
      status: "pending",
      action: async () => {
        const result = await initializeDatabase()
        if (!result.success) {
          throw new Error("Error inicializando base de datos")
        }
      },
    },
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [setupComplete, setSetupComplete] = useState(false)

  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  const checkEnvironmentVariables = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setSteps((prev) =>
      prev.map((step) =>
        step.id === "env"
          ? {
              ...step,
              status: supabaseUrl && supabaseKey ? "success" : "error",
              message:
                supabaseUrl && supabaseKey
                  ? "Variables configuradas correctamente"
                  : "Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY",
            }
          : step,
      ),
    )

    if (supabaseUrl && supabaseKey) {
      setCurrentStep(1)
    }
  }

  const runStep = async (stepIndex: number) => {
    const step = steps[stepIndex]
    if (!step.action) return

    setSteps((prev) => prev.map((s, i) => (i === stepIndex ? { ...s, status: "loading" } : s)))

    try {
      await step.action()
      setSteps((prev) =>
        prev.map((s, i) => (i === stepIndex ? { ...s, status: "success", message: "Completado exitosamente" } : s)),
      )

      if (stepIndex < steps.length - 1) {
        setCurrentStep(stepIndex + 1)
      } else {
        setSetupComplete(true)
      }
    } catch (error) {
      setSteps((prev) =>
        prev.map((s, i) =>
          i === stepIndex
            ? {
                ...s,
                status: "error",
                message: error instanceof Error ? error.message : "Error desconocido",
              }
            : s,
        ),
      )
    }
  }

  const runAllSteps = async () => {
    for (let i = 1; i < steps.length; i++) {
      await runStep(i)
      // Pequeña pausa entre pasos
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const StatusIcon = ({ status }: { status: SetupStep["status"] }) => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
    }
  }

  const envExample = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Otras variables existentes
RESEND_API_KEY=tu_api_key_de_resend
MERCADOPAGO_ACCESS_TOKEN=tu_token_de_mercadopago
NEXT_PUBLIC_BASE_URL=http://localhost:3000`

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#69d9d7] mb-2">Configuración Inicial</h1>
          <p className="text-gray-300">Configuremos tu aplicación paso a paso</p>
        </div>

        {/* Pasos de configuración */}
        <div className="space-y-6 mb-8">
          {steps.map((step, index) => (
            <Card key={step.id} className="bg-[#343434]/50 border-[#343434]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <StatusIcon status={step.status} />
                  <span className="flex-1">{step.title}</span>
                  {index === currentStep && step.action && (
                    <Button
                      onClick={() => runStep(index)}
                      disabled={step.status === "loading"}
                      className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black"
                      size="sm"
                    >
                      {step.status === "loading" ? "Ejecutando..." : "Ejecutar"}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              {step.message && (
                <CardContent>
                  <p
                    className={`text-sm ${
                      step.status === "error"
                        ? "text-red-400"
                        : step.status === "success"
                          ? "text-green-400"
                          : "text-gray-300"
                    }`}
                  >
                    {step.message}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Configuración de variables de entorno */}
        {steps[0].status === "error" && (
          <Card className="bg-yellow-500/20 border-yellow-500/50 mb-8">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <AlertTriangle size={20} />
                Configurar Variables de Entorno
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-yellow-300">
                Necesitas agregar las credenciales de Supabase a tu archivo <code>.env.local</code>:
              </p>

              <div className="relative">
                <pre className="bg-[#000000] p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  <code>{envExample}</code>
                </pre>
                <Button
                  onClick={() => navigator.clipboard.writeText(envExample)}
                  size="sm"
                  className="absolute top-2 right-2 bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black"
                >
                  <Copy size={14} />
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold">Para obtener tus credenciales:</h4>
                <ol className="text-yellow-300 text-sm space-y-1 ml-4">
                  <li>1. Ve a tu dashboard de Supabase</li>
                  <li>2. Selecciona tu proyecto</li>
                  <li>3. Ve a Settings → API</li>
                  <li>4. Copia "Project URL" y "anon public key"</li>
                  <li>5. Pégalos en tu archivo .env.local</li>
                  <li>6. Reinicia el servidor (npm run dev)</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4 justify-center">
          {steps[0].status === "success" && !setupComplete && (
            <Button
              onClick={runAllSteps}
              className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black"
              disabled={steps.some((s) => s.status === "loading")}
            >
              {steps.some((s) => s.status === "loading") ? "Configurando..." : "Ejecutar Configuración Completa"}
            </Button>
          )}

          {setupComplete && (
            <Button onClick={() => (window.location.href = "/")} className="bg-green-600 hover:bg-green-700 text-white">
              ✅ Configuración Completa - Ir al Inicio
            </Button>
          )}

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-[#343434] text-gray-300 hover:bg-[#343434] bg-transparent"
          >
            Recargar
          </Button>
        </div>

        {/* Información adicional */}
        <Card className="bg-[#343434]/30 border-[#343434] mt-8">
          <CardHeader>
            <CardTitle className="text-white text-lg">ℹ️ Información</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-sm space-y-2">
            <p>• Esta configuración se ejecuta automáticamente la primera vez</p>
            <p>• Las tablas se crearán automáticamente en tu base de datos de Supabase</p>
            <p>• Si algo falla, puedes volver a ejecutar los pasos individualmente</p>
            <p>• Una vez completado, no necesitarás volver a esta página</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
