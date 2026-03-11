/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { buscarEstatisticas } from "@/lib/dashboard"

export default function Dashboard({stats}:any){


if(!stats) return null

return(

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">

<div className="p-6 border rounded-lg">
<h2 className="text-sm text-gray-500">Vendas hoje</h2>
<p className="text-2xl font-bold">R$ {stats.vendasHoje}</p>
</div>

<div className="p-6 border rounded-lg">
<h2 className="text-sm text-gray-500">Vendas do mês</h2>
<p className="text-2xl font-bold">R$ {stats.vendasMes}</p>
</div>

<div className="p-6 border rounded-lg">
<h2 className="text-sm text-gray-500">Lucro do mês</h2>
<p className="text-2xl font-bold">R$ {stats.lucroMes}</p>
</div>

<div className="p-6 border rounded-lg">
<h2 className="text-sm text-gray-500">Produtos vendidos</h2>
<p className="text-2xl font-bold">{stats.produtosVendidos}</p>
</div>

<div className="p-6 border rounded-lg">
<h2 className="text-sm text-gray-500">Produto mais vendido</h2>
<p className="text-2xl font-bold">{stats.maisVendido}</p>
</div>

</div>

)

}