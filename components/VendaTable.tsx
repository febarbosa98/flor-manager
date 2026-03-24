/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { deletarVenda } from "@/lib/vendas";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function VendaTable({ vendas, reload }: any) {
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null);

  async function remover(id: string) {
    await deletarVenda(id);
    reload();
  }

  async function removerPedido(pedidoId: string) {
    // Remove todas as vendas do pedido
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
          {/* Linha principal do pedido */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div>
                  <span className="font-semibold text-lg">Pedido #{pedido.id.slice(-6)}</span>
                  <span className="text-sm text-gray-600 ml-4">
                    {pedido.data?.toDate ? pedido.data.toDate().toLocaleDateString("pt-BR") : "-"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {pedido.itens.length} produto(s)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="font-bold text-lg text-green-600">
                    R$ {Number(pedido.total).toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPedidoExpandido(pedidoExpandido === pedido.id ? null : pedido.id)}
                      >
                        {pedidoExpandido === pedido.id ? "Ocultar" : "Ver Itens"}
                      </Button>
                    </DialogTrigger>
                   
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja excluir este pedido inteiro?")) {
                        removerPedido(pedido.id);
                      }
                    }}
                  >
                    Excluir Pedido
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Itens do pedido (expandido) */}
          {pedidoExpandido === pedido.id && (
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Produto</th>
                    <th className="p-2 text-center">Quantidade</th>
                    <th className="p-2 text-right">Preço Unitário</th>
                    <th className="p-2 text-right">Total</th>
                    <th className="p-2 text-right">Lucro</th>
                    <th className="p-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.itens.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.produto}</td>
                      <td className="p-2 text-center">{item.quantidade}</td>
                      <td className="p-2 text-right">
                        R$ {Number(item.total / item.quantidade).toFixed(2)}
                      </td>
                      <td className="p-2 text-right font-semibold">
                        R$ {Number(item.total).toFixed(2)}
                      </td>
                      <td className="p-2 text-right text-green-600">
                        R$ {Number(item.lucro).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="destructive"
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