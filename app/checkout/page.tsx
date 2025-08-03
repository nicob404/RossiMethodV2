"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, CreditCard, Download, Shield, Star, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { MercadoPagoButton } from "@/components/mercadopago-button"

export default function CheckoutPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "Argentina",
    ciudad: "",
  })

  const coursePrice = 29900 // Precio en pesos argentinos (equivalente a ~97 USD)
  const coursePriceUSD = 97 // Para mostrar referencia en USD

  const courseDetails = {
    title: "Full Planche Workshop",
    description: "Programa completo para dominar el planche",
    duration: "12 semanas",
    includes: [
      "Manual completo en PDF (120+ páginas)",
      "Videos de técnica HD (3+ horas)",
      "Plan de entrenamiento personalizable",
      "Guía de progresiones paso a paso",
      "Acceso a comunidad privada",
      "Soporte por WhatsApp",
    ],
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "")
  }

  const handlePaymentError = (error: string) => {
    alert(`Error en el pago: ${error}`)
  }

  useEffect(() => {
    // Redirigir a la página principal ya que ahora usamos el botón directo
    router.push("/#ejercicio-casa")
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#343434] bg-[#343434]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#69d9d7] hover:text-[#69d9d7]/80">
              <ArrowLeft size={20} />
              <span>Volver</span>
            </Link>
            <div className="text-2xl font-bold">
              <span className="text-white">Rossi</span>
              <span className="text-[#69d9d7]">Method</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-green-400" size={20} />
              <span className="text-sm text-gray-300">Compra Segura</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Details */}
          <div>
            <Card className="bg-[#343434]/50 border-[#343434] mb-6">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    alt="Course"
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-white text-2xl">{courseDetails.title}</CardTitle>
                    <CardDescription className="text-gray-300">{courseDetails.description}</CardDescription>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="bg-[#69d9d7] text-black">
                        <Clock size={14} className="mr-1" />
                        {courseDetails.duration}
                      </Badge>
                      <div className="flex items-center gap-1 text-[#d8f494]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                        <span className="text-sm text-gray-300 ml-1">(4.9)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-[#343434]/50 border-[#343434]">
              <CardHeader>
                <CardTitle className="text-white">¿Qué incluye el curso?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courseDetails.includes.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="text-[#d8f494]" size={20} />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-[#000000] rounded-lg border border-[#69d9d7]">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="text-[#69d9d7]" size={20} />
                    <span className="text-[#69d9d7] font-semibold">Acceso Inmediato</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Recibirás todos los archivos por email inmediatamente después del pago
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <Card className="bg-[#343434]/50 border-[#343434]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard size={24} />
                  Información de Compra
                </CardTitle>
                <CardDescription className="text-gray-300">Completa tus datos para recibir el curso</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-white">
                        Nombre *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        className="bg-[#343434]/50 border-[#343434] text-white"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido" className="text-white">
                        Apellido *
                      </Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                        className="bg-[#343434]/50 border-[#343434] text-white"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email (donde recibirás el curso) *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-[#343434]/50 border-[#343434] text-white"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-white">
                      Teléfono *
                    </Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      className="bg-[#343434]/50 border-[#343434] text-white"
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pais" className="text-white">
                        País *
                      </Label>
                      <Input
                        id="pais"
                        name="pais"
                        value={formData.pais}
                        onChange={handleInputChange}
                        required
                        className="bg-[#343434]/50 border-[#343434] text-white"
                        placeholder="Argentina"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ciudad" className="text-white">
                        Ciudad *
                      </Label>
                      <Input
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        required
                        className="bg-[#343434]/50 border-[#343434] text-white"
                        placeholder="Buenos Aires"
                      />
                    </div>
                  </div>

                  <Separator className="bg-[#343434]" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white font-semibold">${coursePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl">
                      <span className="text-white font-bold">Total:</span>
                      <div className="text-right">
                        <span className="text-[#69d9d7] font-bold">${coursePrice.toLocaleString()} ARS</span>
                        <p className="text-sm text-gray-400">≈ ${coursePriceUSD} USD</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#343434]" />

                  {/* Payment Section */}
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold text-lg">Método de Pago</h3>

                    <div className="p-4 bg-[#000000] rounded-lg border border-[#343434]">
                      <div className="flex items-center gap-3 mb-4">
                        <Image
                          src="/placeholder.svg?height=32&width=120&text=MercadoPago"
                          alt="MercadoPago"
                          width={120}
                          height={32}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">MercadoPago</p>
                          <p className="text-gray-400 text-sm">Tarjetas, efectivo, transferencia</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="text-green-400" size={16} />
                          <span>Hasta 12 cuotas sin interés</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="text-green-400" size={16} />
                          <span>Pago en efectivo (Rapipago, Pago Fácil)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="text-green-400" size={16} />
                          <span>Transferencia bancaria</span>
                        </div>
                      </div>

                      <MercadoPagoButton
                        amount={coursePrice}
                        title={courseDetails.title}
                        description={courseDetails.description}
                        customerData={formData}
                        disabled={!isFormValid()}
                        onError={handlePaymentError}
                      />

                      {!isFormValid() && (
                        <p className="text-yellow-400 text-sm mt-2">
                          ⚠️ Completa todos los campos para habilitar el pago
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-400">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield size={16} />
                      <span>Compra 100% segura y protegida</span>
                    </div>
                    <p>Recibirás el curso inmediatamente en tu email</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
