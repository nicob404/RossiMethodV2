"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { AuthModal } from "@/components/auth-modal"
import { ShoppingCart } from "lucide-react"

interface ProtectedPurchaseButtonProps {
  programName: string
  mercadopagoLink: string
}

export function ProtectedPurchaseButton({ programName, mercadopagoLink }: ProtectedPurchaseButtonProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handlePurchaseClick = () => {
    if (loading) {
      console.log("🛒 Loading user status...")
      return
    }

    if (!user) {
      console.log("🛒 User not logged in, showing auth modal.")
      setShowAuthModal(true)
    } else {
      console.log(`🛒 User ${user.email} is logged in. Redirecting to MercadoPago for ${programName}.`)
      window.location.href = mercadopagoLink
    }
  }

  return (
    <>
      <Button
        onClick={handlePurchaseClick}
        className="bg-[#d8f494] hover:bg-[#d8f494]/80 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        disabled={loading}
      >
        <ShoppingCart size={20} />
        {loading ? "Cargando..." : "Comprar Ahora"}
      </Button>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          // Optionally, redirect to MercadoPago immediately after successful login
          // window.location.href = mercadopagoLink;
        }}
      />
    </>
  )
}
