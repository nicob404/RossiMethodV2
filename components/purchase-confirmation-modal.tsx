"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, PhoneIcon as Whatsapp } from "lucide-react"
import Confetti from "react-confetti"
import { useEffect, useState } from "react"

interface PurchaseConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PurchaseConfirmationModal({ isOpen, onClose }: PurchaseConfirmationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000) // Confetti lasts for 3 seconds
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    setShowConfetti(false)
    onClose()
  }

  const WHATSAPP_NUMBER = "5493534220827" // Argentina, Cordoba number
  const EMAIL_ADDRESS = "info@rossimethod.com"

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} gravity={0.1} />}
      <DialogContent className="sm:max-w-[425px] bg-black text-white border-[#343434]">
        <DialogHeader className="flex flex-col items-center text-center">
          <CheckCircle className="text-[#d8f494] w-16 h-16 mb-4 animate-bounce" />
          <DialogTitle className="text-3xl font-bold text-[#69d9d7]">¡Gracias por tu compra! 🎉</DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            ¡Tu compra fue exitosa!
            <br />
            Revisa tu email para encontrar los archivos del curso.
            <br />
            Si tienes cualquier problema con tu compra, no dudes en escribirme por email o WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <a
            href={`mailto:${EMAIL_ADDRESS}?subject=Consulta%20sobre%20mi%20compra`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black font-semibold flex items-center justify-center gap-2">
              <Mail size={20} />
              Enviar Email
            </Button>
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20RossiMethod,%20tengo%20una%20consulta%20sobre%20mi%20compra.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-[#d8f494] hover:bg-[#d8f494]/80 text-black font-semibold flex items-center justify-center gap-2">
              <Whatsapp size={20} />
              Contactar por WhatsApp
            </Button>
          </a>
        </div>
        <Button
          onClick={handleClose}
          variant="outline"
          className="border-[#343434] text-white hover:bg-[#343434]/50 bg-transparent"
        >
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  )
}
