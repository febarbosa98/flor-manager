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

export async function listarVendas(){

const snapshot = await getDocs(collection(db,"vendas"))

return snapshot.docs.map((doc)=>({
id: doc.id,
...doc.data()
}))

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