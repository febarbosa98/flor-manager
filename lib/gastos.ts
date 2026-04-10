/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface Gasto {
  id: string;
  tipo: "gasto" | "perda";
  descricao: string;
  valor: number;
  data: Date;
}

export async function criarGasto(data: Omit<Gasto, "id">) {
  try {
    const docRef = await addDoc(collection(db, "gastos"), {
      ...data,
      data: Timestamp.fromDate(data.data),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar gasto:", error);
    throw error;
  }
}

export async function listarGastos() {
  try {
    const q = query(collection(db, "gastos"), orderBy("data", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
  const data = doc.data();
  const rawData = data.data;

  return {
    id: doc.id,
    ...data,
    data: rawData?.toDate ? rawData.toDate() : new Date(rawData),
  };
}) as Gasto[];
  } catch (error) {
    console.error("Erro ao listar gastos:", error);
    throw error;
  }
}

export async function listarGastosPorPeriodo(inicio: Date, fim: Date) {
  try {
    const q = query(
      collection(db, "gastos"),
      where("data", ">=", Timestamp.fromDate(inicio)),
      where("data", "<=", Timestamp.fromDate(fim)),
      orderBy("data", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
  const data = doc.data();
  const rawData = data.data;

  return {
    id: doc.id,
    ...data,
    data: rawData?.toDate ? rawData.toDate() : new Date(rawData),
  };
}) as Gasto[];
  } catch (error) {
    console.error("Erro ao listar gastos por período:", error);
    throw error;
  }
}

export async function atualizarGasto(id: string, data: Partial<Omit<Gasto, "id">>) {
  try {
    const docRef = doc(db, "gastos", id);

    const dadosAtualizados: any = { ...data };

    if (data.data) {
      dadosAtualizados.data = Timestamp.fromDate(data.data);
    }

    await updateDoc(docRef, dadosAtualizados);
  } catch (error) {
    console.error("Erro ao atualizar gasto:", error);
    throw error;
  }
}

export async function deletarGasto(id: string) {
  try {
    const docRef = doc(db, "gastos", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao deletar gasto:", error);
    throw error;
  }
}

export async function calcularTotalGastosMes(mes: number, ano: number) {
  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0, 23, 59, 59);

  const gastos = await listarGastosPorPeriodo(inicio, fim);
  return gastos.reduce((total, gasto) => total + gasto.valor, 0);
}

export async function calcularTotalPerdasMes(mes: number, ano: number) {
  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0, 23, 59, 59);

  const gastos = await listarGastosPorPeriodo(inicio, fim);
  return gastos
    .filter((gasto) => gasto.tipo === "perda")
    .reduce((total, gasto) => total + gasto.valor, 0);
}