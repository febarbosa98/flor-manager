/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { deletarProduto, atualizarProduto } from "@/lib/produtos";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { formatarMoeda } from "@/lib/formatarMoeda";

export default function ProdutoTable({ produtos, reload }: any) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [idAtual, setIdAtual] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  

  function abrirEdicao(produto: any) {
    setNome(produto.nome);
    setPreco(produto.preco);
    setEstoque(produto.estoque);
    setIdAtual(produto.id);
  }

  async function salvarEdicao() {
    
// setLoading(true)

try{

    await atualizarProduto(idAtual, {
      nome,
      preco: Number(preco),
      estoque: Number(estoque),
    });
    toast("Produto salvo com sucesso")
    setDialogOpen(false);

    reload();
}catch{

toast.error("Erro ao atualizar produto")

}

// setLoading(false)


  }

  async function remover(id: string) {
    await deletarProduto(id);

    reload();
  }

  return (
    <table className="w-full border card table-auto md:table-fixed">
      <thead className="text-lg text-secondary font-semibold">
        <tr className="border-b">
          <th className="p-2 text-left">Nome</th>
          <th className="p-2 text-left">Preço de custo</th>
          <th className="p-2 text-left">Preço de venda</th>
          <th className="p-2 text-left">Estoque</th>
          <th className="p-2 text-left">Ações</th>
        </tr>
      </thead>

      <tbody>
{produtos.map((produto:any)=>(
<tr key={produto.id} className="border-b ">

<td className="p-2 capitalize ">{produto.nome}</td>
<td className="p-2"> {formatarMoeda(produto.custo)}</td>
<td className="p-2"> {formatarMoeda(produto.preco)}</td>
<td className="p-2">{produto.estoque}</td>

<td className="p-2 flex gap-2">

<Button
// variant="secondary"
className="btn-cinza"
onClick={()=>{
abrirEdicao(produto)
setDialogOpen(true)
}}
>
Editar
</Button>

<Button
className="btn-red"
onClick={()=>
{
if (confirm("Tem certeza que deseja excluir este pedido inteiro?")) {

  
  remover(produto.id) 
}
}}
>
Excluir
</Button>

</td>

</tr>
))}
</tbody>
<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

<DialogContent>

<DialogHeader>

<DialogTitle>
Editar Produto
</DialogTitle>

<DialogDescription>
Altere as informações do produto abaixo
</DialogDescription>

</DialogHeader>

<div className="flex flex-col gap-2">

<label>Nome Produto</label> 
<Input
value={nome}
onChange={(e)=>setNome(e.target.value)}
className="input capitalize"
/>

<label className="mt-2">Preço de venda</label> 
<Input
type="number"
value={preco}
onChange={(e)=>setPreco(e.target.value)}
className="input"
/>

<label className="mt-2">Estoque</label> 
<Input
type="number"
value={estoque}
onChange={(e)=>setEstoque(e.target.value)}
className="input"
/>

<Button onClick={salvarEdicao} className="btn-cinza">
Salvar
</Button>

</div>

</DialogContent>

</Dialog>
    </table>
  );
}
