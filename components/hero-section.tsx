"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-white">Dominá los</span>
          <br />
          <span className="text-[#69d9d7]">Estáticos</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Transformá tu cuerpo y mente con el método más efectivo para dominar los ejercicios estáticos
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => document.getElementById("ejercicio-casa")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[#69d9d7] hover:bg-[#69d9d7]/80 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
          >
            Programas
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById("coaching")?.scrollIntoView({ behavior: "smooth" })}
            className="border-[#69d9d7] text-[#69d9d7] hover:bg-[#69d9d7] hover:text-black px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 bg-transparent"
          >
            Coaching
          </Button>
        </div>
      </div>
    </section>
  )
}
