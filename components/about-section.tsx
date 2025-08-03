import Image from "next/image"
import { Award, Users } from "lucide-react"

export function AboutSection() {
  return (
    <section id="sobre-mi" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Sobre</span> <span className="text-[#69d9d7]">Mi</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Con más de 10 años de experiencia en el mundo del fitness y la calistenia, he desarrollado un método único
              que combina ciencia, técnica y pasión para ayudarte a dominar los ejercicios estáticos más desafiantes.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Mi enfoque se basa en la progresión sistemática, la técnica perfecta y la comprensión profunda de la
              biomecánica del movimiento humano.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-[#343434]/50 px-4 py-2 rounded-lg">
                <Award className="text-[#69d9d7]" size={20} />
                <span className="text-white">Certificado Internacional</span>
              </div>
              <div className="flex items-center gap-2 bg-[#343434]/50 px-4 py-2 rounded-lg">
                <Users className="text-[#69d9d7]" size={20} />
                <span className="text-white">+1000 Estudiantes</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=600&width=500"
              alt="Instructor"
              width={500}
              height={600}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
