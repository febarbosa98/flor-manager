"use client"

import { useState } from "react"
import { login } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { setCookie } from "nookies"
import Navbar from "@/components/Navbar"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const router = useRouter()

  async function handleLogin() {
  try {
    const userCredential = await login(email, senha)

    const token = await userCredential.user.getIdToken()

    setCookie(null, "token", token, {
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/"
    })

    toast.success("Login realizado!")
    router.push("/dashboard")
  } catch {
    toast.error("Email ou senha inválidos")
  }
}

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar/>
    <div className="flex mt-0 flex-1 justify-center items-center">
      <div className="border bg-accent p-6 rounded w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          placeholder="Email"
          className="input w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
          />

        <input
          type="password"
          placeholder="Senha"
          className="input w-full mb-4"
          onChange={(e) => setSenha(e.target.value)}
          />

        <button
          onClick={handleLogin}
          className="w-full btn-verde"
          >
          Entrar
        </button>
        
      </div>
    </div>
          </section>
  )
}