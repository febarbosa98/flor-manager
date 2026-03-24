"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { listenGastos } from "@/lib/realtime"

export function useRealtimeGastos() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = listenGastos((data) => {
      queryClient.setQueryData(["gastos"], data)
    })

    return () => unsubscribe()
  }, [])
}