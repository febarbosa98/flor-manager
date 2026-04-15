import { describe, expect, it } from "vitest"
import { calcularTotalGastos, calcularTotalPerdas } from "../lib/gastos"

const gastos = [
  { id: "1", tipo: "gasto", descricao: "Compra de vasos", valor: 120, data: new Date() },
  { id: "2", tipo: "perda", descricao: "Flores murchas", valor: 45, data: new Date() },
  { id: "3", tipo: "gasto", descricao: "Fertilizante", valor: 80, data: new Date() }
]

describe("lib/gastos", () => {
  it("calcula o total de gastos", () => {
    expect(calcularTotalGastos(gastos)).toBe(245)
  })

  it("calcula o total de perdas", () => {
    expect(calcularTotalPerdas(gastos)).toBe(45)
  })
})
