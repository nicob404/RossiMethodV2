"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Mail } from "lucide-react"
import Link from "next/link"

export default function PaymentPendingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-[#343434]/50 border-[#343434]">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-white" size={40} />
          </div>
          <CardTitle className="text-white text-3xl">Pago Pendiente</CardTitle>
          <p className="text-gray-300 text-lg">Tu pago está siendo procesado</p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-[#000000] p-6 rounded-lg border border-yellow-500">
            <h3 className="text-yellow-400 font-bold text-xl mb-4">¿Qué significa esto?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-400" size={20} />
                <span className="text-gray-300">Tu pago está siendo verificado</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-[#69d9d7]" size={20} />
                <span className="text-gray-300">Te notificaremos por email cuando se confirme</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-400" size={20} />
                <span className="text-gray-300">Esto puede tomar hasta 24 horas</span>
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
        </CardContent>
      </Card>
    </div>
  )
}
