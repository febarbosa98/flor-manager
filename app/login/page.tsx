"use client"

import { useState } from "react"
import { login } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { setCookie } from "nookies"

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
    router.push("/produtos")
  } catch {
    toast.error("Email ou senha inválidos")
  }
}

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border p-6 rounded w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="border p-2 w-full mb-4"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded"
        >
          Entrar
        </button>
        <a href="/">inicio</a>
      </div>
    </div>
  )
}