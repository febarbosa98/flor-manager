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

export default function GastosTable({ gastos, reload }: GastosTableProps) {
  const [editando, setEditando] = useState<string | null>(null);
  const [editTipo, setEditTipo] = useState<"gasto" | "perda">("gasto");
  const [editDescricao, setEditDescricao] = useState("");
  const [editValor, setEditValor] = useState("");

  function iniciarEdicao(gasto: Gasto) {
    setEditando(gasto.id);
    setEditTipo(gasto.tipo);
    setEditDescricao(gasto.descricao);
    setEditValor(gasto.valor.toString());
  }

  async function salvarEdicao(id: string) {
    try {
      await atualizarGasto(id, {
        tipo: editTipo,
        descricao: editDescricao,
        valor: parseFloat(editValor),
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
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {gastos.map((gasto) => (
            <tr key={gasto.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editando === gasto.id ? (
                  <select
                    value={editTipo}
                    onChange={(e) => setEditTipo(e.target.value as "gasto" | "perda")}
                    className="w-full p-1 border rounded"
                  >
                    <option value="gasto">Gasto</option>
                    <option value="perda">Perda</option>
                  </select>
                ) : (
                  <span className={`p-2 text-xs font-medium rounded-full ${
                    gasto.tipo === "gasto"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {gasto.tipo === "gasto" ? "Gasto" : "Perda"}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">
                {editando === gasto.id ? (
                  <input
                    type="text"
                    value={editDescricao}
                    onChange={(e) => setEditDescricao(e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  gasto.descricao
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editando === gasto.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editValor}
                    onChange={(e) => setEditValor(e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  `R$ ${Number(gasto.valor).toFixed(2)}`
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(gasto.data).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editando === gasto.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => salvarEdicao(gasto.id)}
                      className="btn-verde"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditando(null)}
                      className="btn-red"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => iniciarEdicao(gasto)}
                      className="btn-cinza"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deletarGastoHandler(gasto.id)}
                      className="btn-red"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {gastos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum gasto ou perda registrado ainda.
        </div>
      )}
    </div>
  );
}