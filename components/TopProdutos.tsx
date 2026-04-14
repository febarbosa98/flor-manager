/* eslint-disable @typescript-eslint/no-explicit-any */
export function TopProdutos({ data }: any) {
  return (
    <div className="bg-card p-5 rounded-lg shadow">
      <h2 className="font-semibold mb-4">🔥 Produtos mais vendidos</h2>

      <div className="space-y-2">
        {data?.map((item: any, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center bg-muted p-2 rounded"
          >
            <span className="capitalize">{item.nome}</span>
            <span className="font-bold">{item.quantidade}</span>
          </div>
        ))}
      </div>
    </div>
  )
}