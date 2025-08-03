import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-[#343434]/30 border-t border-[#343434] py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold mb-4 block">
              <span className="text-white">Rossi</span>
              <span className="text-[#69d9d7]">Method</span>
            </Link>
            <p className="text-gray-300 mb-4">Transformando vidas a través del dominio de los ejercicios estáticos</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-[#69d9d7] transition-colors">
                <Instagram size={24} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#69d9d7] transition-colors">
                <Facebook size={24} />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#69d9d7] transition-colors">
                <Youtube size={24} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#inicio" className="text-gray-300 hover:text-[#69d9d7] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#sobre-mi" className="text-gray-300 hover:text-[#69d9d7] transition-colors">
                  Sobre mi
                </Link>
              </li>
              <li>
                <Link href="#ejercicio-casa" className="text-gray-300 hover:text-[#69d9d7] transition-colors">
                  Full Planche Workshop
                </Link>
              </li>
              <li>
                <Link href="#testimonios" className="text-gray-300 hover:text-[#69d9d7] transition-colors">
                  Testimonios
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact (now part of ContactSection, but keeping for consistency if needed elsewhere) */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-300">
                <Mail size={16} />
                info@rossimethod.com
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone size={16} />
                +54 11 1234-5678
              </li>
            </ul>
          </div>

          {/* Newsletter (now part of ContactSection, but keeping for consistency if needed elsewhere) */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Recibe tips y contenido exclusivo</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Tu email"
                className="bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400"
              />
              <Button className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black">Suscribirse</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#343434] mt-12 pt-8 text-center">
          <p className="text-gray-300">© {new Date().getFullYear()} RossiMethod. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
