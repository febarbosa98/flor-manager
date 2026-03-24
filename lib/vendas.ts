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
  pedidoId?: string;
  data: Timestamp;
}

export async function criarVenda(produtoId: string, quantidade: number){

const ref = doc(db,"produtos",produtoId)

const produtoDoc = await getDoc(ref)

const produto = produtoDoc.data()

if (!produto) {
  throw new Error("Produto não encontrado")
}

const preco = Number(produto.preco)
const custo = Number(produto.custo)
const estoque = Number(produto.estoque)

const novoEstoque = estoque - quantidade

await updateDoc(ref,{
estoque:novoEstoque
})

const total = preco * quantidade

const lucro = (preco - custo) * quantidade

await addDoc(collection(db,"vendas"),{

produtoId,
produto:produto.nome,
quantidade,
total,
lucro,
data: serverTimestamp()

})

}

export async function criarVendas(vendas: { produtoId: string; quantidade: number }[]) {
  const pedidoId = Date.now().toString(); // ID único para o pedido

  for (const venda of vendas) {
    await criarVendaComPedido(venda.produtoId, venda.quantidade, pedidoId);
  }

  return pedidoId; // Retorna o ID do pedido
}

export async function criarVendaComPedido(produtoId: string, quantidade: number, pedidoId: string) {
  const ref = doc(db,"produtos",produtoId)

  const produtoDoc = await getDoc(ref)

  const produto = produtoDoc.data()

  if (!produto) {
    throw new Error("Produto não encontrado")
  }

  const preco = Number(produto.preco)
  const custo = Number(produto.custo)
  const estoque = Number(produto.estoque)

  const novoEstoque = estoque - quantidade

  await updateDoc(ref,{
    estoque:novoEstoque
  })

  const total = preco * quantidade
  const lucro = (preco - custo) * quantidade

  await addDoc(collection(db,"vendas"),{
    produtoId,
    produto:produto.nome,
    quantidade,
    total,
    lucro,
    pedidoId,
    data: serverTimestamp()
  })
}

export async function listarVendasPorPedido() {
  const snapshot = await getDocs(query(collection(db,"vendas"), orderBy("data", "desc")));

  const vendas: Venda[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    data: doc.data().data
  })) as Venda[];

  // Agrupar vendas por pedidoId
  const pedidosMap = new Map();

  vendas.forEach((venda) => {
    const pedidoId = venda.pedidoId || venda.id; // Fallback para vendas antigas sem pedidoId

    if (!pedidosMap.has(pedidoId)) {
      pedidosMap.set(pedidoId, {
        id: pedidoId,
        data: venda.data,
        itens: [],
        total: 0,
        lucro: 0
      });
    }

    const pedido = pedidosMap.get(pedidoId);
    pedido.itens.push(venda);
    pedido.total += venda.total;
    pedido.lucro += venda.lucro;
  });

  return Array.from(pedidosMap.values()).sort((a, b) =>
    b.data?.toDate?.()?.getTime?.() - a.data?.toDate?.()?.getTime?.()
  );
}
export async function listarVendasPorMes(ano:number, mes:number){

const inicio = new Date(ano, mes, 1)
const fim = new Date(ano, mes + 1, 1)

const q = query(
collection(db,"vendas"),
where("data",">=",Timestamp.fromDate(inicio)),
where("data","<",Timestamp.fromDate(fim)),
orderBy("data","desc")
)

const snapshot = await getDocs(q)

return snapshot.docs.map((doc)=>({
id:doc.id,
...doc.data()
}))

}


export async function deletarVenda(id:string){

  const ref = doc(db,"vendas",id)

  await deleteDoc(ref)
}

export async function listarVendasPorPeriodo(dataInicio: Date, dataFim: Date){

const inicio = Timestamp.fromDate(dataInicio)
const fim = Timestamp.fromDate(dataFim)

const q = query(
collection(db,"vendas"),
where("data",">=",inicio),
where("data","<=",fim),
orderBy("data","desc")
)

const snapshot = await getDocs(q)

return snapshot.docs.map((doc)=>({
id: doc.id,
...doc.data()
}))

}