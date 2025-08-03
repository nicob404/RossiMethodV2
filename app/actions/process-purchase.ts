"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface PurchaseData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  pais: string
  ciudad: string
  courseTitle: string
  amount: number
  paymentMethod?: string
  paymentId?: string
  payerEmail?: string
  transactionId?: string
}

export async function processPurchase(purchaseData: PurchaseData) {
  try {
    console.log("Procesando compra con PayPal:", purchaseData)

    const {
      nombre,
      apellido,
      email,
      telefono,
      pais,
      ciudad,
      courseTitle,
      amount,
      paymentMethod,
      paymentId,
      payerEmail,
      transactionId,
    } = purchaseData

    // Validación básica
    if (!nombre || !apellido || !email || !telefono || !pais || !ciudad) {
      return { success: false, error: "Todos los campos son requeridos" }
    }

    // Verificar que tenemos la API key de Resend
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY no está configurada")
      return { success: false, error: "Configuración de email no disponible" }
    }

    console.log("Enviando email con archivos del curso...")

    // Email para el cliente con los archivos del curso
    const emailToClient = await resend.emails.send({
      from: "RossiMethod <onboarding@resend.dev>",
      to: [email],
      subject: `🎉 ¡Bienvenido al ${courseTitle}! - Descarga tus archivos`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #69d9d7; margin: 0; font-size: 32px;">RossiMethod</h1>
            <p style="color: #cccccc; margin: 5px 0; font-size: 18px;">¡Bienvenido al ${courseTitle}!</p>
          </div>
          
          <div style="background-color: #343434; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #69d9d7; margin-top: 0;">¡Hola ${nombre}! 🎉</h2>
            
            <p style="color: #ffffff; line-height: 1.8; font-size: 16px;">
              ¡Felicitaciones! Tu compra del <strong style="color: #d8f494;">${courseTitle}</strong> ha sido procesada exitosamente.
            </p>

            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d8f494;">
              <h3 style="color: #d8f494; margin-top: 0;">✅ Detalles de tu compra:</h3>
              <p style="color: #cccccc; margin: 5px 0;"><strong>Curso:</strong> ${courseTitle}</p>
              <p style="color: #cccccc; margin: 5px 0;"><strong>Monto:</strong> $${amount} USD</p>
              <p style="color: #cccccc; margin: 5px 0;"><strong>Método de pago:</strong> ${paymentMethod || "PayPal"}</p>
              <p style="color: #cccccc; margin: 5px 0;"><strong>ID de transacción:</strong> ${transactionId || paymentId}</p>
              <p style="color: #cccccc; margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleDateString(
                "es-AR",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}</p>
            </div>
            
            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #69d9d7;">
              <h3 style="color: #69d9d7; margin-top: 0;">📦 Tus archivos del curso:</h3>
              <ul style="color: #ffffff; line-height: 1.8;">
                <li>📖 Manual Completo PDF (120+ páginas)</li>
                <li>🎥 Videos de Técnica HD (3+ horas)</li>
                <li>📋 Plan de Entrenamiento Personalizable</li>
                <li>📈 Guía de Progresiones Paso a Paso</li>
                <li>💬 Acceso a Comunidad Privada</li>
                <li>📱 Soporte por WhatsApp</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #69d9d7; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                📥 DESCARGAR ARCHIVOS
              </a>
            </div>

            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d8f494;">
              <h3 style="color: #d8f494; margin-top: 0;">🚀 Próximos pasos:</h3>
              <ol style="color: #ffffff; line-height: 1.8;">
                <li>Descarga todos los archivos del curso</li>
                <li>Lee el manual completo para entender la metodología</li>
                <li>Mira los videos de técnica antes de empezar</li>
                <li>Únete a nuestra comunidad privada</li>
                <li>¡Comienza tu transformación hoy mismo!</li>
              </ol>
            </div>
          </div>
          
          <div style="text-align: center; padding: 25px; background-color: #343434; border-radius: 10px;">
            <h3 style="color: #69d9d7; margin-top: 0;">¿Necesitas ayuda?</h3>
            <p style="color: #cccccc; margin: 10px 0;">
              Si tienes alguna pregunta o problema con la descarga, no dudes en contactarme:
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
        </div>
      `,
      // Aquí agregarías los archivos como attachments
      attachments: [
        // Ejemplo de cómo agregar archivos
        // {
        //   filename: 'full-planche-workshop-manual.pdf',
        //   path: './course-files/manual.pdf'
        // },
        // {
        //   filename: 'video-tecnicas.mp4',
        //   path: './course-files/video.mp4'
        // }
      ],
    })

    console.log("Email al cliente enviado:", emailToClient)

    // Email de notificación para ti con detalles de la venta
    await resend.emails.send({
      from: "RossiMethod <onboarding@resend.dev>",
      to: ["nicolas.gino21@gmail.com"],
      subject: `💰 Nueva Venta PayPal - ${courseTitle} - $${amount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #69d9d7; margin: 0; font-size: 32px;">🎉 Nueva Venta!</h1>
            <p style="color: #d8f494; margin: 5px 0; font-size: 18px;">Pago procesado con PayPal</p>
          </div>
          
          <div style="background-color: #343434; padding: 25px; border-radius: 10px;">
            <h2 style="color: #69d9d7; margin-top: 0;">Detalles de la compra:</h2>
            
            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #d8f494; margin: 5px 0;"><strong>Curso:</strong> ${courseTitle}</p>
              <p style="color: #d8f494; margin: 5px 0;"><strong>Monto:</strong> $${amount} USD</p>
              <p style="color: #d8f494; margin: 5px 0;"><strong>Método:</strong> ${paymentMethod || "PayPal"}</p>
              <p style="color: #ffffff; margin: 5px 0;"><strong>Cliente:</strong> ${nombre} ${apellido}</p>
              <p style="color: #ffffff; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="color: #ffffff; margin: 5px 0;"><strong>Teléfono:</strong> ${telefono}</p>
              <p style="color: #ffffff; margin: 5px 0;"><strong>Ubicación:</strong> ${ciudad}, ${pais}</p>
              <p style="color: #ffffff; margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleString("es-AR")}</p>
            </div>

            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #69d9d7;">
              <h3 style="color: #69d9d7; margin-top: 0;">💳 Detalles del pago:</h3>
              <p style="color: #ffffff; margin: 5px 0;"><strong>PayPal Payment ID:</strong> ${paymentId || "N/A"}</p>
              <p style="color: #ffffff; margin: 5px 0;"><strong>Transaction ID:</strong> ${transactionId || "N/A"}</p>
              <p style="color: #ffffff; margin: 5px 0;"><strong>Payer Email:</strong> ${payerEmail || email}</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #69d9d7; font-size: 18px; margin: 0;">
                ¡Los archivos del curso han sido enviados automáticamente!
              </p>
            </div>
          </div>
        </div>
      `,
    })

    return { success: true, message: "Compra procesada y emails enviados correctamente" }
  } catch (error) {
    console.error("Error procesando compra:", error)
    return {
      success: false,
      error: `Error al procesar la compra: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}
