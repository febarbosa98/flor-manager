"use client"
import Navbar from "@/components/Navbar"
import Image from "next/image"

export default function Home(){

  return(

<div>

<Navbar/>

<div className="container mx-auto p-4">
  <div className="grid grid-cols-2 gap-2">
<div className="text-center flex flex-col justify-center text-ring">

    <h1 className="text-5xl font-semibold">Bem-vindo ao seu painel de gestão</h1>
    <p className="text-2xl mt-4">Acompanhe suas vendas, controle seus gastos e tome decisões mais rápidas com dados em tempo real.</p>
</div>

<Image
      src="/LogoFloricultura2.png"
      width={500}
      height={500}
      alt="Picture of the author"
      />

      </div>


</div>

</div>

  )
}