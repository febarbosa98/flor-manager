"use client"

import Link from "next/link"
import { destroyCookie } from "nookies"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/context/AuthContext"

export default function Navbar() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    destroyCookie(null, "token")
    router.push("/login")
  }

  // 🔥 evita flicker
  if (loading) return null

  return (
    <nav className=" border-b bg-accent items-center justify-between">
<div className="container mx-auto flex gap-6 p-4   items-center justify-between ">

      <div className="flex gap-6 text-xl items-center font-medium text-secondary ">
        <Link href="/" className="hover:scale-110 transform cursor-pointer transition-all duration-150"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></Link>
        <Link href="/dashboard" className="hover:scale-110 transform cursor-pointer transition-all duration-150">Dashboard</Link>
        <Link href="/produtos" className="hover:scale-110 transform cursor-pointer transition-all duration-150">Produtos</Link>
        <Link href="/vendas" className="hover:scale-110 transform cursor-pointer transition-all duration-150">Vendas</Link>
        <Link href="/gastos" className="hover:scale-110 transform cursor-pointer transition-all duration-150">Gastos</Link>
      </div>

      <div className="flex items-center gap-4">
        
        {user ? (
          <button onClick={handleLogout} className="btn-cinza">
            Sair
          </button>
        ) : (
          <button
          onClick={() => router.push("/login")}
          className="btn-verde "
          >
            Login
          </button>
        )}
        </div>
      </div>

    </nav>
  )
}