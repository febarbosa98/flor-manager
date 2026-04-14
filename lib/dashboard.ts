/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore"

import { db } from "./firebase"
import { calcularTotalGastosMes, calcularTotalPerdasMes } from "./gastos"

export async function buscarEstatisticas(ano: number, mes: number) {

  const inicio = new Date(ano, mes, 1)
  const fim = new Date(ano, mes + 1, 1)

  
  const q = query(
      collection(db, "vendas"),
      where("data", ">=", Timestamp.fromDate(inicio)),
      where("data", "<", Timestamp.fromDate(fim))
    )
    
    const snapshot = await getDocs(q)
    
    let vendasHoje = 0
    let vendasMes = 0
    let lucroMes = 0
    let lucroTotal = 0
    let produtosVendidos = 0
    let taxasMes = 0
    let valorLiquidoMes = 0
    let valorLiquidoHoje = 0

  const produtos: any = {}

  const hoje = new Date().toDateString()

  snapshot.forEach((doc) => {
    const venda = doc.data()
    if (!venda) return

    const total = Number(venda.total) || 0
    const lucro = Number(venda.lucro) || 0
    const quantidade = Number(venda.quantidade) || 0
    const valorLiquido = !isNaN(Number(venda.valorLiquido))
  ? Number(venda.valorLiquido)
  : total - (Number(venda.taxa) || 0)

    const dataVenda = venda.data?.toDate?.()
    if (!dataVenda) return

    // 🔹 HOJE
    if (dataVenda.toDateString() === hoje) {
      vendasHoje += total
      valorLiquidoHoje += valorLiquido
    }

    // 🔹 MÊS
    vendasMes += total
    lucroMes += lucro
    produtosVendidos += quantidade
    valorLiquidoMes += valorLiquido

    // 🔹 MAIS VENDIDO
    if (!produtos[venda.produto]) {
      produtos[venda.produto] = 0
    }
    produtos[venda.produto] += quantidade

    lucroTotal += lucro

    const taxa = Number(venda.taxa) || 0
    taxasMes += taxa
  })

  let maisVendido = "-"
  let maior = 0

  Object.entries(produtos).forEach(([nome, qtd]: any) => {
    if (qtd > maior) {
      maior = qtd
      maisVendido = nome
    }
  })

  const gastosMes = await calcularTotalGastosMes(mes + 1, ano)
  const perdasMes = await calcularTotalPerdasMes(mes + 1, ano)
  

  return {
    vendasHoje,
    vendasMes,
    lucroMes,
    lucroTotal,
    produtosVendidos,
    maisVendido,
    gastosMes,
    perdasMes,
    taxasMes,
    valorLiquidoMes,
    valorLiquidoHoje
  }
}