/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { criarProduto } from "@/lib/produtos"
import { formatarMoeda } from "@/lib/formatarMoeda";

export default function ProdutoForm({reload}:any){

const [nome,setNome] = useState("")
const [custo,setCusto] = useState(0)
const [estoque,setEstoque] = useState(0)
const [preco,setPreco] = useState(0)
const [lucroPercent,setLucroPercent] = useState(50)


useEffect(()=>{

const precoCalculado = custo * (1 + lucroPercent / 100)

setPreco(Number(precoCalculado.toFixed(2)))

},[custo,lucroPercent])

// const preco = calcularPrecoVenda(custo)

async function salvar(){

await criarProduto({
nome,
custo,
preco,
estoque
})

reload()

}

return(

<div className="flex flex-col md:flex-row gap-4 mb-6 bg-card p-4 rounded-2xl justify-between">
  <div className="flex flex-col md:flex-row gap-3 ">
<div className="flex flex-col">
<label className="mb-2">Produto</label>   
<input
placeholder="Nome"
onChange={(e)=>setNome(e.target.value)}
className="input"
/>
</div>
<div className="flex flex-col">

<label className="mb-2">Preço de custo</label> 
<input
placeholder="Preço de custo"
type="number"
className="input"
onChange={(e)=>setCusto(Number(e.target.value))}
/>
</div>

<div className="flex flex-col">

<label className="mb-2">% de lucro</label> 
<input
placeholder="% de lucro"
type="number"
className="p-2 border input"
value={lucroPercent}
onChange={(e)=>setLucroPercent(Number(e.target.value))}
/>
</div>

<div className="flex flex-col">

<label className="mb-2">Estoque</label> 
<input
type="number"
placeholder="Estoque"
onChange={(e)=>setEstoque(Number(e.target.value))}
className="input"
/>
</div>


<div className="flex flex-col">

<p className="mb-4">Preço de venda sugerido: </p>
<b>{formatarMoeda(preco)}</b>
</div>

</div>

<button
onClick={salvar}
className="btn-cinza inline-block "
>

Salvar

</button>

</div>

)

}