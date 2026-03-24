/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"
import { calcularTotalGastosMes, calcularTotalPerdasMes } from "./gastos"

export async function buscarEstatisticas(ano:number, mes:number){

const snapshot = await getDocs(collection(db,"vendas"))

let vendasHoje = 0
let lucroTotal = 0

let vendasMes = 0
let lucroMes = 0
let produtosVendidos = 0

const produtos:any = {}

const hoje = new Date().toDateString()
const mesAtual = mes
const anoAtual = ano

snapshot.forEach((doc)=>{

const venda = doc.data()

if(!venda) return

const total = Number(venda.total) || 0
const lucro = Number(venda.lucro) || 0
const quantidade = Number(venda.quantidade) || 0

if(venda.data){

const dataVenda = venda.data.toDate()

// vendas hoje
if(dataVenda.toDateString() === hoje){
vendasHoje += total
}

// vendas do mês
if(
dataVenda.getMonth() === mesAtual &&
dataVenda.getFullYear() === anoAtual
){
vendasMes += total
lucroMes += lucro
produtosVendidos += quantidade

if(!produtos[venda.produto]){
produtos[venda.produto] = 0
}

produtos[venda.produto] += quantidade

}

}

lucroTotal += lucro

})

let maisVendido = "-"
let maior = 0

Object.entries(produtos).forEach(([nome,qtd]:any)=>{

if(qtd > maior){
maior = qtd
maisVendido = nome
}

})

// Calcular gastos e perdas do mês
const gastosMes = await calcularTotalGastosMes(mesAtual + 1, anoAtual)
const perdasMes = await calcularTotalPerdasMes(mesAtual + 1, anoAtual)

return {
vendasHoje,
lucroTotal,
vendasMes,
lucroMes,
produtosVendidos,
maisVendido,
gastosMes,
perdasMes
}

}