/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

export default function VendasChart({vendas}:any){

const vendasPorDia:any = {}

vendas.forEach((pedido:any)=>{
  if(!pedido.data) return

  const data = pedido.data?.seconds
    ? new Date(pedido.data.seconds * 1000)
    : new Date(pedido.data)

  const dia = data.getDate()

  if(!vendasPorDia[dia]){
    vendasPorDia[dia] = 0
  }

  vendasPorDia[dia] += Number(pedido.total) || 0
})

const data = Object.keys(vendasPorDia).map((dia)=>({
dia,
total:vendasPorDia[dia]
}))

return(

<div className="border rounded-lg p-6 mt-10">

<h2 className="text-lg text-secondary font-bold mb-4">
Vendas do Mês
</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={data}>

<XAxis dataKey="dia" />

<YAxis />

<Tooltip
formatter={(value)=>
Number(value).toLocaleString("pt-BR",{
style:"currency",
currency:"BRL"
})
}

/>

<Bar
dataKey="total"
fill="#3b82f6"
radius={[6,6,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>

)

}