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
    <nav className="flex gap-6 p-4 border-b items-center justify-between">

      <div className="flex gap-6">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/produtos">Produtos</Link>
        <Link href="/vendas">Vendas</Link>
        <Link href="/gastos">Gastos</Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-500">
            {user.email}
          </span>
        )}

        {user ? (
          <button onClick={handleLogout} className="btn-cinza">
            Sair
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="btn-verde"
          >
            Login
          </button>
        )}
      </div>

    </nav>
  )
}