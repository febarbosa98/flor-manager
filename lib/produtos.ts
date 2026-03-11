import { db } from "./firebase"
import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc
} from "firebase/firestore"

const produtosCollection = collection(db,"produtos")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function criarProduto(data:any){
  await addDoc(produtosCollection,data)
}

export async function listarProdutos(){

  const snapshot = await getDocs(produtosCollection)

  return snapshot.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
  }))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function atualizarProduto(id:string,data:any){

  const ref = doc(db,"produtos",id)

  await updateDoc(ref,data)
}

export async function deletarProduto(id:string){

  const ref = doc(db,"produtos",id)

  await deleteDoc(ref)
}