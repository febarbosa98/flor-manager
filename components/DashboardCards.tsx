/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatarMoeda } from "@/lib/formatarMoeda";

export default function Dashboard({ stats }: any) {
  

  if (!stats) return null;

  return (
    <div className="flex flex-wrap  gap-5 mb-6">
      <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card">
        <h2 className="text-sm text-gray-500">Vendas hoje</h2>
        <div className="flex gap-2 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide bg-blue-400 rounded-3xl p-1 lucide-move-up-right-icon lucide-move-up-right"
          >
            <path d="M13 5H19V11" />
            <path d="M19 5L5 19" />
          </svg>
          <p className="text-2xl font-bold">
            {" "}
            {formatarMoeda(stats.vendasHoje)}
          </p>
        </div>
      </div>

       <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card">
        <h2 className="text-sm text-gray-500">Vendas liquida hoje</h2>


        <div className="flex gap-2 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide bg-green-400 rounded-3xl p-1 lucide-move-up-right-icon lucide-move-up-right"
          >
            <path d="M13 5H19V11" />
            <path d="M19 5L5 19" />
          </svg>
          <p className="text-2xl font-bold">{formatarMoeda(stats.valorLiquidoHoje)}</p>
        </div>
      </div>

      <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card ">
        <h2 className="text-sm text-gray-500">Vendas do mês</h2>
        <div className="flex gap-2 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide bg-blue-400 rounded-3xl p-1 lucide-badge-dollar-sign-icon lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
          <p className="text-2xl font-bold">{formatarMoeda(stats.vendasMes)}</p>
        </div>
      </div>

       <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card">
        <h2 className="text-sm text-gray-500">Valor líquido do mês</h2>

        <div className="flex gap-2 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide bg-green-400 rounded-3xl p-1 lucide-badge-dollar-sign-icon lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0_1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0_4h4a2 2_0_1_1_0_4H8"/><path d="M12_18V6"/></svg>
          <p className="text-2xl font-bold">{formatarMoeda(stats.valorLiquidoMes)}</p>
        </div>
      </div>

      <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card">
        <h2 className="text-sm text-gray-500">Lucro do mês</h2>

        <div className="flex gap-2 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide bg-green-400 rounded-3xl p-1 lucide-badge-dollar-sign-icon lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
          <p className="text-2xl font-bold">{formatarMoeda(stats.lucroMes)}</p>
        </div>
      </div>

      <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card">
        <h2 className="text-sm text-gray-500">Produtos vendidos</h2>
        <div className="flex gap-2 mt-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="bg-blue-400 rounded-3xl p-1 lucide lucide-shopping-basket-icon lucide-shopping-basket"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/></svg>
          <p className="text-2xl font-bold">{stats.produtosVendidos}</p>
        </div>
      </div>
       
      <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card">
        <h2 className="text-sm text-gray-500">Taxas do mês</h2>

        <div className="flex gap-2 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide bg-red-600 rounded-3xl p-1 lucide-badge-dollar-sign-icon lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0_1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0_4h4a2 2_0_1_1_0_4H8"/><path d="M12_18V6"/></svg>
          <p className="text-2xl font-bold text-red-600">{formatarMoeda(stats.taxasMes)}</p>
        </div>
      </div>

      <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card">
        <h2 className="text-sm text-gray-500">Gastos do mês</h2>
        <div className="flex gap-2 mt-2">
         <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="bg-red-600 rounded-3xl p-1 lucide lucide-move-down-icon lucide-move-down"><path d="M8 18L12 22L16 18"/><path d="M12 2V22"/></svg>
          <p className="text-2xl font-bold text-red-600">
            {formatarMoeda(stats.gastosMes)}
          </p>
        </div>
      </div>

      <div className="p-6 border rounded-lg flex-auto text-center justify-items-center  bg-card">
        <h2 className="text-sm text-gray-500">Perdas do mês</h2>
        <div className="flex gap-2 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="bg-yellow-600 rounded-3xl p-1 lucide lucide-move-down-right-icon lucide-move-down-right"><path d="M19 13V19H13"/><path d="M5 5L19 19"/></svg>
          <p className="text-2xl font-bold text-yellow-600">
            {formatarMoeda(stats.perdasMes)}
          </p>
        </div>
      </div>
    </div>
  );
}
