"use server"

interface CreatePreferenceData {
  amount: number
  title: string
  description: string
  customerData: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    pais: string
    ciudad: string
  }
}

export async function createPreference(data: CreatePreferenceData) {
  try {
    console.log("Creando preferencia de MercadoPago:", data)

    const { amount, title, description, customerData } = data

    // Validar datos
    if (!customerData.nombre || !customerData.email) {
      return { success: false, error: "Datos del cliente incompletos" }
    }

    // Verificar token de acceso
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    // Si no hay token configurado, usar modo demo
    if (!accessToken) {
      console.log("⚠️ MODO DEMO: No hay token de MercadoPago configurado")

      // Simular creación de preferencia
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const demoPreferenceId = `demo-${Date.now()}`
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

      return {
        success: true,
        preferenceId: demoPreferenceId,
        initPoint: `${baseUrl}/payment/demo?preference_id=${demoPreferenceId}&customer_email=${encodeURIComponent(customerData.email)}`,
        isDemo: true,
      }
    }

    console.log("Token configurado:", accessToken.substring(0, 20) + "...")

    // Asegurar que tenemos una URL base válida
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // Validar que la URL base sea válida
    if (!baseUrl.startsWith("http")) {
      return {
        success: false,
        error: "NEXT_PUBLIC_BASE_URL debe ser una URL completa (ej: http://localhost:3000)",
      }
    }

    // Configuración simplificada para evitar errores de auto_return
    const preferenceData = {
      items: [
        {
          id: "full-planche-workshop",
          title: title,
          description: description,
          quantity: 1,
          unit_price: amount,
          currency_id: "ARS",
        },
      ],
      payer: {
        name: customerData.nombre,
        surname: customerData.apellido,
        email: customerData.email,
        phone: {
          area_code: "",
          number: customerData.telefono,
        },
        address: {
          city_name: customerData.ciudad,
          country_name: customerData.pais,
        },
      },
      // URLs de retorno - configuración simplificada
      back_urls: {
        success: `${baseUrl}/payment/success`,
        failure: `${baseUrl}/payment/failure`,
        pending: `${baseUrl}/payment/pending`,
      },
      // NO usar auto_return para evitar problemas
      // auto_return: "approved", // Comentado para evitar el error

      // URL de notificación para webhooks
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,

      // Referencia externa para identificar el pago
      external_reference: `${Date.now()}-${customerData.email}`,

      // Configuración de métodos de pago
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },

      // Para productos digitales
      shipments: {
        mode: "not_specified",
      },

      // Configuración adicional
      expires: false, // No expira
      binary_mode: false, // Permite pagos pendientes
    }

    console.log("Datos de preferencia (sin auto_return):", JSON.stringify(preferenceData, null, 2))
    console.log("URLs de retorno configuradas:")
    console.log("- Success:", preferenceData.back_urls.success)
    console.log("- Failure:", preferenceData.back_urls.failure)
    console.log("- Pending:", preferenceData.back_urls.pending)

    // Hacer la petición HTTP directamente a la API de MercadoPago
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": `${Date.now()}-${customerData.email}`, // Para evitar duplicados
      },
      body: JSON.stringify(preferenceData),
    })

    const responseData = await response.json()
    console.log("Respuesta de MercadoPago:", responseData)

    if (!response.ok) {
      console.error("Error en respuesta de MercadoPago:", responseData)

      // Manejar errores específicos
      if (responseData.message?.includes("invalid_token") || responseData.error === "invalid_token") {
        return {
          success: false,
          error: "Token de MercadoPago inválido. Ve a /config para configurar correctamente.",
          suggestDemo: true,
        }
      }

      if (responseData.message?.includes("back_url") || responseData.message?.includes("auto_return")) {
        return {
          success: false,
          error: `Error de configuración de URLs: ${responseData.message}. Verifica NEXT_PUBLIC_BASE_URL en /config`,
          suggestDemo: true,
        }
      }

      // Si hay cualquier error, sugerir modo demo
      return {
        success: false,
        error: `Error de MercadoPago: ${responseData.message || responseData.error || "Configuración incorrecta"}`,
        suggestDemo: true,
      }
    }

    if (responseData.id) {
      return {
        success: true,
        preferenceId: responseData.id,
        initPoint: responseData.init_point,
        sandboxInitPoint: responseData.sandbox_init_point,
      }
    } else {
      return { success: false, error: "No se pudo crear la preferencia", suggestDemo: true }
    }
  } catch (error) {
    console.error("Error creando preferencia:", error)
    return {
      success: false,
      error: `Error al crear preferencia: ${error instanceof Error ? error.message : "Error desconocido"}`,
      suggestDemo: true,
    }
  }
}
