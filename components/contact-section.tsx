import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contacto" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Contáctame</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              ¿Tienes preguntas? ¿Necesitas asesoramiento personalizado? No dudes en contactarme. Estoy aquí para
              ayudarte a alcanzar tus metas.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300 text-lg">
                <Mail size={20} className="text-[#69d9d7]" />
                info@rossimethod.com
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-lg">
                <Phone size={20} className="text-[#69d9d7]" />
                +54 11 1234-5678
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">Suscríbete a mi Newsletter</h3>
            <p className="text-lg text-gray-300 mb-4">
              Recibe tips exclusivos, actualizaciones de programas y contenido de valor directamente en tu bandeja de
              entrada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Tu email"
                className="flex-1 bg-[#343434]/50 border-[#343434] text-white placeholder:text-gray-400"
              />
              <Button className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black font-semibold px-6 py-3">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
