"use client"

import { useEffect, useRef } from "react"

interface MercadoPagoSimpleButtonProps {
  preferenceId: string
  className?: string
}

export function MercadoPagoSimpleButton({ preferenceId, className = "" }: MercadoPagoSimpleButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Limpiar cualquier script anterior
    if (buttonRef.current) {
      buttonRef.current.innerHTML = ""
    }

    // Crear el script de MercadoPago
    const script = document.createElement("script")
    script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js"
    script.setAttribute("data-preference-id", preferenceId)
    script.setAttribute("data-source", "button")

    // Agregar el script al contenedor
    if (buttonRef.current) {
      buttonRef.current.appendChild(script)
    }

    // Cleanup function
    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = ""
      }
    }
  }, [preferenceId])

  return <div ref={buttonRef} className={className} />
}
