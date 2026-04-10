"use client";

import { useState } from "react";
import { toast } from "sonner";
import { atualizarGasto, deletarGasto } from "../lib/gastos";

interface Gasto {
  id: string;
  tipo: "gasto" | "perda";
  descricao: string;
  valor: number;
  data: Date;
}

interface GastosTableProps {
  gastos: Gasto[];
  reload: () => void;
}

// Converte Date → "YYYY-MM-DD" sem deslocar fuso
function toInputDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Converte "YYYY-MM-DD" → Date no horário local (sem UTC shift)
function fromInputDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function GastosTable({ gastos, reload }: GastosTableProps) {
  const [editando, setEditando] = useState<string | null>(null);
  const [editTipo, setEditTipo] = useState<"gasto" | "perda">("gasto");
  const [editDescricao, setEditDescricao] = useState("");
  const [editValor, setEditValor] = useState("");
  const [editData, setEditData] = useState("");

  function iniciarEdicao(gasto: Gasto) {
    setEditando(gasto.id);
    setEditTipo(gasto.tipo);
    setEditDescricao(gasto.descricao);
    setEditValor(gasto.valor.toString());
    setEditData(toInputDate(new Date(gasto.data))); // ✅ sem UTC shift
  }

  async function salvarEdicao(id: string) {
    try {
      await atualizarGasto(id, {
        tipo: editTipo,
        descricao: editDescricao,
        valor: parseFloat(editValor),
        data: fromInputDate(editData), // ✅ sem UTC shift
      });
      toast.success("Gasto/perda atualizado!");
      setEditando(null);
      reload();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao atualizar!");
    }
  }

  async function deletarGastoHandler(id: string) {
    if (!confirm("Tem certeza que deseja excluir este gasto/perda?")) return;
    try {
      await deletarGasto(id);
      toast.success("Gasto/perda excluído!");
      reload();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao excluir!");
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">

      {/* Tabela — apenas desktop */}
      <table className="hidden md:table w-full">
        <thead className="bg-gray-50">
          <tr>
            {["Tipo", "Descrição", "Valor", "Data", "Ações"].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {gastos.map((gasto) => (
            <tr key={gasto.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editando === gasto.id ? (
                  <select value={editTipo} onChange={(e) => setEditTipo(e.target.value as "gasto" | "perda")} className="w-full p-1 border rounded">
                    <option value="gasto">Gasto</option>
                    <option value="perda">Perda</option>
                  </select>
                ) : (
                  <span className={`p-2 text-xs font-medium rounded-full ${gasto.tipo === "gasto" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {gasto.tipo === "gasto" ? "Gasto" : "Perda"}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">
                {editando === gasto.id ? (
                  <input type="text" value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} className="w-full p-1 border rounded" />
                ) : gasto.descricao}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editando === gasto.id ? (
                  <input type="number" step="0.01" value={editValor} onChange={(e) => setEditValor(e.target.value)} className="w-full p-1 border rounded" />
                ) : `R$ ${Number(gasto.valor).toFixed(2)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editando === gasto.id ? (
                  <input type="date" value={editData} onChange={(e) => setEditData(e.target.value)} className="w-full p-1 border rounded" />
                ) : toInputDate(new Date(gasto.data)).split("-").reverse().join("/")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editando === gasto.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => salvarEdicao(gasto.id)} className="btn-verde">Salvar</button>
                    <button onClick={() => setEditando(null)} className="btn-red">Cancelar</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => iniciarEdicao(gasto)} className="btn-cinza">Editar</button>
                    <button onClick={() => deletarGastoHandler(gasto.id)} className="btn-red">Excluir</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cards — apenas mobile */}
      <div className="flex flex-col divide-y md:hidden">
        {gastos.map((gasto) => (
          <div key={gasto.id} className="p-4 space-y-3">

            {/* Cabeçalho do card */}
            <div className="flex items-center justify-between">
              {editando === gasto.id ? (
                <select value={editTipo} onChange={(e) => setEditTipo(e.target.value as "gasto" | "perda")} className="p-1 border rounded text-sm">
                  <option value="gasto">Gasto</option>
                  <option value="perda">Perda</option>
                </select>
              ) : (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${gasto.tipo === "gasto" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {gasto.tipo === "gasto" ? "Gasto" : "Perda"}
                </span>
              )}
              <span className="text-xs text-gray-400">
                {toInputDate(new Date(gasto.data)).split("-").reverse().join("/")}
              </span>
            </div>

            {/* Descrição */}
            {editando === gasto.id ? (
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Descrição</label>
                  <input type="text" value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Valor (R$)</label>
                    <input type="number" step="0.01" value={editValor} onChange={(e) => setEditValor(e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Data</label>
                    <input type="date" value={editData} onChange={(e) => setEditData(e.target.value)} className="w-full p-1.5 border rounded text-sm" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="capitalize text-sm text-gray-800">{gasto.descricao}</span>
                <span className="font-semibold text-gray-800">R$ {Number(gasto.valor).toFixed(2)}</span>
              </div>
            )}

            {/* Ações */}
            {editando === gasto.id ? (
              <div className="flex gap-2">
                <button onClick={() => salvarEdicao(gasto.id)} className="btn-verde flex-1">Salvar</button>
                <button onClick={() => setEditando(null)} className="btn-red flex-1">Cancelar</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => iniciarEdicao(gasto)} className="btn-cinza flex-1">Editar</button>
                <button onClick={() => deletarGastoHandler(gasto.id)} className="btn-red flex-1">Excluir</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {gastos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum gasto ou perda registrado ainda.
        </div>
      )}
    </div>
  );
}