/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "./firebase"

export function listenVendas(callback: (data: any[]) => void) {
  const q = query(collection(db, "vendas"), orderBy("data", "desc"))

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    callback(data)
  })
}

export function listenGastos(callback: (data: any[]) => void) {
  const q = query(collection(db, "gastos"), orderBy("data", "desc"))

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    callback(data)
  })
}