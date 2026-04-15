/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { listarProdutos } from "@/lib/produtos";
import { criarVendas, type FormaPagamento } from "@/lib/vendas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ItemCarrinho {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  subtotal: number;
}

const TAXAS = {
  dinheiro: 0,
  pix: 0,
  debito: 1.79,
  credito: 3.69,
}

export default function VendaForm({ reload }: any) {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[]>([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("credito");

  useEffect(() => {
    async function carregar() {
      const data = await listarProdutos();
      setProdutos(data);
    }
    carregar();
  }, []);

  useEffect(() => {
    const termo = busca.toLowerCase();
    setProdutosFiltrados(produtos.filter((p) => p.nome.toLowerCase().includes(termo)));
  }, [busca, produtos]);

  const adicionarAoCarrinho = () => {
    if (!produtoId) {
      toast.error("Selecione um produto");
      return;
    }

    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) return;

    const subtotal = produto.preco * quantidade;
    const itemExistente = carrinho.find((item) => item.produtoId === produtoId);

    if (itemExistente) {
      setCarrinho(carrinho.map((item) =>
        item.produtoId === produtoId
          ? { ...item, quantidade: item.quantidade + quantidade, subtotal: item.subtotal + subtotal }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { produtoId, nome: produto.nome, preco: produto.preco, quantidade, subtotal }]);
    }

    setProdutoId("");
    setQuantidade(1);
    setBusca("");
    toast.success("Produto adicionado ao carrinho");
  };

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho(carrinho.filter((item) => item.produtoId !== produtoId));
  };


  const calcularTotal = () =>
  carrinho.reduce((total, item) => total + item.subtotal, 0)

const calcularTaxa = () => {
  const total = calcularTotal()
  const taxa = TAXAS[formaPagamento as keyof typeof TAXAS] || 0
  return (total * taxa) / 100
}

const calcularLiquido = () => {
  return calcularTotal() - calcularTaxa()
}

  const registrarVendas = async () => {
  if (carrinho.length === 0) {
    toast.error("Adicione produtos ao carrinho")
    return
  }

  if (!formaPagamento) {
    toast.error("Selecione a forma de pagamento")
    return
  }

  try {
    const vendas = carrinho.map((item) => ({
      produtoId: item.produtoId,
      quantidade: item.quantidade
    }))

    // 🔥 AGORA ENVIA FORMA DE PAGAMENTO
    await criarVendas(vendas, formaPagamento)

    toast.success("Venda registrada com sucesso!")

    setCarrinho([])
    setModalAberto(false)
    reload?.()

  } catch (error) {
    console.error(error)
    toast.error("Erro ao registrar venda")
  }
}

  function selecionarProduto(produto: any) {
    setProdutoId(produto.id);
    setBusca(produto.nome);
    setMostrarLista(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-lg text-secondary font-semibold mb-4">Adicionar Produto à Venda</h3>

        {/* Campos — empilhados no mobile, linha no desktop */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">

          {/* Busca de produto */}
          <div className="flex-1 relative">
            <label className="block text-sm font-medium mb-1">Produto</label>
            <Input
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setMostrarLista(true); }}
              onFocus={() => setMostrarLista(true)}
            />
            {mostrarLista && busca && (
              <div className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-y-auto">
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => selecionarProduto(p)}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {p.nome} — R$ {Number(p.preco).toFixed(2)}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-sm">Nenhum produto encontrado</div>
                )}
              </div>
            )}
          </div>

          {/* Quantidade + botão lado a lado no mobile */}
          <div className="flex gap-3 sm:gap-4 sm:items-end">
            <div className="w-24 shrink-0">
              <label className="block text-sm font-medium mb-1">Qtd</label>
              <Input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>

            <Button onClick={adicionarAoCarrinho} className="btn-verde flex-1 sm:flex-none mt-auto">
              Adicionar
            </Button>
          </div>
        </div>

        {/* Rodapé do carrinho */}
        {carrinho.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <span className="text-sm text-gray-600">
              {carrinho.length} produto(s) no carrinho
            </span>

            <Dialog open={modalAberto} onOpenChange={setModalAberto}>
              <DialogTrigger asChild>
                <Button className="btn-cinza w-full sm:w-auto">
                  Ver Carrinho ({carrinho.length})
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[95vw] max-w-2xl rounded-lg p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle>Carrinho de Vendas</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Itens */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {carrinho.map((item) => (
                      <div
                        key={item.produtoId}
                        className="flex flex-col gap-2 p-3 bg-gray-50 rounded sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <span className="font-medium">{item.nome}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {item.quantidade}x R$ {Number(item.preco).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="font-semibold">R$ {Number(item.subtotal).toFixed(2)}</span>
                          <Button
                            onClick={() => removerDoCarrinho(item.produtoId)}
                            variant="destructive"
                            size="sm"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total e registrar */}
                  <div className="border-t pt-4 space-y-3">

  {/* TOTAL BRUTO */}
  <div className="flex justify-between">
    <span>Total bruto:</span>
    <span className="font-semibold">
      R$ {calcularTotal().toFixed(2)}
    </span>
  </div>

  {/* TAXA */}
  <div className="flex justify-between text-red-500">
    <span>Taxa ({TAXAS[formaPagamento as keyof typeof TAXAS]}%):</span>
    <span>- R$ {calcularTaxa().toFixed(2)}</span>
  </div>

  {/* LÍQUIDO */}
  <div className="flex justify-between text-green-600 text-lg font-bold">
    <span>Você recebe:</span>
    <span>R$ {calcularLiquido().toFixed(2)}</span>
  </div>

  {/* FORMA DE PAGAMENTO */}
  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
    <span className="text-sm text-gray-600">
      Forma de pagamento
    </span>

    <select
      value={formaPagamento}
      onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
      className="border rounded py-2 px-3"
    >
      <option value="pix">PIX</option>
      <option value="dinheiro">Dinheiro</option>
      <option value="debito">Débito</option>
      <option value="credito">Crédito</option>
    </select>
  </div>

  {/* BOTÃO */}
  <Button
    onClick={registrarVendas}
    className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
  >
    Finalizar Venda
  </Button>
</div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}