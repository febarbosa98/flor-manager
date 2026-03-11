/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Dashboard from "@/components/DashboardCards"
import Navbar from "@/components/Navbar"
import VendasChart from "@/components/VendasChart"
import { buscarEstatisticas } from "@/lib/dashboard";
import { listarVendasPorMes } from "@/lib/vendas";
import { useEffect, useState } from "react";


export default function Home(){

   const [vendas, setVendas] = useState<{ id: string }[]>([]);
    const [stats,setStats] = useState<any>(null)
      const hoje = new Date()
      
  
  const mes =hoje.getMonth()
  const ano = hoje.getFullYear()
  
  
    async function carregar() {
     const data = await listarVendasPorMes(ano,mes);
     const statsData = await buscarEstatisticas(ano,mes)
  
      setVendas(data);
      setStats(statsData)
    }
  
    useEffect(()=>{
  carregar()
  },[mes,ano])
  

  return(

<div>

<Navbar/>

<div className="">



<Dashboard stats={stats} />
<VendasChart vendas={vendas}/>


</div>

</div>

  )
}