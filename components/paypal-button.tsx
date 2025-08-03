"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    paypal?: any
  }
}

interface PayPalButtonProps {
  amount: number
  currency?: string
  onSuccess: (details: any) => void
  onError: (error: any) => void
  onCancel?: () => void
  disabled?: boolean
}

export function PayPalButton({
  amount,
  currency = "USD",
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.paypal || !paypalRef.current || disabled) return

    const paypalButtons = window.paypal.Buttons({
      style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal",
        height: 50,
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount.toString(),
                currency_code: currency,
              },
              description: "Full Planche Workshop - RossiMethod",
            },
          ],
          application_context: {
            shipping_preference: "NO_SHIPPING",
          },
        })
      },
      onApprove: async (data: any, actions: any) => {
        try {
          const details = await actions.order.capture()
          console.log("PayPal payment successful:", details)
          onSuccess(details)
        } catch (error) {
          console.error("Error capturing PayPal payment:", error)
          onError(error)
        }
      },
      onError: (error: any) => {
        console.error("PayPal error:", error)
        onError(error)
      },
      onCancel: () => {
        console.log("PayPal payment cancelled")
        if (onCancel) onCancel()
      },
    })

    // Limpiar botones anteriores
    if (paypalRef.current) {
      paypalRef.current.innerHTML = ""
      paypalButtons.render(paypalRef.current)
    }

    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = ""
      }
    }
  }, [amount, currency, onSuccess, onError, onCancel, disabled])

  if (disabled) {
    return (
      <div className="w-full h-[50px] bg-gray-600 rounded flex items-center justify-center">
        <span className="text-gray-400">Completa todos los campos</span>
      </div>
    )
  }

  return <div ref={paypalRef} className="w-full" />
}
