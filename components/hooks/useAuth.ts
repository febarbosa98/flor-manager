"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/auth"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 🔥 pega token atualizado
        const token = await user.getIdToken()

        // salva cookie novamente
        document.cookie = `token=${token}; path=/; max-age=86400`
      } else {
        // remove cookie
        document.cookie = "token=; path=/; max-age=0"
        router.push("/login")
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { loading }
}