"use client"

import { useQuery } from "@tanstack/react-query"
import Navbar from "@/components/Navbar"
import Dashboard from "@/components/DashboardCards"
import VendasChart from "@/components/VendasChart"
import { buscarEstatisticas } from "@/lib/dashboard"
import { listarVendasPorMes } from "@/lib/vendas"
import { useRealtimeGastos } from "@/components/hooks/useRealtimeGastos"
import { useRealtimeVendas } from "@/components/hooks/useRealtimeVendas"

export default function Home() {
  useRealtimeVendas()
useRealtimeGastos()
  const hoje = new Date()
  const mes = hoje.getMonth()
  const ano = hoje.getFullYear()

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

      <Dashboard stats={stats} />
      <VendasChart vendas={vendas} />
</div>
    </div>
  )
}