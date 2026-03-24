/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { criarProduto } from "@/lib/produtos"

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

<div className="flex gap-4 mb-6">
<input
placeholder="Produto"
onChange={(e)=>setNome(e.target.value)}
className="border p-2"
/>

<input
placeholder="Preço de custo"
type="number"
onChange={(e)=>setCusto(Number(e.target.value))}
/>

<input
placeholder="% de lucro"
type="number"
value={lucroPercent}
onChange={(e)=>setLucroPercent(Number(e.target.value))}
/>

<input
type="number"
placeholder="Estoque"
onChange={(e)=>setEstoque(Number(e.target.value))}
className="border p-2"
/>

<div className="p-2">

Preço de venda sugerido: <b>R$ {preco}</b>

</div>

<button
onClick={salvar}
className="btn-cinza"
>

Salvar

</button>

</div>

)

}