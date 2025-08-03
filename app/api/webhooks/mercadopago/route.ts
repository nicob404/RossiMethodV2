import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Webhook MercadoPago recibido:", body)

    // Verificar que es una notificación de pago
    if (body.type === "payment") {
      const paymentId = body.data.id

      // Aquí normalmente consultarías la API de MercadoPago para obtener detalles del pago
      // Por simplicidad, vamos a simular que el pago fue exitoso
      console.log("Procesando pago ID:", paymentId)

      // Simular datos del pago (en producción vendrían de MercadoPago)
      const paymentData = {
        id: paymentId,
        status: "approved",
        transaction_amount: 29900,
        payer: {
          email: "cliente@email.com", // Este vendría del external_reference
        },
        external_reference: `${Date.now()}-cliente@email.com`,
      }

      if (paymentData.status === "approved") {
        const email = paymentData.external_reference?.split("-")[1]

        if (email) {
          // Buscar usuario en la base de datos
          const { data: usuario, error: userError } = await supabase
            .from("usuarios")
            .select("*")
            .eq("email", email)
            .single()

          if (userError) {
            console.error("Error buscando usuario:", userError)
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
          }

          // Registrar la compra
          const { error: purchaseError } = await supabase.from("compras").insert({
            user_id: usuario.id,
            curso: "Full Planche Workshop",
            precio: paymentData.transaction_amount / 100, // Convertir centavos a pesos
            mercadopago_payment_id: paymentId.toString(),
            estado: "completado",
          })

          if (purchaseError) {
            console.error("Error registrando compra:", purchaseError)
            return NextResponse.json({ error: "Error registrando compra" }, { status: 500 })
          }

          // Enviar email con los materiales
          await sendCourseEmail(usuario.email, usuario.nombre_completo, paymentId.toString())

          console.log("Compra procesada exitosamente para:", email)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error en webhook MercadoPago:", error)
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 })
  }
}

async function sendCourseEmail(email: string, nombre: string, paymentId: string) {
  try {
    // Links de descarga (reemplaza con tus links reales de Google Drive)
    const downloadLinks = {
      manual: "https://drive.google.com/file/d/TU_LINK_DEL_MANUAL/view",
      videos: "https://drive.google.com/drive/folders/TU_LINK_DE_VIDEOS",
      planEntrenamiento: "https://drive.google.com/file/d/TU_LINK_DEL_PLAN/view",
      comunidad: "https://chat.whatsapp.com/TU_LINK_DEL_GRUPO",
    }

    const emailResult = await resend.emails.send({
      from: "RossiMethod <onboarding@resend.dev>",
      to: [email],
      subject: "🎉 ¡Bienvenido al Full Planche Workshop! - Descarga tus materiales",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #69d9d7; margin: 0; font-size: 32px;">RossiMethod</h1>
            <p style="color: #cccccc; margin: 5px 0; font-size: 18px;">¡Bienvenido al Full Planche Workshop!</p>
          </div>
          
          <div style="background-color: #343434; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #69d9d7; margin-top: 0;">¡Hola ${nombre}! 🎉</h2>
            
            <p style="color: #ffffff; line-height: 1.8; font-size: 16px;">
              ¡Felicitaciones! Tu compra del <strong style="color: #d8f494;">Full Planche Workshop</strong> ha sido procesada exitosamente.
            </p>

            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d8f494;">
              <h3 style="color: #d8f494; margin-top: 0;">📦 Tus materiales del curso:</h3>
              
              <div style="margin: 15px 0;">
                <a href="${downloadLinks.manual}" style="display: inline-block; background-color: #69d9d7; color: #000000; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px 10px 5px 0;">
                  📖 Descargar Manual PDF
                </a>
              </div>
              
              <div style="margin: 15px 0;">
                <a href="${downloadLinks.videos}" style="display: inline-block; background-color: #69d9d7; color: #000000; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px 10px 5px 0;">
                  🎥 Descargar Videos HD
                </a>
              </div>
              
              <div style="margin: 15px 0;">
                <a href="${downloadLinks.planEntrenamiento}" style="display: inline-block; background-color: #69d9d7; color: #000000; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px 10px 5px 0;">
                  📋 Plan de Entrenamiento
                </a>
              </div>
            </div>

            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d8f494;">
              <h3 style="color: #d8f494; margin-top: 0;">💬 Únete a la comunidad:</h3>
              <div style="margin: 15px 0;">
                <a href="${downloadLinks.comunidad}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  📱 Unirse al Grupo de WhatsApp
                </a>
              </div>
              <p style="color: #cccccc; font-size: 14px; margin-top: 10px;">
                Conecta con otros estudiantes, comparte tu progreso y recibe soporte directo.
              </p>
            </div>

            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #69d9d7;">
              <h3 style="color: #69d9d7; margin-top: 0;">🚀 Próximos pasos:</h3>
              <ol style="color: #ffffff; line-height: 1.8;">
                <li>Descarga todos los materiales usando los botones de arriba</li>
                <li>Lee el manual completo para entender la metodología</li>
                <li>Mira los videos de técnica antes de empezar</li>
                <li>Únete al grupo de WhatsApp para soporte</li>
                <li>¡Comienza tu transformación hoy mismo!</li>
              </ol>
            </div>

            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #69d9d7;">
              <h3 style="color: #69d9d7; margin-top: 0;">🔐 Acceso a tu área personal:</h3>
              <p style="color: #ffffff; margin-bottom: 15px;">
                También puedes acceder a todos tus materiales desde tu área personal en cualquier momento:
              </p>
              <div style="margin: 15px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/mi-area" style="display: inline-block; background-color: #69d9d7; color: #000000; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  🏠 Ir a Mi Área Personal
                </a>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; padding: 25px; background-color: #343434; border-radius: 10px;">
            <h3 style="color: #69d9d7; margin-top: 0;">¿Necesitas ayuda?</h3>
            <p style="color: #cccccc; margin: 10px 0;">
              Si tienes alguna pregunta o problema con las descargas, no dudes en contactarme:
            </p>
            <p style="color: #69d9d7; margin: 0;">
              📧 info@rossimethod.com<br>
              📱 WhatsApp: +54 11 1234-5678
            </p>
            <div style="margin-top: 20px;">
              <p style="color: #cccccc; margin: 0;">
                ¡Estoy emocionado de acompañarte en este viaje!<br>
                <strong style="color: #69d9d7; font-size: 18px;">Fran - RossiMethod</strong>
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #343434; border-radius: 8px;">
            <p style="color: #888; margin: 0; font-size: 12px;">
              ID de pago: ${paymentId} | Fecha: ${new Date().toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
      `,
    })

    console.log("Email enviado exitosamente:", emailResult)
    return emailResult
  } catch (error) {
    console.error("Error enviando email:", error)
    throw error
  }
}
