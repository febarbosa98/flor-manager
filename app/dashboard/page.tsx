"use client"

import { useQuery } from "@tanstack/react-query"
import Navbar from "@/components/Navbar"
import Dashboard from "@/components/DashboardCards"
import VendasChart from "@/components/VendasChart"
import { buscarEstatisticas } from "@/lib/dashboard"
import { listarVendasPorMes } from "@/lib/vendas"
import { useRealtimeGastos } from "@/components/hooks/useRealtimeGastos"
import { useRealtimeVendas } from "@/components/hooks/useRealtimeVendas"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { TopProdutos } from "@/components/TopProdutos"
import { EstoqueBaixo } from "@/components/EstoqueBaixo"

export default function Home() {

  useRealtimeVendas()
useRealtimeGastos()
  const hoje = new Date()
  const [mes, setMes] = useState(hoje.getMonth())
   const [ano, setAno] = useState(hoje.getFullYear())
   const queryClient = useQueryClient()

   useEffect(() => {
  const interval = setInterval(() => {
    queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  }, 2000)

  return () => clearInterval(interval)
}, [])

  const { data: vendas = [] } = useQuery({
    queryKey: ["vendas-mes", mes, ano],
    queryFn: () => listarVendasPorMes(ano, mes),
    staleTime: 1000 * 60 * 5
  })

  const { data: stats } = useQuery({
    queryKey: ["dashboard", mes, ano],
    queryFn: () => buscarEstatisticas(ano, mes),
    staleTime: 1000 * 60 * 5
  })

  return (
    <div className="" >
      <Navbar />
<div className="container mx-auto mt-15 px-4">
      <div className="flex gap-4 mb-6">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border p-2 rounded  bg-card"
          >
            <option value={0}>Janeiro</option>
            <option value={1}>Fevereiro</option>
            <option value={2}>Março</option>
            <option value={3}>Abril</option>
            <option value={4}>Maio</option>
            <option value={5}>Junho</option>
            <option value={6}>Julho</option>
            <option value={7}>Agosto</option>
            <option value={8}>Setembro</option>
            <option value={9}>Outubro</option>
            <option value={10}>Novembro</option>
            <option value={11}>Dezembro</option>
          </select>

          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="border p-2 rounded  bg-card"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

      <Dashboard stats={stats} />

      <div className="grid md:grid-cols-2 gap-6 mt-0">
        <TopProdutos data={stats?.topProdutos} />
        <EstoqueBaixo data={stats?.estoqueBaixo} />
      </div>

      <VendasChart vendas={vendas} />
      
</div>
    </div>
  )
}