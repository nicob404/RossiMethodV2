"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Award, Home, User, Calendar, MessageSquare, ChevronDown, LogIn, UserCircle } from "lucide-react"
import Link from "next/link"
import { EjercicioCasaSection, CoachingSection } from "@/components/program-sections"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { useSearchParams } from "next/navigation"
import { PurchaseConfirmationModal } from "@/components/purchase-confirmation-modal"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { FAQSection } from "@/components/faq-section"

export default function HomePage() {
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const status = searchParams.get("status")
    const collectionStatus = searchParams.get("collection_status")
    const paymentId = searchParams.get("payment_id")

    console.log("🔍 Parámetros de URL detectados:", {
      status,
      paymentId,
      collectionStatus,
    })

    if (
      (status === "approved" || collectionStatus === "approved") &&
      paymentId &&
      !sessionStorage.getItem("purchase_modal_shown")
    ) {
      console.log("✅ Pago exitoso detectado, mostrando confirmación")
      setShowConfirmationModal(true)
      sessionStorage.setItem("purchase_modal_shown", "true")

      const url = new URL(window.location.href)
      url.searchParams.delete("status")
      url.searchParams.delete("payment_id")
      url.searchParams.delete("collection_status")
      url.searchParams.delete("collection_id")
      url.searchParams.delete("preference_id")
      url.searchParams.delete("external_reference")
      url.searchParams.delete("payment_type")
      url.searchParams.delete("merchant_order_id")

      window.history.replaceState({}, "", url.pathname)
    } else if (sessionStorage.getItem("purchase_modal_shown")) {
      sessionStorage.removeItem("purchase_modal_shown")
    }
  }, [searchParams])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold">
              <span className="text-white">Rossi</span>
              <span className="text-[#69d9d7]">Method</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#inicio"
                className="text-white hover:text-[#69d9d7] transition-colors duration-300 flex items-center gap-2"
              >
                <Home size={16} />
                Inicio
              </Link>
              <Link
                href="#sobre-mi"
                className="text-white hover:text-[#69d9d7] transition-colors duration-300 flex items-center gap-2"
              >
                <User size={16} />
                Sobre mi
              </Link>

              {/* Programs Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsProgramsDropdownOpen(true)}
                onMouseLeave={() => setIsProgramsDropdownOpen(false)}
              >
                <button className="text-white hover:text-[#69d9d7] transition-colors duration-300 flex items-center gap-2">
                  <Calendar size={16} />
                  Programas
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isProgramsDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isProgramsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-sm border border-[#343434] rounded-lg shadow-xl z-50">
                    <div className="py-2">
                      <Link
                        href="#ejercicio-casa"
                        className="block px-4 py-3 text-white hover:text-[#69d9d7] hover:bg-[#343434]/50 transition-all duration-300 border-b border-[#343434]/50"
                      >
                        <div className="flex items-center gap-3">
                          <Home size={16} className="text-[#69d9d7]" />
                          <div>
                            <div className="font-medium">Full Planche Workshop</div>
                            <div className="text-sm text-gray-400">Domina el planche completo</div>
                          </div>
                        </div>
                      </Link>
                      <Link
                        href="#coaching"
                        className="block px-4 py-3 text-white hover:text-[#69d9d7] hover:bg-[#343434]/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <Award size={16} className="text-[#69d9d7]" />
                          <div>
                            <div className="font-medium">Coaching Personal</div>
                            <div className="text-sm text-gray-400">Entrenamiento personalizado</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="#testimonios"
                className="text-white hover:text-[#69d9d7] transition-colors duration-300 flex items-center gap-2"
              >
                <MessageSquare size={16} />
                Testimonios
              </Link>

              {/* User Area / Login */}
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#69d9d7]/30 border-t-[#69d9d7] rounded-full animate-spin"></div>
              ) : user ? (
                <Link
                  href="/mi-area"
                  className="text-white hover:text-[#69d9d7] transition-colors duration-300 flex items-center gap-2"
                >
                  <UserCircle size={16} />
                  Mi Área
                </Link>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black font-semibold"
                >
                  <LogIn size={16} className="mr-2" />
                  Iniciar Sesión
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={toggleMenu} className="md:hidden text-white hover:text-[#69d9d7] transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-[#343434]">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="#inicio" className="block px-3 py-2 text-white hover:text-[#69d9d7] transition-colors">
                  Inicio
                </Link>
                <Link href="#sobre-mi" className="block px-3 py-2 text-white hover:text-[#69d9d7] transition-colors">
                  Sobre mi
                </Link>
                <Link
                  href="#ejercicio-casa"
                  className="block px-3 py-2 text-white hover:text-[#69d9d7] transition-colors"
                >
                  Full Planche Workshop
                </Link>
                <Link href="#testimonios" className="block px-3 py-2 text-white hover:text-[#69d9d7] transition-colors">
                  Testimonios
                </Link>
                {user ? (
                  <Link href="/mi-area" className="block px-3 py-2 text-white hover:text-[#69d9d7] transition-colors">
                    Mi Área
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="block px-3 py-2 text-white hover:text-[#69d9d7] transition-colors w-full text-left"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <EjercicioCasaSection />
        <CoachingSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />

      {/* Purchase Confirmation Modal */}
      {showConfirmationModal && <PurchaseConfirmationModal onClose={() => setShowConfirmationModal(false)} />}
    </div>
  )
}
