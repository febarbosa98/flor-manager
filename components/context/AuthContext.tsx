"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/auth"
import { onAuthStateChanged, User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
})

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)

      // sincroniza cookie (middleware)
      if (user) {
        const token = await user.getIdToken()
        document.cookie = `token=${token}; path=/; max-age=86400`
      } else {
        document.cookie = "token=; path=/; max-age=0"
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}