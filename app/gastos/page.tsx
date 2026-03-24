"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import GastosForm from "@/components/GastosForm";
import GastosTable from "@/components/GastosTable";
import { listarGastos, listarGastosPorPeriodo } from "../../lib/gastos";
// import { useAuth } from "@/components/hooks/useAuth"

interface Gasto {
  id: string;
  tipo: "gasto" | "perda";
  descricao: string;
  valor: number;
  data: Date;
}

export default function GastosPage() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loadin, setLoadin] = useState(true);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  async function carregarGastos() {
    try {
      const data = await listarGastos();
      setGastos(data);
    } catch (error) {
      console.error("Erro ao carregar gastos:", error);
    } finally {
      setLoadin(false);
    }
  }

  async function filtrarPorPeriodo() {
    if (!dataInicio || !dataFim) {
      carregarGastos();
      return;
    }

    try {
      setLoadin(true);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const data = await listarGastosPorPeriodo(inicio, fim);
      setGastos(data);
    } catch (error) {
      console.error("Erro ao filtrar gastos:", error);
    } finally {
      setLoadin(false);
    }
  }

  useEffect(() => {
    carregarGastos();
  }, []);

// const { loading } = useAuth()

  // if (loading) return <p>Carregando...</p>

  return (
    <div>
      <Navbar />
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">Gastos e Perdas</h1>

        {/* Filtros por período */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtrar por Período</h2>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={filtrarPorPeriodo}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Filtrar
            </button>
            <button
              onClick={() => {
                setDataInicio("");
                setDataFim("");
                carregarGastos();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Limpar
            </button>
          </div>
        </div>

        <GastosForm reload={carregarGastos} />
        {loadin ? (
          <p>Carregando...</p>
        ) : (
          <GastosTable gastos={gastos} reload={carregarGastos} />
        )}
      </div>
    </div>
  );
}