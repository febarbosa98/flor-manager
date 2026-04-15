import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  where
} from "firebase/firestore"

import { db } from "./firebase"

export type FormaPagamento = "dinheiro" | "pix" | "debito" | "credito"

export interface Venda {
  id: string
  produtoId: string
  produto: string
  quantidade: number
  total: number
  lucro: number
  taxa: number
  valorLiquido: number
  formaPagamento: FormaPagamento
  pedidoId?: string
  data: Date
}

export interface VendaInput {
  produtoId: string
  quantidade: number
}

export interface PedidoVenda {
  id: string
  data: Date
  itens: Venda[]
  total: number
  lucro: number
  taxa: number
  valorLiquido: number
  formaPagamento: FormaPagamento
}

const TAXAS: Record<FormaPagamento, number> = {
  dinheiro: 0,
  pix: 0,
  debito: 1.79,
  credito: 3.69
}

// 🔥 CRIAR VÁRIAS VENDAS (PEDIDO)
export async function criarVendas(
  vendas: VendaInput[],
  formaPagamento: FormaPagamento
): Promise<string> {
  const pedidoId = Date.now().toString()

  for (const venda of vendas) {
    await criarVendaComPedido(
      venda.produtoId,
      venda.quantidade,
      pedidoId,
      formaPagamento
    )
  }

  return pedidoId
}

// 🔥 CRIAR VENDA COM PEDIDO + TAXA
export function calcularTaxa(total: number, formaPagamento: string): number {
  const percentual = TAXAS[formaPagamento as FormaPagamento] ?? 0
  return Number(((total * percentual) / 100).toFixed(2))
}

export function calcularValorLiquido(total: number, taxa: number): number {
  return Number((total - taxa).toFixed(2))
}

export function calcularLucro(
  total: number,
  custo: number,
  quantidade: number,
  taxa: number
): number {
  return Number((total - taxa - custo * quantidade).toFixed(2))
}

export function calcularNovoEstoque(estoque: number, quantidade: number): number {
  if (quantidade < 0) {
    throw new Error("Quantidade inválida")
  }

  if (quantidade > estoque) {
    throw new Error("Estoque insuficiente")
  }

  return estoque - quantidade
}

export function parseVendaDoc(doc: QueryDocumentSnapshot<DocumentData>): Venda {
  const data = doc.data()
  const rawData = data.data

  const formaPagamentoRaw = data.formaPagamento
  const formaPagamento: FormaPagamento = (
    formaPagamentoRaw === "dinheiro" ||
    formaPagamentoRaw === "pix" ||
    formaPagamentoRaw === "debito" ||
    formaPagamentoRaw === "credito"
  ) ? formaPagamentoRaw : "dinheiro"

  return {
    id: doc.id,
    produtoId: String(data.produtoId ?? ""),
    produto: String(data.produto ?? ""),
    quantidade: Number(data.quantidade ?? 0),
    total: Number(data.total ?? 0),
    lucro: Number(data.lucro ?? 0),
    taxa: Number(data.taxa ?? 0),
    valorLiquido: Number(data.valorLiquido ?? 0),
    formaPagamento,
    pedidoId: data.pedidoId ? String(data.pedidoId) : undefined,
    data: rawData?.toDate ? rawData.toDate() : new Date(rawData)
  }
}

export async function criarVendaComPedido(
  produtoId: string,
  quantidade: number,
  pedidoId: string,
  formaPagamento: FormaPagamento
): Promise<string> {
  const produtoRef = doc(db, "produtos", produtoId)
  const vendaRef = doc(collection(db, "vendas"))

  await runTransaction(db, async (transaction) => {
    const produtoDoc = await transaction.get(produtoRef)

    if (!produtoDoc.exists()) {
      throw new Error("Produto não encontrado")
    }

    const produto = produtoDoc.data() as {
      nome: string
      preco: number | string
      custo: number | string
      estoque: number | string
    }

    const preco = Number(produto.preco)
    const custo = Number(produto.custo)
    const estoque = Number(produto.estoque)

    const novoEstoque = calcularNovoEstoque(estoque, quantidade)

    transaction.update(produtoRef, {
      estoque: novoEstoque
    })

    const total = Number((preco * quantidade).toFixed(2))
    const taxa = calcularTaxa(total, formaPagamento)
    const valorLiquido = calcularValorLiquido(total, taxa)
    const lucro = calcularLucro(total, custo, quantidade, taxa)

    transaction.set(vendaRef, {
      produtoId,
      produto: produto.nome,
      quantidade,
      total,
      lucro,
      taxa,
      formaPagamento,
      valorLiquido,
      pedidoId,
      data: serverTimestamp()
    })
  })

  return vendaRef.id
}

// 🔥 LISTAR AGRUPADO POR PEDIDO
export async function listarVendasPorPedido(): Promise<PedidoVenda[]> {
  const snapshot = await getDocs(
    query(collection(db, "vendas"), orderBy("data", "desc"))
  )

  const vendas = snapshot.docs.map(parseVendaDoc)

  const pedidosMap = new Map<string, PedidoVenda>()

  vendas.forEach((venda) => {
    const pedidoId = venda.pedidoId || venda.id

    if (!pedidosMap.has(pedidoId)) {
      pedidosMap.set(pedidoId, {
        id: pedidoId,
        data: venda.data,
        itens: [],
        total: 0,
        lucro: 0,
        taxa: 0,
        valorLiquido: 0,
        formaPagamento: venda.formaPagamento
      })
    }

    const pedido = pedidosMap.get(pedidoId)!
    pedido.itens.push(venda)
    pedido.total += venda.total
    pedido.lucro += venda.lucro
    pedido.taxa += venda.taxa
    pedido.valorLiquido += venda.valorLiquido
  })

  return Array.from(pedidosMap.values()).sort(
    (a, b) => b.data.getTime() - a.data.getTime()
  )
}

// 🔥 FILTRO POR MÊS
export async function listarVendasPorMes(
  ano: number,
  mes: number
): Promise<Venda[]> {
  const inicio = new Date(ano, mes, 1)
  const fim = new Date(ano, mes + 1, 1)

  const q = query(
    collection(db, "vendas"),
    where("data", ">=", Timestamp.fromDate(inicio)),
    where("data", "<", Timestamp.fromDate(fim)),
    orderBy("data", "desc")
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(parseVendaDoc)
}

// 🔥 FILTRO POR PERÍODO
export async function listarVendasPorPeriodo(
  dataInicio: Date,
  dataFim: Date
): Promise<Venda[]> {
  const inicio = Timestamp.fromDate(dataInicio)
  const fim = Timestamp.fromDate(dataFim)

  const q = query(
    collection(db, "vendas"),
    where("data", ">=", inicio),
    where("data", "<=", fim),
    orderBy("data", "desc")
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(parseVendaDoc)
}

// 🔥 DELETAR
export async function deletarVenda(id: string) {
  const ref = doc(db, "vendas", id)
  await deleteDoc(ref)
}