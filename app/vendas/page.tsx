"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Navbar from "@/components/Navbar"
import VendaForm from "@/components/VendaForm"
import VendaTable from "@/components/VendaTable"
import Dashboard from "@/components/DashboardCards"
import VendasChart from "@/components/VendasChart"
import { listarVendasPorPedido } from "@/lib/vendas"
import { buscarEstatisticas } from "@/lib/dashboard"
import { useRealtimeVendas } from "@/components/hooks/useRealtimeVendas"

function agruparPedidos(vendas: any[]) {
  const pedidosMap: any = {}

  vendas.forEach((v) => {
    const pedidoId = v.pedidoId || v.id // fallback importante

    if (!pedidosMap[pedidoId]) {
      pedidosMap[pedidoId] = {
        id: pedidoId,
        data: v.data,
        total: 0,
        itens: []
      }
    }

    pedidosMap[pedidoId].itens.push(v)
    pedidosMap[pedidoId].total += Number(v.total) || 0
  })

  return Object.values(pedidosMap)
}

export default function Vendas() {
  useRealtimeVendas()
  const hoje = new Date()
  const itensPorPagina = 10

  const [pagina, setPagina] = useState(1)
  const [mes, setMes] = useState(hoje.getMonth())
  const [ano, setAno] = useState(hoje.getFullYear())
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  const queryClient = useQueryClient()

const { data: vendas = [] } = useQuery({
  queryKey: ["vendas"],
  queryFn: listarVendasPorPedido, // 🔥 obrigatório
  enabled: false
})

  const { data: stats } = useQuery({
    queryKey: ["dashboard", mes, ano],
    queryFn: () => buscarEstatisticas(ano, mes),
    staleTime: 1000 * 60 * 5
  })
  function parseDateLocal(dateString: string) {
  const [ano, mes, dia] = dateString.split("-").map(Number)
  return new Date(ano, mes - 1, dia, 0, 0, 0)
}

  // 🔥 filtro LOCAL (sem chamar Firebase)
const pedidos = agruparPedidos(vendas)

const vendasFiltradas = pedidos.filter((pedido: any) => {
  const data = pedido.data?.toDate
    ? pedido.data.toDate()
    : new Date(pedido.data)

  const mesmoMes =
    data.getMonth() === mes && data.getFullYear() === ano

  if (dataInicio && dataFim) {
    const inicio = parseDateLocal(dataInicio)
    const fim = parseDateLocal(dataFim)
    fim.setHours(23, 59, 59, 999)

    return data >= inicio && data <= fim
  }

  return mesmoMes
})

  const inicio = (pagina - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  const vendasPagina = vendasFiltradas.slice(inicio, fim)

 if (!vendas.length) return <p>Carregando vendas...</p>
  return (
    <div>
      <Navbar />

      <div className="container mx-auto mt-10 p-4">
        <h1 className="text-2xl text-secondary font-bold mb-6">Vendas</h1>
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

        <div className="mt-20 ">
          <h1 className=" text-2xl text-secondary font-bold mb-6 ">Registrar venda</h1>
          <VendaForm
          
        />


<div className="flex gap-4 my-6 items-end ">

<div className="flex flex-col">
<label className="text-sm">Data início</label>
<input
type="date"
value={dataInicio}
onChange={(e)=>setDataInicio(e.target.value)}
className="border p-2 rounded  bg-card"
/>
</div>

<div className="flex flex-col">
<label className="text-sm">Data fim</label>
<input
type="date"
value={dataFim}
onChange={(e)=>setDataFim(e.target.value)}
className="border p-2 rounded  bg-card"
/>
</div>

{/* <button
onClick={() => queryClient.invalidateQueries({ queryKey: ["vendas"] })}
className="btn-verde"
>
Filtrar
</button> */}

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

          <VendaTable
          vendas={vendasPagina}
          reload={() => queryClient.invalidateQueries({ queryKey: ["vendas"] })}
        />

          <div className="flex gap-2 mt-6">
            {Array.from(
              { length: Math.ceil(vendasFiltradas.length / itensPorPagina) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`px-3 py-1 border rounded 
${pagina === i + 1 ? "bg-primary text-white" : "bg-white text-black"}
`}
                >
                  {i + 1}
                </button>
              ),
            )}
          </div>
          <VendasChart vendas={vendasFiltradas}  />
        </div>
      </div>
    </div>
  );
}
