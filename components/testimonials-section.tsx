import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="py-20 bg-[#343434]/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Lo que dicen nuestros</span>{" "}
            <span className="text-[#69d9d7]">Estudiantes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-[#343434]/50 border-[#343434]">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={`/placeholder.svg?height=50&width=50&query=student testimonial ${i}`}
                    alt={`Testimonio ${i}`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="text-white font-semibold">Estudiante {i}</h4>
                    <div className="flex text-[#d8f494]">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  "El método de Rossi cambió completamente mi forma de entrenar. Logré mi primer handstand en solo 3
                  meses siguiendo su programa."
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
