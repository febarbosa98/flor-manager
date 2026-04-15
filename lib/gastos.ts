import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  orderBy,
  type DocumentData,
  type QueryDocumentSnapshot
} from "firebase/firestore"
import { db } from "./firebase"

export interface Gasto {
  id: string
  tipo: "gasto" | "perda"
  descricao: string
  valor: number
  data: Date
}

export function parseGastoDoc(doc: QueryDocumentSnapshot<DocumentData>): Gasto {
  const data = doc.data()
  const rawData = data.data

  return {
    id: doc.id,
    tipo: data.tipo === "perda" ? "perda" : "gasto",
    descricao: String(data.descricao ?? ""),
    valor: Number(data.valor ?? 0),
    data: rawData?.toDate ? rawData.toDate() : new Date(rawData)
  }
}

export async function criarGasto(data: Omit<Gasto, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "gastos"), {
    ...data,
    data: Timestamp.fromDate(data.data)
  })
  return docRef.id
}

export async function listarGastos(): Promise<Gasto[]> {
  const q = query(collection(db, "gastos"), orderBy("data", "desc"))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(parseGastoDoc)
}

export async function listarGastosPorPeriodo(
  inicio: Date,
  fim: Date
): Promise<Gasto[]> {
  const q = query(
    collection(db, "gastos"),
    where("data", ">=", Timestamp.fromDate(inicio)),
    where("data", "<=", Timestamp.fromDate(fim)),
    orderBy("data", "desc")
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(parseGastoDoc)
}

export async function atualizarGasto(
  id: string,
  data: Partial<Omit<Gasto, "id">>
): Promise<void> {
  const docRef = doc(db, "gastos", id)
  const dadosAtualizados: Record<string, unknown> = { ...data }

  if (data.data) {
    dadosAtualizados.data = Timestamp.fromDate(data.data)
  }

  await updateDoc(docRef, dadosAtualizados)
}

export async function deletarGasto(id: string): Promise<void> {
  const docRef = doc(db, "gastos", id)
  await deleteDoc(docRef)
}

export function calcularTotalGastos(gastos: Gasto[]): number {
  return gastos.reduce((total, gasto) => total + gasto.valor, 0)
}

export function calcularTotalPerdas(gastos: Gasto[]): number {
  return gastos
    .filter((gasto) => gasto.tipo === "perda")
    .reduce((total, gasto) => total + gasto.valor, 0)
}

export async function calcularTotalGastosMes(
  mes: number,
  ano: number
): Promise<number> {
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  const gastos = await listarGastosPorPeriodo(inicio, fim)
  return calcularTotalGastos(gastos)
}

export async function calcularTotalPerdasMes(
  mes: number,
  ano: number
): Promise<number> {
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  const gastos = await listarGastosPorPeriodo(inicio, fim)
  return calcularTotalPerdas(gastos)
}
