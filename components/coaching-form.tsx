"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Phone, User, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { sendCoachingEmail } from "@/app/actions/send-email"

export function CoachingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      console.log("Enviando formulario:", formData)
      const result = await sendCoachingEmail(formData)
      console.log("Resultado:", result)

      if (result.success) {
        setSubmitStatus("success")
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          mensaje: "",
        })
      } else {
        console.error("Error en el envío:", result.error)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-[#343434]/50 border-[#343434]">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Solicitar Coaching Personal</CardTitle>
        <CardDescription className="text-gray-300">
          Completa el formulario y me pondré en contacto contigo en menos de 24 horas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Apellido */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-white flex items-center gap-2">
              <User size={16} className="text-[#69d9d7]" />
              Nombre y Apellido
            </Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tu nombre completo"
              className="bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400 focus:border-[#69d9d7] focus:ring-[#69d9d7]"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white flex items-center gap-2">
              <Mail size={16} className="text-[#69d9d7]" />
              Mail de contacto
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="tu@email.com"
              className="bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400 focus:border-[#69d9d7] focus:ring-[#69d9d7]"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-white flex items-center gap-2">
              <Phone size={16} className="text-[#69d9d7]" />
              Número de celular
            </Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleInputChange}
              required
              placeholder="+54 9 11 1234-5678"
              className="bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400 focus:border-[#69d9d7] focus:ring-[#69d9d7]"
            />
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <Label htmlFor="mensaje" className="text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-[#69d9d7]" />
              Mensaje
            </Label>
            <Textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
              required
              placeholder="Cuéntame sobre tus objetivos, nivel actual y qué te gustaría lograr con el coaching..."
              rows={5}
              className="bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400 focus:border-[#69d9d7] focus:ring-[#69d9d7] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black font-semibold py-3 text-lg transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                Enviando...
              </div>
            ) : (
              "Enviar Solicitud"
            )}
          </Button>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <CheckCircle className="text-green-400" size={20} />
              <p className="text-green-400 font-medium">¡Mensaje enviado exitosamente! Te contactaré pronto.</p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <AlertCircle className="text-red-400" size={20} />
              <p className="text-red-400 font-medium">Error al enviar el mensaje. Por favor, intenta nuevamente.</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
