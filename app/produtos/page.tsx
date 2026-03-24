"use client"

import ProdutoForm from "@/components/ProdutoForm"
import ProdutoTable from "@/components/ProdutoTable"
import { listarProdutos } from "@/lib/produtos"
import Navbar from "@/components/Navbar"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export default function Produtos() {

  const [filtro, setFiltro] = useState("")
  const queryClient = useQueryClient()

  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: listarProdutos
  })

  const produtosFiltrados = produtos.filter((produto: any) => {
    const termo = filtro.toLowerCase()

    return (
      produto.nome?.toLowerCase().includes(termo) ||
      produto.custo?.toString().includes(termo) ||
      produto.preco?.toString().includes(termo)
    )
  })

  if (isLoading) return <p>Carregando...</p>

  return (
    <>
      <Navbar />

      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">Produtos</h1>

        <ProdutoForm
          reload={() => queryClient.invalidateQueries({ queryKey: ["produtos"] })}
        />

        <input
          type="text"
          placeholder="Buscar produto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <ProdutoTable
          produtos={produtosFiltrados}
          reload={() => queryClient.invalidateQueries({ queryKey: ["produtos"] })}
        />
      </div>
    </>
  )
}