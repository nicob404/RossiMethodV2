"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-[#343434]/50 border-[#343434]">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-white" size={40} />
          </div>
          <CardTitle className="text-white text-3xl">Pago No Completado</CardTitle>
          <p className="text-gray-300 text-lg">Hubo un problema con tu pago</p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-[#000000] p-6 rounded-lg border border-red-500">
            <h3 className="text-red-400 font-bold text-xl mb-4">¿Qué puedes hacer?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <ArrowLeft className="text-[#69d9d7]" size={20} />
                <span className="text-gray-300">Intenta nuevamente con otro método de pago</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowLeft className="text-[#69d9d7]" size={20} />
                <span className="text-gray-300">Verifica que tus datos sean correctos</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowLeft className="text-[#69d9d7]" size={20} />
                <span className="text-gray-300">Contacta a soporte si el problema persiste</span>
              </div>
            </div>
          </div>

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
