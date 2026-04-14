/* eslint-disable @typescript-eslint/no-explicit-any */
export function EstoqueBaixo({ data }: any) {
  return (
    <div className="bg-card p-5 rounded-lg shadow">
      <h2 className="font-semibold mb-4 text-red-600">
        ⚠️ Estoque baixo
      </h2>

      {/* 🔥 Container com scroll */}
      <div className="max-h-64 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">

        {data?.length === 0 && (
          <p className="text-sm text-gray-500">
            Tudo certo no estoque ✅
          </p>
        )}

        {data?.map((item: any) => (
          <div
            key={item.id}
            className={`flex justify-between items-center p-2 rounded ${
  item.estoque <= 0
    ? "bg-red-200"
    : item.estoque <= 2
    ? "bg-red-100"
    : "bg-red-50"
}`}
          >
            <span className="truncate capitalize">{item.nome}</span>

            <span className="font-bold text-red-600">
              {item.estoque}
            </span>
          </div>
        ))}

      </div>
    </div>
  )
}