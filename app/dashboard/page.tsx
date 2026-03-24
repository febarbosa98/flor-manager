"use client"

import { useQuery } from "@tanstack/react-query"
import Navbar from "@/components/Navbar"
import Dashboard from "@/components/DashboardCards"
import VendasChart from "@/components/VendasChart"
import { buscarEstatisticas } from "@/lib/dashboard"
import { listarVendasPorMes } from "@/lib/vendas"

export default function Home() {
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
    <div>
      <Navbar />

      <Dashboard stats={stats} />
      <VendasChart vendas={vendas} />
    </div>
  )
}