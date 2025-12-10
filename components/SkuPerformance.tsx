import React from 'react';
import { Package, TrendingUp, DollarSign, Tag } from 'lucide-react';

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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">SKU Performance</h2>
          <p className="text-slate-500">Product Ranking by Volume & Royalty Contribution</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Total SKUs:</span> 5 Active
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs">Product Name</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs text-right">Units Sold</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs text-right">Avg Price (ASP)</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs text-right">Velocity (U/S/W)</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs text-right">Royalty / Unit</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs text-right">Total Royalty</th>
                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-xs text-right">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SKU_DATA.map((sku, index) => (
                <tr key={sku.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                            <Package size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">{sku.name}</div>
                            <div className="text-xs text-slate-500">{sku.shareOfMix}% of Total Volume</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-slate-700">{sku.units.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-slate-700">${sku.asp.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                        {sku.velocity.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-slate-600">${sku.royaltyPerUnit.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-emerald-700">${sku.royaltyTotal.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`font-bold text-xs ${sku.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
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
