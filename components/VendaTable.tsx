/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { deletarVenda } from "@/lib/vendas";
import { Button } from "./ui/button"


export default function VendaTable({ vendas, reload }: any) {

     async function remover(id: string) {
        await deletarVenda(id);
    
        reload();
      }

return (

<table className="w-full border">

<thead >

<tr className="border-b">

<th className="p-2">Produto</th>
<th className="p-2">Quantidade</th>
<th className="p-2">Lucro</th>
<th className="p-2">Total</th>
<th className="p-2">Data</th>

</tr>

</thead>

<tbody>

{vendas.map((v:any)=>(

<tr key={v.id} className="border-b">

<td className="p-2">{v.produto}</td>

<td className="p-2">{v.quantidade}</td>

<td className="p-2">R$ {Number(v.lucro).toFixed(2)}</td>

<td className="p-2">R$ {Number(v.total).toFixed(2)}</td>

<td className="p-2">
{v.data?.toDate ? v.data.toDate().toLocaleDateString("pt-BR") : "-"}
</td>

<td>
    <Button
variant="destructive"
onClick={()=>remover(v.id)}
>
Excluir
</Button>
</td>
</tr>

))}
</tbody>

</table>

)

}