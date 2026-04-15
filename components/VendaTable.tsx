/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { deletarVenda } from "@/lib/vendas";
import { Button } from "./ui/button";

export default function VendaTable({ vendas, reload }: any) {
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null);

  async function remover(id: string) {
    await deletarVenda(id);
    reload();
  }

  async function removerPedido(pedidoId: string) {
    const pedido = vendas.find((p: any) => p.id === pedidoId);
    if (pedido) {
      for (const item of pedido.itens) {
        await deletarVenda(item.id);
      }
      reload();
    }
  }

  return (
    <div className="space-y-4">
      {vendas.map((pedido: any) => (
        <div key={pedido.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cabeçalho do pedido */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              {/* Info do pedido */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                <div>
                  <span className="font-semibold text-secondary text-lg">
                    Pedido #{pedido.id.slice(-6)}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
  {pedido.data?.toDate && (
  <>
    {pedido.data.toDate().toLocaleDateString("pt-BR")} 🕒
    {pedido.data.toDate().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </>
)}
</span>
                </div>
                <span className="text-sm bg-accent text-accent-foreground px-2 py-1 rounded w-fit">
                  {pedido.itens.length} produto(s)
                </span>
              </div>

              {/* Total + ações */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div>
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="font-bold text-lg text-green-600">
                    R$ {Number(pedido.total).toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="btn-cinza"
                    size="sm"
                    onClick={() => setPedidoExpandido(pedidoExpandido === pedido.id ? null : pedido.id)}
                  >
                    {pedidoExpandido === pedido.id ? "Ocultar" : "Ver Itens"}
                  </Button>

                  <Button
                    className="btn-red"
                    size="sm"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja excluir este pedido inteiro?")) {
                        removerPedido(pedido.id);
                      }
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Itens expandidos */}
          {pedidoExpandido === pedido.id && (
            <div className="p-4">

              {/* Tabela — apenas desktop */}
              <table className="w-full   md:table-fixed text-center hidden md:table">
                <thead className="text-sm font-bold">
                  <tr className="border-b">
                    <th className="p-2 ">Produto</th>
                    <th className="p-2 ">Qtd</th>
                    <th className="p-2 ">Preço Unit.</th>
                    <th className="p-2 ">Forma de Pagamento</th>
                    <th className="p-2 ">Total</th>
                    <th className="p-2 ">Taxa</th>
                    <th className="p-2 ">Total liquido</th>
                    <th className="p-2 ">Lucro</th>
                    <th className="p-2 ">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.itens.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 capitalize">{item.produto}</td>
                      <td className="p-2 ">{item.quantidade}</td>
                      <td className="p-2 ">
                        R$ {Number(item.total / item.quantidade).toFixed(2)}
                      </td>
                      <td className="p-2  capitalize">
                        {item.formaPagamento}
                      </td>
                      <td className="p-2  font-semibold">
                        R$ {Number(item.total).toFixed(2)}
                      </td>
                                          
                      <td className="p-2  text-red-500">
                        R$ {Number(item.taxa).toFixed(2)}
                      </td>
                      <td className="p-2  font-semibold">
                        R$ {Number(item.valorLiquido).toFixed(2)}
                      </td>
                      <td className="p-2  text-green-600">
                        R$ {Number(item.lucro).toFixed(2)}
                      </td>
                      <td className="p-2 ">
                        <Button
                          className="btn-red"
                          size="sm"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja excluir este item?")) {
                              remover(item.id);
                            }
                          }}
                        >
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cards — apenas mobile */}
              <div className="flex flex-col gap-3 md:hidden">
                {pedido.itens.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold capitalize text-secondary">{item.produto}</span>
                      <Button
                        className="btn-red"
                        size="sm"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir este item?")) {
                            remover(item.id);
                          }
                        }}
                      >
                        Excluir
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <div className="text-xs text-gray-400">Quantidade</div>
                        <div className="font-medium text-gray-800">{item.quantidade}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Preço Unit.</div>
                        <div className="font-medium text-gray-800">
                          R$ {Number(item.total / item.quantidade).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Forma de Pagamento</div>
                        <div className="font-medium text-gray-800 capitalize">
                          {item.formaPagamento}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Total</div>
                        <div className="font-semibold text-gray-800">
                          R$ {Number(item.total).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Taxa</div>
                        <div className="font-semibold text-red-600">
                          R$ {Number(item.taxa).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Total liquido</div>
                        <div className="font-semibold text-gray-800">
                          R$ {Number(item.valorLiquido).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-xs text-gray-400">Lucro: </span>
                      <span className="font-semibold text-green-600">
                        R$ {Number(item.lucro).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      ))}

      {vendas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma venda registrada ainda.
        </div>
      )}
    </div>
  );
}