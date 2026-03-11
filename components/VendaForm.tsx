/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { listarProdutos } from "@/lib/produtos";
import { criarVenda } from "@/lib/vendas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VendaForm({ reload }: any) {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    async function carregar() {
      const data = await listarProdutos();

      setProdutos(data);
    }

    carregar();
  }, []);

  async function vender() {

if(!produtoId){

alert("Selecione um produto")

return

}else{
    


    await criarVenda(produtoId, quantidade)

    toast("Produto vendido com sucesso")

    reload();}
  }

  return (
    <div className="flex gap-4 mb-6">
      <select
        className="border p-2"
        onChange={(e) => setProdutoId(e.target.value)}
      >
        <option>Selecione produto</option>

        {produtos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome} {' R$'}
            {p.preco}
          </option>
        ))}
      </select>

      

      <Input
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(Number(e.target.value))}
      />

      <Button onClick={vender}>Registrar venda</Button>
    </div>
  );
}
