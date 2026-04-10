"use client"

import Link from "next/link"
import { destroyCookie } from "nookies"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/context/AuthContext"
import { useState } from "react"

export default function Navbar() {
  const { user, loading } = useAuthContext()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    destroyCookie(null, "token")
    router.push("/login")
    setMenuOpen(false)
  }

  if (loading) return null

  return (
    <nav className="border-b bg-accent">
      <div className="container mx-auto flex items-center justify-between p-4">

        {/* Logo / Home */}
        <Link
          href="/"
          className="hover:scale-110 transform cursor-pointer transition-all duration-150 text-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
        </Link>

        {/* Links — desktop */}
        <div className="hidden md:flex gap-6 text-xl items-center font-medium text-secondary">
          <Link href="/dashboard" className="hover:scale-110 transform transition-all duration-150">Dashboard</Link>
          <Link href="/produtos"  className="hover:scale-110 transform transition-all duration-150">Produtos</Link>
          <Link href="/vendas"    className="hover:scale-110 transform transition-all duration-150">Vendas</Link>
          <Link href="/gastos"    className="hover:scale-110 transform transition-all duration-150">Gastos</Link>
        </div>

        {/* Botão auth — desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <button onClick={handleLogout} className="btn-cinza">Sair</button>
          ) : (
            <button onClick={() => router.push("/login")} className="btn-verde">Login</button>
          )}
        </div>

        {/* Hamburguer — mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 text-secondary"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Abrir menu"
        >
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t bg-accent px-4 pb-4 flex flex-col gap-4 text-lg font-medium text-secondary">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="py-2 hover:opacity-70 transition-opacity">Dashboard</Link>
          <Link href="/produtos"  onClick={() => setMenuOpen(false)} className="py-2 hover:opacity-70 transition-opacity">Produtos</Link>
          <Link href="/vendas"    onClick={() => setMenuOpen(false)} className="py-2 hover:opacity-70 transition-opacity">Vendas</Link>
          <Link href="/gastos"    onClick={() => setMenuOpen(false)} className="py-2 hover:opacity-70 transition-opacity">Gastos</Link>

          <div className="pt-2 border-t">
            {user ? (
              <button onClick={handleLogout} className="btn-cinza w-full">Sair</button>
            ) : (
              <button onClick={() => { router.push("/login"); setMenuOpen(false) }} className="btn-verde w-full">Login</button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}