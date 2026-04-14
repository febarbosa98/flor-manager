import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  Timestamp,
  deleteDoc,
  orderBy
} from "firebase/firestore"

import { db } from "./firebase"

export interface Venda {
  id: string;
  produtoId: string;
  produto: string;
  quantidade: number;
  total: number;
  lucro: number;
  taxa: number;
  valorLiquido: number;
  formaPagamento: string;
  pedidoId?: string;
  data: Timestamp;
}

// 🔥 TAXAS CENTRALIZADAS
const TAXAS: Record<string, number> = {
  dinheiro: 0,
  pix: 0,
  debito: 1.79,
  credito: 3.69
}

// 🔥 CRIAR VÁRIAS VENDAS (PEDIDO)
export async function criarVendas(
  vendas: { produtoId: string; quantidade: number }[],
  formaPagamento: string
) {
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
export async function criarVendaComPedido(
  produtoId: string,
  quantidade: number,
  pedidoId: string,
  formaPagamento: string
) {
  const ref = doc(db, "produtos", produtoId)
  const produtoDoc = await getDoc(ref)
  const produto = produtoDoc.data()

  if (!produto) throw new Error("Produto não encontrado")

  const preco = Number(produto.preco)
  const custo = Number(produto.custo)
  const estoque = Number(produto.estoque)

  await updateDoc(ref, {
    estoque: estoque - quantidade
  })

  const total = preco * quantidade

  // 🔥 TAXA
  const taxaPercentual = TAXAS[formaPagamento as keyof typeof TAXAS] || 0
  const valorTaxa = (total * taxaPercentual) / 100

  // 🔥 LUCRO REAL
  const lucro = total - valorTaxa - (custo * quantidade)

  await addDoc(collection(db, "vendas"), {
    produtoId,
    produto: produto.nome,
    quantidade,
    total,
    lucro,
    taxa: valorTaxa,
    formaPagamento,
    valorLiquido: total - valorTaxa,
    pedidoId,
    data: serverTimestamp()
  })
}

// 🔥 LISTAR AGRUPADO POR PEDIDO
export async function listarVendasPorPedido() {
  const snapshot = await getDocs(
    query(collection(db, "vendas"), orderBy("data", "desc"))
  )

  const vendas: Venda[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    data: doc.data().data
  })) as Venda[]

  const pedidosMap = new Map()

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

    const pedido = pedidosMap.get(pedidoId)

    pedido.itens.push(venda)
    pedido.total += venda.total
    pedido.lucro += venda.lucro
    pedido.taxa += venda.taxa
    pedido.valorLiquido += venda.valorLiquido
  })

  return Array.from(pedidosMap.values()).sort(
    (a, b) =>
      b.data?.toDate?.()?.getTime?.() -
      a.data?.toDate?.()?.getTime?.()
  )
}

// 🔥 FILTRO POR MÊS
export async function listarVendasPorMes(ano: number, mes: number) {
  const inicio = new Date(ano, mes, 1)
  const fim = new Date(ano, mes + 1, 1)

  const q = query(
    collection(db, "vendas"),
    where("data", ">=", Timestamp.fromDate(inicio)),
    where("data", "<", Timestamp.fromDate(fim)),
    orderBy("data", "desc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
}

// 🔥 FILTRO POR PERÍODO
export async function listarVendasPorPeriodo(
  dataInicio: Date,
  dataFim: Date
) {
  const inicio = Timestamp.fromDate(dataInicio)
  const fim = Timestamp.fromDate(dataFim)

  const q = query(
    collection(db, "vendas"),
    where("data", ">=", inicio),
    where("data", "<=", fim),
    orderBy("data", "desc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
}

// 🔥 DELETAR
export async function deletarVenda(id: string) {
  const ref = doc(db, "vendas", id)
  await deleteDoc(ref)
}