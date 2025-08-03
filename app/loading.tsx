export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-16 h-16 border-4 border-[#69d9d7]/30 border-t-[#69d9d7] rounded-full animate-spin"></div>
      <p className="ml-4 text-lg">Cargando...</p>
    </div>
  )
}
