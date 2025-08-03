"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { processPurchase } from "@/app/actions/process-purchase"

export default function PaymentDemoPage() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<"selecting" | "processing" | "success" | "failure">("selecting")
  const [isProcessing, setIsProcessing] = useState(false)

  const preferenceId = searchParams.get("preference_id")
  const customerEmail = searchParams.get("customer_email")

  const simulatePayment = async (status: "success" | "failure") => {
    setPaymentStatus("processing")
    setIsProcessing(true)

    // Simular tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (status === "success") {
      // Procesar la compra y enviar emails
      try {
        await processPurchase({
          nombre: "Cliente",
          apellido: "Demo",
          email: customerEmail || "demo@email.com",
          telefono: "+54 9 11 1234-5678",
          pais: "Argentina",
          ciudad: "Buenos Aires",
          courseTitle: "Full Planche Workshop",
          amount: 29900,
          paymentMethod: "mercadopago-demo",
          paymentId: `demo-${Date.now()}`,
          transactionId: `demo-tx-${Date.now()}`,
        })
      } catch (error) {
        console.error("Error procesando compra demo:", error)
      }
    }

    setPaymentStatus(status)
    setIsProcessing(false)
  }

  if (paymentStatus === "processing") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-[#343434]/50 border-[#343434]">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 border-4 border-[#69d9d7]/30 border-t-[#69d9d7] rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-white text-xl font-bold mb-2">Procesando Pago...</h2>
            <p className="text-gray-300">Por favor espera mientras procesamos tu pago</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-[#343434]/50 border-[#343434]">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white" size={40} />
            </div>
            <CardTitle className="text-white text-3xl">¡Pago Exitoso! (Demo)</CardTitle>
            <p className="text-gray-300 text-lg">Tu compra ha sido procesada correctamente</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-[#000000] p-6 rounded-lg border border-[#69d9d7]">
              <h3 className="text-[#69d9d7] font-bold text-xl mb-4">¿Qué sigue ahora?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Pago confirmado (modo demo)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Email enviado con los archivos</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">Revisa tu email (incluyendo spam)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className="text-gray-300">¡Comienza tu transformación!</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black">Volver al Inicio</Button>
              </Link>
              <Link href="/config">
                <Button
                  variant="outline"
                  className="border-[#69d9d7] text-[#69d9d7] hover:bg-[#69d9d7] hover:text-black bg-transparent"
                >
                  Configurar MercadoPago Real
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentStatus === "failure") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-[#343434]/50 border-[#343434]">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="text-white" size={40} />
            </div>
            <CardTitle className="text-white text-3xl">Pago Rechazado (Demo)</CardTitle>
            <p className="text-gray-300 text-lg">El pago no pudo ser procesado</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex gap-4 justify-center">
              <Link href="/checkout">
                <Button className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black">Intentar Nuevamente</Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-[#69d9d7] text-[#69d9d7] hover:bg-[#69d9d7] hover:text-black bg-transparent"
                >
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-[#343434]/50 border-[#343434]">
        <CardHeader className="text-center">
          <Badge className="bg-yellow-500 text-black mb-4">MODO DEMO</Badge>
          <CardTitle className="text-white text-3xl">Simulador de Pago MercadoPago</CardTitle>
          <p className="text-gray-300 text-lg">Elige el resultado del pago para probar el flujo completo</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-[#000000] p-6 rounded-lg border border-[#343434]">
            <h3 className="text-white font-bold text-lg mb-4">Detalles de la Compra:</h3>
            <div className="space-y-2 text-gray-300">
              <p>
                <strong>Curso:</strong> Full Planche Workshop
              </p>
              <p>
                <strong>Precio:</strong> $29.900 ARS
              </p>
              <p>
                <strong>Email:</strong> {customerEmail}
              </p>
              <p>
                <strong>ID Preferencia:</strong> {preferenceId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => simulatePayment("success")}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
            >
              <CheckCircle className="mr-2" size={20} />
              Simular Pago Exitoso
            </Button>

            <Button
              onClick={() => simulatePayment("failure")}
              disabled={isProcessing}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white py-6 text-lg"
            >
              <XCircle className="mr-2" size={20} />
              Simular Pago Fallido
            </Button>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Este es un simulador para probar el flujo sin configurar MercadoPago
            </p>
            <Link href="/config">
              <Button
                variant="outline"
                className="border-[#69d9d7] text-[#69d9d7] hover:bg-[#69d9d7] hover:text-black bg-transparent"
              >
                Configurar MercadoPago Real
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
