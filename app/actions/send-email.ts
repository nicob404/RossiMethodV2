"use server"

import { Resend } from "resend"

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY)

interface CoachingFormData {
  nombre: string
  email: string
  telefono: string
  mensaje: string
}

export async function sendCoachingEmail(formData: CoachingFormData) {
  try {
    console.log("Iniciando envío de email...", formData)

    const { nombre, email, telefono, mensaje } = formData

    // Validación básica
    if (!nombre || !email || !telefono || !mensaje) {
      console.error("Faltan campos requeridos")
      return { success: false, error: "Todos los campos son requeridos" }
    }

    // Verificar que tenemos la API key
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY no está configurada")
      return { success: false, error: "Configuración de email no disponible" }
    }

    console.log("Enviando email a nicolas.gino21@gmail.com...")

    // Email para Fran
    const emailToFran = await resend.emails.send({
      from: "RossiMethod <onboarding@resend.dev>", // Usar el dominio por defecto de Resend
      to: ["nicolas.gino21@gmail.com"],
      subject: `🏋️ Nueva solicitud de Coaching - ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #69d9d7; margin: 0; font-size: 32px;">RossiMethod</h1>
            <p style="color: #cccccc; margin: 5px 0; font-size: 18px;">Nueva Solicitud de Coaching Personal</p>
          </div>
          
          <div style="background-color: #343434; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #69d9d7; margin-top: 0;">📋 Información del Cliente</h2>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #d8f494; font-size: 16px;">👤 Nombre:</strong>
              <p style="margin: 5px 0; color: #ffffff; font-size: 18px; font-weight: bold;">${nombre}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #d8f494; font-size: 16px;">📧 Email:</strong>
              <p style="margin: 5px 0; color: #ffffff; font-size: 16px;">
                <a href="mailto:${email}" style="color: #69d9d7; text-decoration: none;">${email}</a>
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #d8f494; font-size: 16px;">📱 Teléfono:</strong>
              <p style="margin: 5px 0; color: #ffffff; font-size: 16px;">
                <a href="tel:${telefono}" style="color: #69d9d7; text-decoration: none;">${telefono}</a>
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #d8f494; font-size: 16px;">💬 Mensaje:</strong>
              <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #69d9d7;">
                <p style="margin: 0; color: #ffffff; line-height: 1.8; font-size: 16px;">${mensaje}</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; padding: 25px; background-color: #343434; border-radius: 10px;">
            <p style="color: #cccccc; margin: 0; font-size: 14px;">
              📅 Recibido el ${new Date().toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div style="margin-top: 20px;">
              <a href="mailto:${email}" style="background-color: #69d9d7; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Responder Cliente
              </a>
            </div>
          </div>
        </div>
      `,
    })

    console.log("Email a Fran enviado:", emailToFran)

    // Email de confirmación para el cliente
    const emailToClient = await resend.emails.send({
      from: "RossiMethod <onboarding@resend.dev>",
      to: [email],
      subject: "✅ Confirmación - Solicitud de Coaching Recibida",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #69d9d7; margin: 0; font-size: 32px;">RossiMethod</h1>
            <p style="color: #cccccc; margin: 5px 0; font-size: 18px;">Confirmación de Solicitud</p>
          </div>
          
          <div style="background-color: #343434; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #69d9d7; margin-top: 0;">¡Hola ${nombre}! 👋</h2>
            
            <p style="color: #ffffff; line-height: 1.8; font-size: 16px;">
              Gracias por tu interés en el <strong style="color: #d8f494;">coaching personal</strong>. He recibido tu solicitud y me pondré en contacto contigo en las próximas <strong style="color: #69d9d7;">24 horas</strong>.
            </p>
            
            <p style="color: #ffffff; line-height: 1.8; font-size: 16px;">
              Mientras tanto, puedes seguir explorando nuestros programas y contenido en la web.
            </p>
            
            <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #d8f494;">
              <p style="margin: 0; color: #d8f494; font-weight: bold; font-size: 18px;">
                💪 ¡Estoy emocionado de ayudarte a alcanzar tus objetivos!
              </p>
            </div>

            <div style="margin-top: 25px; padding: 20px; background-color: #000000; border-radius: 8px;">
              <h3 style="color: #69d9d7; margin-top: 0;">📋 Resumen de tu solicitud:</h3>
              <p style="color: #cccccc; margin: 5px 0;"><strong>Nombre:</strong> ${nombre}</p>
              <p style="color: #cccccc; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="color: #cccccc; margin: 5px 0;"><strong>Teléfono:</strong> ${telefono}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 25px; background-color: #343434; border-radius: 10px;">
            <p style="color: #cccccc; margin: 0; font-size: 16px;">
              Saludos,<br>
              <strong style="color: #69d9d7; font-size: 18px;">Fran - RossiMethod</strong>
            </p>
            <p style="color: #888; margin: 10px 0 0 0; font-size: 12px;">
              Si tienes alguna pregunta urgente, puedes contactarme directamente.
            </p>
          </div>
        </div>
      `,
    })

    console.log("Email de confirmación enviado:", emailToClient)

    return { success: true, message: "Emails enviados correctamente" }
  } catch (error) {
    console.error("Error detallado al enviar email:", error)
    return {
      success: false,
      error: `Error al enviar el email: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}
