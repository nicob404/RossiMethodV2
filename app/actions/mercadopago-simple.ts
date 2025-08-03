"use server"

interface CreateSimplePreferenceData {
  amount: number
  title: string
  customerEmail: string
}

export async function createSimplePreference(data: CreateSimplePreferenceData) {
  try {
    const { amount, title, customerEmail } = data

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      // Modo demo automático
      const demoPreferenceId = `demo-${Date.now()}`
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

      return {
        success: true,
        preferenceId: demoPreferenceId,
        initPoint: `${baseUrl}/payment/demo?preference_id=${demoPreferenceId}&customer_email=${encodeURIComponent(customerEmail)}`,
        isDemo: true,
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // Configuración mínima para evitar errores
    const preferenceData = {
      items: [
        {
          title: title,
          quantity: 1,
          unit_price: amount,
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: `${baseUrl}/payment/success`,
        failure: `${baseUrl}/payment/failure`,
        pending: `${baseUrl}/payment/pending`,
      },
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      external_reference: `${Date.now()}-${customerEmail}`,
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Error MercadoPago:", responseData)

      // Fallback automático al modo demo
      const demoPreferenceId = `demo-fallback-${Date.now()}`
      return {
        success: true,
        preferenceId: demoPreferenceId,
        initPoint: `${baseUrl}/payment/demo?preference_id=${demoPreferenceId}&customer_email=${encodeURIComponent(customerEmail)}`,
        isDemo: true,
        fallback: true,
      }
    }

    return {
      success: true,
      preferenceId: responseData.id,
      initPoint: responseData.init_point || responseData.sandbox_init_point,
    }
  } catch (error) {
    console.error("Error:", error)

    // Fallback automático al modo demo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const demoPreferenceId = `demo-error-${Date.now()}`

    return {
      success: true,
      preferenceId: demoPreferenceId,
      initPoint: `${baseUrl}/payment/demo?preference_id=${demoPreferenceId}&customer_email=${encodeURIComponent(data.customerEmail)}`,
      isDemo: true,
      fallback: true,
    }
  }
}
