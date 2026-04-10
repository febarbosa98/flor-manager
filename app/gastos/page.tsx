"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Navbar from "@/components/Navbar"
import GastosForm from "@/components/GastosForm"
import GastosTable from "@/components/GastosTable"
import { listarGastos } from "@/lib/gastos"
import { useRealtimeGastos } from "@/components/hooks/useRealtimeGastos"

export default function GastosPage() {
  useRealtimeGastos()
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const queryClient = useQueryClient()

  const { data: gastos = [], isLoading } = useQuery({
    queryKey: ["gastos"],
    queryFn: listarGastos,
    staleTime: 1000 * 60 * 5
  })

  // ✅ função correta (sem bug de timezone)
  function parseDateLocal(dateString: string) {
    const [ano, mes, dia] = dateString.split("-").map(Number)
    return new Date(ano, mes - 1, dia)
  }

  // ✅ filtro correto
  const gastosFiltrados = gastos.filter((g: any) => {
    const data = g.data?.toDate ? g.data.toDate() : new Date(g.data)

    if (dataInicio && dataFim) {
      const inicio = parseDateLocal(dataInicio)
      const fim = parseDateLocal(dataFim)
      fim.setHours(23, 59, 59, 999)

      return data >= inicio && data <= fim
    }

    return true
  })

  // 🔥 reset automático (UX profissional)
  useEffect(() => {
    // opcional: pode usar pra logs ou efeitos futuros
  }, [dataInicio, dataFim])

  if (isLoading) return <p>Carregando...</p>

  return (
    <div>
      <Navbar />

      <div className="container mx-auto mt-10 p-4">
        <h1 className="text-2xl text-secondary font-bold mb-6">Gastos e Perdas</h1>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 ">
          <h2 className="text-lg text-secondary font-semibold mb-4">Filtrar por Período</h2>

          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-sm mb-1">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Data Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            <button
              onClick={() => {
                setDataInicio("")
                setDataFim("")
              }}
              className="btn-cinza"
            >
              Limpar
            </button>
          </div>
        </div>

        <GastosForm
          reload={() =>
            queryClient.invalidateQueries({ queryKey: ["gastos"] })
          }
        />

        <GastosTable
          gastos={gastosFiltrados}
          reload={() =>
            queryClient.invalidateQueries({ queryKey: ["gastos"] })
          }
        />
      </div>
    </div>
  )
}