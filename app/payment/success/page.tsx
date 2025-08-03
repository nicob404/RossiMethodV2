"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Mail } from "lucide-react"
import Link from "next/link"
import { processPurchase } from "@/app/actions/process-purchase"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    const processPayment = async () => {
      const paymentId = searchParams.get("payment_id")
      const status = searchParams.get("status")
      const externalReference = searchParams.get("external_reference")

      if (status === "approved" && paymentId && externalReference) {
        try {
          // Extraer email del external_reference
          const email = externalReference.split("-")[1]

          // Procesar la compra y enviar archivos
          const result = await processPurchase({
            nombre: "Cliente", // Estos datos los tendrías que obtener de tu base de datos
            apellido: "MercadoPago",
            email: email || "cliente@email.com",
            telefono: "",
            pais: "Argentina",
            ciudad: "",
            courseTitle: "Full Planche Workshop",
            amount: 29900,
            paymentMethod: "mercadopago",
            paymentId: paymentId,
            transactionId: paymentId,
          })

          if (result.success) {
            setEmailSent(true)
          }
        } catch (error) {
          console.error("Error procesando pago:", error)
        }
      }

      setIsProcessing(false)
    }

    processPayment()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-[#343434]/50 border-[#343434]">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white" size={40} />
          </div>
          <CardTitle className="text-white text-3xl">¡Pago Exitoso!</CardTitle>
          <p className="text-gray-300 text-lg">Tu compra ha sido procesada correctamente</p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2 p-6">
              <div className="w-6 h-6 border-2 border-[#69d9d7]/30 border-t-[#69d9d7] rounded-full animate-spin"></div>
              <span className="text-[#69d9d7]">Procesando tu compra...</span>
            </div>
          ) : (
            <>
              <div className="bg-[#000000] p-6 rounded-lg border border-[#69d9d7]">
                <h3 className="text-[#69d9d7] font-bold text-xl mb-4">¿Qué sigue ahora?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-gray-300">Pago confirmado por MercadoPago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-[#69d9d7]" size={20} />
                    <span className="text-gray-300">
                      {emailSent ? "Email enviado con los archivos" : "Enviando email con los archivos..."}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Download className="text-[#69d9d7]" size={20} />
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
                <Button
                  variant="outline"
                  className="border-[#69d9d7] text-[#69d9d7] hover:bg-[#69d9d7] hover:text-black bg-transparent"
                >
                  Contactar Soporte
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
