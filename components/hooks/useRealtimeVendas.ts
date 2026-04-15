"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { listenVendas } from "@/lib/realtime"
import type { PedidoVenda, Venda } from "@/lib/vendas"

export function useRealtimeVendas() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = listenVendas((vendas: Venda[]) => {
      // Agrupa as vendas em pedidos
      const pedidosMap = new Map<string, PedidoVenda>()

      vendas.forEach((venda) => {
        const pedidoId = venda.pedidoId || venda.id

        if (!pedidosMap.has(pedidoId)) {
          pedidosMap.set(pedidoId, {
            id: pedidoId,
            data: venda.data,
            itens: [],
            total: 0,
            lucro: 0,
            taxa: 0,
            valorLiquido: 0,
            formaPagamento: venda.formaPagamento
          })
        }

        const pedido = pedidosMap.get(pedidoId)!
        pedido.itens.push(venda)
        pedido.total += venda.total
        pedido.lucro += venda.lucro
        pedido.taxa += venda.taxa
        pedido.valorLiquido += venda.valorLiquido
      })

      const pedidos = Array.from(pedidosMap.values()).sort(
        (a, b) => b.data.getTime() - a.data.getTime()
      )

      queryClient.setQueryData(["vendas"], pedidos)
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    })

    return () => unsubscribe()
  }, [queryClient])
}