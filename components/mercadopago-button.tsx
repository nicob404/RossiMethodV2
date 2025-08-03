"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2, AlertCircle, Play, ExternalLink } from "lucide-react"
import { createPreference } from "@/app/actions/mercadopago"

interface MercadoPagoButtonProps {
  amount: number
  title: string
  description: string
  customerData: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    pais: string
    ciudad: string
  }
  disabled?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function MercadoPagoButton({
  amount,
  title,
  description,
  customerData,
  disabled = false,
  onSuccess,
  onError,
}: MercadoPagoButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDemoOption, setShowDemoOption] = useState(false)

  const handlePayment = async () => {
    if (disabled) return

    setIsLoading(true)
    setError(null)
    setShowDemoOption(false)

    try {
      console.log("Iniciando proceso de pago con datos:", customerData)

      const result = await createPreference({
        amount,
        title,
        description,
        customerData,
      })

      console.log("Resultado de createPreference:", result)

      if (result.success && result.preferenceId) {
        // Determinar qué URL usar
        const initPoint = result.initPoint || result.sandboxInitPoint
        console.log("Redirigiendo a:", initPoint)

        if (initPoint) {
          // Redirigir a MercadoPago o al demo
          window.location.href = initPoint
        } else {
          const errorMessage = "No se pudo obtener la URL de pago"
          setError(errorMessage)
          setShowDemoOption(true)
          onError?.(errorMessage)
        }
      } else {
        const errorMessage = result.error || "Error al crear la preferencia de pago"
        setError(errorMessage)

        // Si el resultado sugiere demo, mostrarlo
        if (result.suggestDemo) {
          setShowDemoOption(true)
        }

        onError?.(errorMessage)
      }
    } catch (error) {
      console.error("Error en handlePayment:", error)
      const errorMessage = "Error al procesar el pago. Por favor, intenta nuevamente."
      setError(errorMessage)
      setShowDemoOption(true)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoPayment = () => {
    const demoUrl = `/payment/demo?preference_id=demo-${Date.now()}&customer_email=${encodeURIComponent(customerData.email)}`
    window.location.href = demoUrl
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handlePayment}
        disabled={disabled || isLoading}
        className="w-full bg-[#00b1ea] hover:bg-[#0099cc] text-white font-bold py-4 text-lg transition-all duration-300"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Procesando...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard size={20} />
            Pagar con MercadoPago - ${amount.toLocaleString()}
          </div>
        )}
      </Button>

      {error && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <AlertCircle className="text-red-400" size={16} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>

          {showDemoOption && (
            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">💡 Solución Alternativa:</h4>
              <p className="text-blue-300 text-sm mb-3">
                Mientras solucionamos la configuración de MercadoPago, puedes probar el flujo completo con nuestro
                simulador
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleDemoPayment}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
                  size="sm"
                >
                  <Play size={16} className="mr-2" />
                  Probar con Simulador
                </Button>
                <Button
                  onClick={() => window.open("/config", "_blank")}
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
                  size="sm"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Ver Configuración
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Información de configuración para desarrollo */}
      {process.env.NODE_ENV === "development" && !error && (
        <div className="mt-4 p-3 bg-gray-500/20 border border-gray-500/50 rounded-lg">
          <p className="text-gray-400 text-sm font-medium mb-2">ℹ️ Información de Desarrollo:</p>
          <div className="text-xs text-gray-300 space-y-1">
            <p>• Token configurado: {process.env.MERCADOPAGO_ACCESS_TOKEN ? "✅ Sí" : "❌ No"}</p>
            <p>• Base URL: {process.env.NEXT_PUBLIC_BASE_URL || "No configurada"}</p>
            <p>• Si hay problemas, se activará automáticamente el modo demo</p>
          </div>
        </div>
      )}
    </div>
  )
}
