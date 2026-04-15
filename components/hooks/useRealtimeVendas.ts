"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { listenVendas } from "@/lib/realtime"

export function useRealtimeVendas() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = listenVendas((data) => {
      queryClient.setQueryData(["vendas"], data)
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    })

    return () => unsubscribe()
  }, [queryClient])
}