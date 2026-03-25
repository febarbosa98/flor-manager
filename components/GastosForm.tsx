"use client";

import { useState } from "react";
import { toast } from "sonner";
import { criarGasto } from "../lib/gastos";



interface GastosFormProps {
  reload: () => void;
}

export default function GastosForm({ reload }: GastosFormProps) {
  const [tipo, setTipo] = useState<"gasto" | "perda">("gasto");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  

  

  async function salvarGasto() {
    if (!descricao || !valor) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      await criarGasto({
        tipo,
        descricao,
        valor: parseFloat(valor),
        data: new Date(),
      });
      toast.success("Gasto/perda salvo com sucesso!");
      setDescricao("");
      setValor("");
      reload();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao salvar!");
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl text-secondary font-semibold mb-4">Adicionar Gasto/Perda</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "gasto" | "perda")}
            className="w-full input"
          >
            <option value="gasto">Gasto</option>
            <option value="perda">Perda</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Compra de vasos, Produto estragado..."
            className="w-full input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0.00"
            className="w-full input"
          />
        </div>
      </div>
      <button
        onClick={salvarGasto}
        className="mt-4 btn-verde"
      >
        Salvar
      </button>
    </div>
  );
}