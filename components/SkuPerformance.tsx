import React from 'react';
import { Package } from 'lucide-react';
import { PageHeader } from './common/PageHeader';

interface SkuData {
  id: string;
  name: string;
  units: number;
  asp: number;
  velocity: number;
  royaltyTotal: number;
  royaltyPerUnit: number;
  growth: number;
  shareOfMix: number;
}

const SKU_DATA: SkuData[] = [
  {
    id: 'rd_001',
    name: 'Wisco Kid (Pepperoni)',
    units: 38250,
    asp: 9.35,
    velocity: 3.5,
    royaltyTotal: 39015,
    royaltyPerUnit: 1.02,
    growth: 12.5,
    shareOfMix: 30.5
  },
  {
    id: 'rd_002',
    name: 'Peppin\' Ain\'t Easy (Double Pep)',
    units: 29750,
    asp: 9.42,
    velocity: 2.8,
    royaltyTotal: 29750,
    royaltyPerUnit: 1.00,
    growth: 15.2,
    shareOfMix: 23.8
  },
  {
    id: 'rd_003',
    name: 'Lost in the Sausage',
    units: 24500,
    asp: 9.28,
    velocity: 2.3,
    royaltyTotal: 24255,
    royaltyPerUnit: 0.99,
    growth: 8.4,
    shareOfMix: 19.6
  },
  {
    id: 'rd_004',
    name: 'Curd Your Enthusiasm (Cheese)',
    units: 18200,
    asp: 8.95,
    velocity: 1.9,
    royaltyTotal: 16380,
    royaltyPerUnit: 0.90,
    growth: 4.2,
    shareOfMix: 14.5
  },
  {
    id: 'rd_005',
    name: 'Okie Dokie Artichokie (Veggie)',
    units: 14500,
    asp: 10.50,
    velocity: 1.5,
    royaltyTotal: 15950,
    royaltyPerUnit: 1.10,
    growth: 22.1,
    shareOfMix: 11.6
  }
];

export const SkuPerformance: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader 
        number="05" 
        title="SKU Performance" 
        subtitle="Product Ranking by Volume & Royalty" 
        action={
            <div className="bg-white px-4 py-2 rounded-xl border-2 border-slate-200 shadow-sm text-sm text-slate-600 font-bold">
              5 Active SKUs
            </div>
        }
      />

      <div className="bg-white rounded-[24px] shadow-sm border-3 border-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b-2 border-slate-100">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-xs">Product Name</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-xs text-right">Units Sold</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-xs text-right">Avg Price (ASP)</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-xs text-right">Velocity</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-xs text-right">Royalty / Unit</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-xs text-right">Total Royalty</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-xs text-right">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SKU_DATA.map((sku, index) => (
                <tr key={sku.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                        <div className="bg-slate-100 p-3 rounded-xl text-slate-400 group-hover:bg-rd-primary group-hover:text-white transition-colors">
                            <Package size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-base">{sku.name}</div>
                            <div className="text-xs font-bold text-slate-400 mt-0.5">{sku.shareOfMix}% of Mix</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="font-black text-slate-800 text-lg">{sku.units.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="font-mono font-bold text-slate-600">${sku.asp.toFixed(2)}</div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-rd-blue/10 text-rd-blue">
                        {sku.velocity.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="font-mono font-bold text-slate-600">${sku.royaltyPerUnit.toFixed(2)}</div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="font-black text-rd-green text-lg">${sku.royaltyTotal.toLocaleString()}</div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className={`font-bold text-sm ${sku.growth >= 0 ? 'text-rd-green' : 'text-rd-primary'}`}>
                        {sku.growth >= 0 ? '+' : ''}{sku.growth}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
