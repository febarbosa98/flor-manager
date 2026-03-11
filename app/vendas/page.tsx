/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import VendaForm from "@/components/VendaForm";
import VendaTable from "@/components/VendaTable";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/DashboardCards";
import { listarVendasPorMes, listarVendasPorPeriodo } from "@/lib/vendas";
import { buscarEstatisticas } from "@/lib/dashboard";
import VendasChart from "@/components/VendasChart";

export default function Vendas() {
  const [vendas, setVendas] = useState<{ id: string }[]>([]);
  const [stats, setStats] = useState<any>(null);
  const hoje = new Date();
  const itensPorPagina = 10;
  const [pagina, setPagina] = useState(1);

  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());

  const [dataInicio,setDataInicio] = useState("")
  const [dataFim,setDataFim] = useState("")

  async function carregar() {
    const data = await listarVendasPorMes(ano, mes);
    const statsData = await buscarEstatisticas(ano, mes);

    setVendas(data);
    setStats(statsData);
  }

 async function filtrar(){

if(!dataInicio || !dataFim) return

const [anoI, mesI, diaI] = dataInicio.split("-").map(Number)
const [anoF, mesF, diaF] = dataFim.split("-").map(Number)

const inicio = new Date(anoI, mesI - 1, diaI, 0, 0, 0)
const fim = new Date(anoF, mesF - 1, diaF, 23, 59, 59)

const data = await listarVendasPorPeriodo(inicio,fim)

setPagina(1)
setVendas(data)

}

  useEffect(() => {
    carregar();
  }, [mes, ano]);

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const vendasPagina = vendas.slice(inicio, fim);

  return (
    <div>
      <Navbar />

      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">Vendas</h1>
        <div className="flex gap-4 mb-6">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border p-2 rounded"
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
            className="border p-2 rounded"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
        </div>

        <Dashboard stats={stats} />

        <div className="mt-20">
          <h1 className=" text-2xl font-bold mb-6 ">Registrar venda</h1>
          <VendaForm reload={carregar} />


<div className="flex gap-4 mb-6 items-end">

<div className="flex flex-col">
<label className="text-sm">Data início</label>
<input
type="date"
value={dataInicio}
onChange={(e)=>setDataInicio(e.target.value)}
className="border p-2 rounded"
/>
</div>

<div className="flex flex-col">
<label className="text-sm">Data fim</label>
<input
type="date"
value={dataFim}
onChange={(e)=>setDataFim(e.target.value)}
className="border p-2 rounded"
/>
</div>

<button
onClick={filtrar}
className="px-4 py-2 bg-black text-white rounded"
>
Filtrar
</button>

<button
onClick={carregar}
className="px-4 py-2 border rounded"
>
Limpar
</button>

</div>

          <VendaTable vendas={vendasPagina} reload={carregar} />

          <div className="flex gap-2 mt-6">
            {Array.from(
              { length: Math.ceil(vendas.length / itensPorPagina) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`px-3 py-1 border rounded 
${pagina === i + 1 ? "bg-black text-white" : ""}
`}
                >
                  {i + 1}
                </button>
              ),
            )}
          </div>
          <VendasChart vendas={vendas} />
        </div>
      </div>
    </div>
  );
}
