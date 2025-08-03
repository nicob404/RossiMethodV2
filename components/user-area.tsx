"use client"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, PhoneIcon as Whatsapp, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface UserPurchase {
  id: string
  user_id: string
  program_name: string
  status: string // e.g., 'pending', 'approved', 'failed'
  created_at: string
  // Add other relevant fields like course_materials_link if available
}

export function UserArea() {
  const { user, signOut, loading: authLoading } = useAuth()
  const router = useRouter()
  const [purchases, setPurchases] = useState<UserPurchase[]>([])
  const [loadingPurchases, setLoadingPurchases] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) {
        setLoadingPurchases(false)
        return
      }

      setLoadingPurchases(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from("compras")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching purchases:", error)
          setError("Error al cargar tus compras. Intenta de nuevo más tarde.")
        } else {
          setPurchases(data || [])
        }
      } catch (err) {
        console.error("Unexpected error fetching purchases:", err)
        setError("Ocurrió un error inesperado al cargar tus compras.")
      } finally {
        setLoadingPurchases(false)
      }
    }

    fetchPurchases()
  }, [user])

  const handleSignOut = async () => {
    console.log("Attempting to sign out...")
    try {
      const { error } = await signOut()
      if (error) {
        console.error("Error signing out:", error.message)
        // Optionally show a toast or alert
      } else {
        console.log("Signed out successfully, redirecting...")
        router.push("/") // Redirect to home page after successful logout
      }
    } catch (err) {
      console.error("Unexpected error during sign out:", err)
    }
  }

  if (authLoading || loadingPurchases) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-12 h-12 border-4 border-[#69d9d7]/30 border-t-[#69d9d7] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/") // Redirect to home if not logged in
    return null
  }

  const hasCompletedPurchases = purchases.some((purchase) => purchase.status === "approved")
  const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/TU_LINK_DEL_GRUPO" // Replace with your actual WhatsApp group link
  const WHATSAPP_NUMBER = "5493534220827" // Argentina, Cordoba number

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-white">Mi</span> <span className="text-[#69d9d7]">Área</span>
        </h1>

        <Card className="bg-[#1a1a1a] border-[#343434] p-6 mb-8">
          <CardHeader className="flex flex-col items-center text-center p-0 mb-6">
            <Avatar className="w-24 h-24 mb-4 border-2 border-[#69d9d7]">
              <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder-user.jpg"} alt="User Avatar" />
              <AvatarFallback className="bg-[#69d9d7] text-black text-3xl font-bold">
                {user.email ? user.email[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold text-white">{user.email}</CardTitle>
            <CardDescription className="text-gray-400">
              Miembro desde: {new Date(user.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex flex-col gap-4">
            <Button
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </Button>

            {hasCompletedPurchases && (
              <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-[#d8f494] hover:bg-[#d8f494]/80 text-black font-semibold flex items-center justify-center gap-2">
                  <Whatsapp size={20} />
                  Unirse al Grupo de WhatsApp
                </Button>
              </a>
            )}
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold text-white mb-6">Mis Compras</h2>
        {loadingPurchases ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-[#69d9d7]/30 border-t-[#69d9d7] rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : purchases.length === 0 ? (
          <p className="text-gray-400 text-center">Aún no tienes compras registradas.</p>
        ) : (
          <div className="grid gap-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="bg-[#1a1a1a] border-[#343434] p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-xl font-semibold text-white">{purchase.program_name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fecha: {new Date(purchase.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      purchase.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : purchase.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {purchase.status === "approved" && <CheckCircle size={16} className="inline-block mr-1" />}
                    {purchase.status === "approved"
                      ? "Completado"
                      : purchase.status === "pending"
                        ? "Pendiente"
                        : "Fallido"}
                  </span>
                  {/* Example: Link to course materials if available and approved */}
                  {purchase.status === "approved" && (
                    <a
                      href={`https://docs.google.com/document/d/12345_YOUR_COURSE_ID/edit?usp=sharing`} // Replace with actual Google Drive link
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#69d9d7] hover:underline text-sm"
                    >
                      Acceder a Materiales
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
