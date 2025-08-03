import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "¿Necesito experiencia previa para empezar?",
      answer:
        "No, mis programas están diseñados para todos los niveles, desde principiantes hasta atletas avanzados. Ofrezco progresiones y regresiones para adaptarnos a tu nivel actual.",
    },
    {
      question: "¿Qué equipo necesito para los entrenamientos?",
      answer:
        "Para la mayoría de los programas, solo necesitarás tu peso corporal y una barra de dominadas. Algunos ejercicios avanzados pueden requerir paralelas o anillas, pero no son obligatorios para empezar.",
    },
    {
      question: "¿Cuánto tiempo duran los programas?",
      answer:
        "La duración varía según el programa. Algunos son workshops intensivos de pocas semanas, mientras que otros son planes de entrenamiento a largo plazo. Toda la información está detallada en la descripción de cada programa.",
    },
    {
      question: "¿Ofrecen reembolsos?",
      answer:
        "Sí, ofrecemos una garantía de satisfacción. Si no estás contento con el programa, contáctanos dentro de los 7 días posteriores a la compra para solicitar un reembolso completo.",
    },
    {
      question: "¿Puedo combinar diferentes programas?",
      answer:
        "Sí, muchos de mis estudiantes combinan programas para acelerar su progreso o trabajar en diferentes habilidades. Te recomiendo consultarme para crear un plan personalizado si deseas combinar programas.",
    },
  ]

  return (
    <section id="faq" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Preguntas</span> <span className="text-[#69d9d7]">Frecuentes</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre mis programas y metodología.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#343434]">
              <AccordionTrigger className="text-lg text-white hover:text-[#69d9d7] transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-base pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
