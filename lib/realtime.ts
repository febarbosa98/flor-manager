import type { DocumentData, QueryDocumentSnapshot, Unsubscribe } from "firebase/firestore"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "./firebase"
import { Gasto, parseGastoDoc } from "./gastos"
import { Venda, parseVendaDoc } from "./vendas"

export function listenVendas(callback: (data: Venda[]) => void): Unsubscribe {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"))

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) =>
      parseVendaDoc(doc)
    )

    callback(data)
  })
}

export function listenGastos(callback: (data: Gasto[]) => void): Unsubscribe {
  const q = query(collection(db, "gastos"), orderBy("data", "desc"))

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) =>
      parseGastoDoc(doc)
    )

    callback(data)
  })
}