"use client"

import { useEffect,useState } from "react"
import ProdutoForm from "@/components/ProdutoForm"
import ProdutoTable from "@/components/ProdutoTable"
import { listarProdutos } from "@/lib/produtos"
import Navbar from "@/components/Navbar"

export default function Produtos(){

const [produtos,setProdutos] = useState<{ id: string }[]>([])

async function carregar(){

const data = await listarProdutos()

setProdutos(data)

}

useEffect(()=>{

// eslint-disable-next-line react-hooks/set-state-in-effect
carregar()

},[])

return(

    <>
    <Navbar/>
    <div className="p-10">

<h1 className="text-2xl font-bold mb-6">

Produtos

</h1>

<ProdutoForm reload={carregar}/>

<ProdutoTable
produtos={produtos}
reload={carregar}
/>

</div>
    </>

)

}