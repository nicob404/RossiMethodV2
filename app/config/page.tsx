"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ConfigPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const isValidUrl = baseUrl.startsWith("http")

  const envVars = [
    {
      key: "MERCADOPAGO_ACCESS_TOKEN",
      value: process.env.MERCADOPAGO_ACCESS_TOKEN,
      required: true,
      description: "Token de acceso de MercadoPago",
      status: process.env.MERCADOPAGO_ACCESS_TOKEN ? "configured" : "missing",
    },
    {
      key: "NEXT_PUBLIC_BASE_URL",
      value: baseUrl,
      required: true,
      description: "URL base de tu aplicación",
      status: isValidUrl ? "configured" : "invalid",
    },
    {
      key: "RESEND_API_KEY",
      value: process.env.RESEND_API_KEY,
      required: true,
      description: "API Key de Resend para emails",
      status: process.env.RESEND_API_KEY ? "configured" : "missing",
    },
  ]

  const returnUrls = [
    { name: "Success", url: `${baseUrl}/payment/success` },
    { name: "Failure", url: `${baseUrl}/payment/failure` },
    { name: "Pending", url: `${baseUrl}/payment/pending` },
    { name: "Webhook", url: `${baseUrl}/api/webhooks/mercadopago` },
  ]

  const testTokens = {
    sandbox: "TEST-2854066768122838-072022-cf52432afab4d825e7a6af2702df32a3-148289827",
    envExample: `MERCADOPAGO_ACCESS_TOKEN=TEST-2854066768122838-072022-cf52432afab4d825e7a6af2702df32a3-148289827
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=re_tu_api_key_aqui`,
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#69d9d7] mb-2">Configuración de RossiMethod</h1>
          <p className="text-gray-300">Verifica que todas las variables de entorno estén configuradas</p>
        </div>

        {/* Estado de Variables de Entorno */}
        <Card className="bg-[#343434]/50 border-[#343434] mb-8">
          <CardHeader>
            <CardTitle className="text-white">Variables de Entorno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {envVars.map((envVar) => (
                <div key={envVar.key} className="flex items-center justify-between p-4 bg-[#000000] rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {envVar.status === "configured" ? (
                        <CheckCircle className="text-green-400" size={20} />
                      ) : envVar.status === "invalid" ? (
                        <AlertTriangle className="text-yellow-400" size={20} />
                      ) : (
                        <XCircle className="text-red-400" size={20} />
                      )}
                      <div>
                        <p className="text-white font-medium">{envVar.key}</p>
                        <p className="text-gray-400 text-sm">{envVar.description}</p>
                        {envVar.status === "invalid" && (
                          <p className="text-yellow-400 text-xs mt-1">
                            ⚠️ Debe ser una URL completa (ej: http://localhost:3000)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {envVar.status === "configured" ? (
                      <Badge className="bg-green-500 text-white">Configurado</Badge>
                    ) : envVar.status === "invalid" ? (
                      <Badge className="bg-yellow-500 text-black">Inválido</Badge>
                    ) : (
                      <Badge className="bg-red-500 text-white">Faltante</Badge>
                    )}
                    {envVar.value && envVar.status === "configured" && (
                      <p className="text-gray-400 text-sm font-mono">{envVar.value.substring(0, 20)}...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* URLs de Retorno */}
        <Card className="bg-[#343434]/50 border-[#343434] mb-8">
          <CardHeader>
            <CardTitle className="text-white">URLs de Retorno (MercadoPago)</CardTitle>
            <p className="text-gray-300 text-sm">
              Estas URLs son requeridas por MercadoPago para el funcionamiento correcto
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {returnUrls.map((urlInfo) => (
                <div key={urlInfo.name} className="flex items-center justify-between p-3 bg-[#000000] rounded-lg">
                  <div className="flex items-center gap-3">
                    {isValidUrl ? (
                      <CheckCircle className="text-green-400" size={16} />
                    ) : (
                      <XCircle className="text-red-400" size={16} />
                    )}
                    <div>
                      <p className="text-white font-medium">{urlInfo.name}</p>
                      <code className="text-gray-400 text-sm">{urlInfo.url}</code>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(urlInfo.url, "_blank")}
                    className="border-[#69d9d7] text-[#69d9d7] hover:bg-[#69d9d7] hover:text-black"
                  >
                    <ExternalLink size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuración Completa */}
        <Card className="bg-[#343434]/50 border-[#343434] mb-8">
          <CardHeader>
            <CardTitle className="text-white">Archivo .env.local Completo</CardTitle>
            <p className="text-gray-300 text-sm">Copia este contenido en tu archivo .env.local</p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-[#000000] p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                <code>{testTokens.envExample}</code>
              </pre>
              <Button
                size="sm"
                onClick={() => copyToClipboard(testTokens.envExample, "env")}
                className="absolute top-2 right-2 bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black"
              >
                {copied === "env" ? "¡Copiado!" : <Copy size={14} />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instrucciones */}
        <Card className="bg-[#343434]/50 border-[#343434]">
          <CardHeader>
            <CardTitle className="text-white">Pasos para Configurar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#69d9d7] rounded-full flex items-center justify-center text-black font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-white font-medium">Crear/Actualizar .env.local</h4>
                  <p className="text-gray-400 text-sm">
                    Copia el contenido de arriba en tu archivo .env.local en la raíz del proyecto
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#69d9d7] rounded-full flex items-center justify-center text-black font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-white font-medium">Obtener token real de MercadoPago</h4>
                  <p className="text-gray-400 text-sm">
                    Ve a{" "}
                    <a
                      href="https://www.mercadopago.com.ar/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#69d9d7] hover:underline"
                    >
                      MercadoPago Developers
                    </a>{" "}
                    y reemplaza el token de prueba
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#69d9d7] rounded-full flex items-center justify-center text-black font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-white font-medium">Reiniciar servidor</h4>
                  <p className="text-gray-400 text-sm">
                    Después de agregar las variables, reinicia tu servidor de desarrollo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#69d9d7] rounded-full flex items-center justify-center text-black font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="text-white font-medium">Probar el checkout</h4>
                  <p className="text-gray-400 text-sm">Ve a /checkout y prueba el flujo completo de pago</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => (window.location.href = "/checkout")}
                className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black"
              >
                Probar Checkout
              </Button>
              <Button
                onClick={() =>
                  (window.location.href = "/payment/demo?preference_id=demo-test&customer_email=test@email.com")
                }
                variant="outline"
                className="border-[#69d9d7] text-[#69d9d7] hover:bg-[#69d9d7] hover:text-black bg-transparent"
              >
                Probar Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
