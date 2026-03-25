/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { listarProdutos } from "@/lib/produtos";
import { criarVendas } from "@/lib/vendas";
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

export default function VendaForm({ reload }: any) {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState("")
const [produtosFiltrados, setProdutosFiltrados] = useState<any[]>([])
const [mostrarLista, setMostrarLista] = useState(false)





  useEffect(() => {
    async function carregar() {
      const data = await listarProdutos();
      setProdutos(data);
    }
    carregar();
  }, []);

  const adicionarAoCarrinho = () => {
    if (!produtoId) {
      toast.error("Selecione um produto");
      return;
    }

    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;

    const subtotal = produto.preco * quantidade;

    // Verificar se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.produtoId === produtoId);

    if (itemExistente) {
      // Atualizar quantidade do item existente
      setCarrinho(carrinho.map(item =>
        item.produtoId === produtoId
          ? { ...item, quantidade: item.quantidade + quantidade, subtotal: item.subtotal + subtotal }
          : item
      ));
    } else {
      // Adicionar novo item
      setCarrinho([...carrinho, {
        produtoId,
        nome: produto.nome,
        preco: produto.preco,
        quantidade,
        subtotal
      }]);
    }

    // Limpar seleção
    setProdutoId("");
    setQuantidade(1);
    setBusca("")
    toast.success("Produto adicionado ao carrinho");
  };

  const removerDoCarrinho = (produtoId: string) => {
    setCarrinho(carrinho.filter(item => item.produtoId !== produtoId));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.subtotal, 0);
  };

  const registrarVendas = async () => {
    if (carrinho.length === 0) {
      toast.error("Adicione produtos ao carrinho");
      return;
    }

    try {
      const vendas = carrinho.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade
      }));

      await criarVendas(vendas);

      toast.success("Vendas registradas com sucesso!");
      setCarrinho([]);
      setModalAberto(false);
      reload();
    } catch (error) {
      console.error("Erro ao registrar vendas:", error);
      toast.error("Erro ao registrar vendas");
    }
  };

  useEffect(() => {
  const termo = busca.toLowerCase()

  const filtrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(termo)
  )

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setProdutosFiltrados(filtrados)
}, [busca, produtos])
function selecionarProduto(produto: any) {
  setProdutoId(produto.id)
  setBusca(produto.nome)
  setMostrarLista(false)
}

  return (
    <div className="space-y-6">
      {/* Formulário para adicionar produtos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg text-secondary font-semibold mb-4">Adicionar Produto à Venda</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <div className="flex-1 relative">
  <label className="block text-sm font-medium mb-1">Produto</label>

  <Input
    placeholder="Buscar produto..."
    value={busca}
    onChange={(e) => {
      setBusca(e.target.value)
      setMostrarLista(true)
    }}
    onFocus={() => setMostrarLista(true)}
  />

  {mostrarLista && busca && (
    <div className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-y-auto">
      {produtosFiltrados.length > 0 ? (
        produtosFiltrados.map((p) => (
          <div
            key={p.id}
            onClick={() => selecionarProduto(p)}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {p.nome} - R$ {Number(p.preco).toFixed(2)}
          </div>
        ))
      ) : (
        <div className="p-2 text-gray-500">
          Nenhum produto encontrado
        </div>
      )}
    </div>
  )}
</div>
          </div>

          <div className="w-24">
            <label className="block text-sm font-medium mb-1">Qtd</label>
            <Input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
            />
          </div>

          <Button onClick={adicionarAoCarrinho} className="btn-verde">
            Adicionar
          </Button>
        </div>
        {/* Botão para abrir modal do carrinho */}
        {carrinho.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {carrinho.length} produto(s) no carrinho
            </span>
            <Dialog open={modalAberto} onOpenChange={setModalAberto}>
              <DialogTrigger asChild>
                <Button className="btn-cinza">
                  Ver Carrinho ({carrinho.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Carrinho de Vendas</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Itens do carrinho */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {carrinho.map((item) => (
                      <div key={item.produtoId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{item.nome}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            {item.quantidade}x R$ {Number(item.preco).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
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

                  {/* Total e botão de registrar */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total da Venda:</span>
                      <span className="text-2xl font-bold text-green-600">
                        R$ {Number(calcularTotal()).toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={registrarVendas}
                      className="w-full bg-primary cursor-pointer hover:bg-green-500 text-white py-3 text-lg"
                    >
                      Registrar Venda (R$ {Number(calcularTotal()).toFixed(2)})
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
