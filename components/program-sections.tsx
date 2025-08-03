"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { CheckCircle, PlayCircle, PhoneIcon as Whatsapp } from "lucide-react"
import { ProtectedPurchaseButton } from "@/components/protected-purchase-button"
import { VideoModal } from "@/components/video-modal"
import { useState } from "react"

// WhatsApp number for contact
const WHATSAPP_NUMBER = "5493534220827" // Argentina, Cordoba number

export function EjercicioCasaSection() {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const videoUrl = "/placeholder.svg?height=720&width=1280" // Placeholder video URL

  return (
    <section id="ejercicio-casa" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=600&width=500"
              alt="Full Planche Workshop"
              width={500}
              height={600}
              className="rounded-lg object-cover"
            />
            <Button
              onClick={() => setShowVideoModal(true)}
              className="absolute bottom-4 right-4 bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black font-semibold px-6 py-3 rounded-full flex items-center gap-2"
            >
              <PlayCircle size={20} />
              Ver Preview
            </Button>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Full Planche</span> <span className="text-[#69d9d7]">Workshop</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Domina uno de los ejercicios estáticos más impresionantes de la calistenia. Este workshop te guiará paso a
              paso con progresiones efectivas y técnicas detalladas.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-[#d8f494]" size={20} />
                Progresiones desde cero
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-[#d8f494]" size={20} />
                Técnica detallada y errores comunes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-[#d8f494]" size={20} />
                Rutinas de entrenamiento completas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-[#d8f494]" size={20} />
                Acceso a comunidad exclusiva
              </li>
            </ul>
            <ProtectedPurchaseButton programName="Full Planche Workshop" mercadopagoLink="https://mpago.la/2iHmyp7" />
          </div>
        </div>
      </div>
      <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} videoUrl={videoUrl} />
    </section>
  )
}

export function CoachingSection() {
  return (
    <section id="coaching" className="py-20 bg-[#343434]/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Coaching</span> <span className="text-[#69d9d7]">Personal</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Lleva tu entrenamiento al siguiente nivel con un plan 100% personalizado y seguimiento directo. Ideal para
              objetivos específicos o superar estancamientos.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-[#d8f494]" size={20} />
                Plan de entrenamiento a medida
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-[#d8f494]" size={20} />
                Revisiones semanales de técnica
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-[#d8f494]" size={20} />
                Soporte y motivación constante
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-[#d8f494]" size={20} />
                Acceso prioritario a nuevos contenidos
              </li>
            </ul>
            <Card className="bg-[#1a1a1a] border-[#343434] text-white p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-[#69d9d7]">¡Comienza tu transformación!</CardTitle>
                <CardDescription className="text-gray-400">
                  Contáctame para una consulta gratuita y diseñemos tu camino al éxito.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20RossiMethod,%20quiero%20información%20sobre%20el%20Coaching%20Personal.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-[#d8f494] hover:bg-[#d8f494]/80 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                    <Whatsapp size={20} />
                    Contactar por WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=600&width=500"
              alt="Coaching Personal"
              width={500}
              height={600}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
