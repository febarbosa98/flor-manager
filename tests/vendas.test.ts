import { describe, expect, it } from "vitest"
import {
  calcularLucro,
  calcularNovoEstoque,
  calcularTaxa,
  calcularValorLiquido
} from "../lib/vendas"

describe("lib/vendas", () => {
  it("calcula a taxa corretamente para débito", () => {
    expect(calcularTaxa(100, "debito")).toBeCloseTo(1.79)
  })

  it("calcula valor líquido corretamente", () => {
    expect(calcularValorLiquido(200, 4)).toBe(196)
  })

  it("calcula o lucro correto", () => {
    expect(calcularLucro(100, 20, 2, 3)).toBe(57)
  })

  it("reduz estoque corretamente e evita venda quando não há estoque suficiente", () => {
    expect(calcularNovoEstoque(10, 3)).toBe(7)
    expect(() => calcularNovoEstoque(5, 6)).toThrow("Estoque insuficiente")
  })
})
