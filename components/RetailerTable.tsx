import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Store } from '../types';
import { Search, Filter } from 'lucide-react';
import { calculateRoyalty } from '../utils/financials'; // ISSUE 7: Import Royalty Logic

export const RetailerTable: React.FC = () => {
  const { filteredStores, updateStore, formatCurrency, getRetailerChannel, products } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState<number>(0);

  const handleEditClick = (store: Store) => {
    setEditId(store.id);
    setEditVal(store.currentSkuCount);
  };

  const handleSave = (storeId: string) => {
    updateStore(storeId, { currentSkuCount: editVal });
    setEditId(null);
  };

  const tableData = filteredStores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ISSUE 7: Update columns to be Real Dough specific
  const getRowMetrics = (store: Store) => {
     // Use average Real Dough product price/royalty for now (in real app, specific SKUs)
     const avgWholesale = products.reduce((acc, p) => acc + p.wholesalePrice, 0) / products.length;
     const channel = getRetailerChannel(store.retailerId);
     const royalty = calculateRoyalty(avgWholesale, channel === 'DSD' ? 'DSD' : 'Warehouse');
     
     const unitsPerWeek = store.baseVelocity; // Real Dough units/week
     const annualUnits = unitsPerWeek * 52;
     const estAnnualRevenue = annualUnits * avgWholesale;
     const qtdRoyalty = (unitsPerWeek * 13) * royalty.total; // QTD approx (13 weeks)

     return {
         asp: avgWholesale,
         royaltyPerUnit: royalty.total,
         estAnnualRevenue,
         qtdRoyalty
     };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-stone-50">
            <div>
                {/* ISSUE 7: Renamed to Store Performance */}
                <h3 className="font-bold text-slate-800">Store Performance</h3>
                <p className="text-xs text-slate-500">Real Dough stores by performance</p>
            </div>
            
            <div className="flex space-x-3">
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text"
                        placeholder="Search stores, states..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-red-500"
                    />
                </div>
            </div>
        </div>
        
        {/* ISSUE 7: Added Summary Cards */}
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-100 bg-white">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] uppercase text-slate-400 font-bold">Total Stores</p>
                <p className="text-lg font-bold text-slate-800">{filteredStores.length}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] uppercase text-slate-400 font-bold">Avg Velocity</p>
                <p className="text-lg font-bold text-slate-800">
                    {(filteredStores.reduce((a, s) => a + s.baseVelocity, 0) / (filteredStores.length || 1)).toFixed(1)}
                </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] uppercase text-slate-400 font-bold">DSD Stores</p>
                <p className="text-lg font-bold text-rose-600">
                    {filteredStores.filter(s => getRetailerChannel(s.retailerId) === 'DSD').length}
                </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] uppercase text-slate-400 font-bold">Warehouse Stores</p>
                <p className="text-lg font-bold text-blue-600">
                    {filteredStores.filter(s => getRetailerChannel(s.retailerId) !== 'DSD').length}
                </p>
            </div>
        </div>

        <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-100 text-slate-600 sticky top-0 z-10">
                    <tr>
                        <th className="p-3 font-semibold">Store Name</th>
                        <th className="p-3 font-semibold">Channel</th>
                        <th className="p-3 font-semibold">State</th>
                        <th className="p-3 font-semibold text-right">Velocity</th>
                        {/* ISSUE 7: Updated Columns */}
                        <th className="p-3 font-semibold text-right">Avg ASP</th>
                        <th className="p-3 font-semibold text-right">Royalty/Unit</th>
                        <th className="p-3 font-semibold text-right">QTD Royalty</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {tableData.slice(0, 100).map(store => {
                        const channel = getRetailerChannel(store.retailerId);
                        const metrics = getRowMetrics(store);
                        return (
                            <tr key={store.id} className="hover:bg-stone-50 transition-colors">
                                <td className="p-3 font-medium text-slate-800">{store.name}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${channel === 'DSD' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                        {channel}
                                    </span>
                                </td>
                                <td className="p-3 text-slate-500">{store.state}</td>
                                <td className="p-3 text-right font-bold text-slate-700">{store.baseVelocity.toFixed(1)}</td>
                                {/* ISSUE 7: New Data Cells */}
                                <td className="p-3 text-right text-slate-600 font-mono">${metrics.asp.toFixed(2)}</td>
                                <td className="p-3 text-right text-slate-600 font-mono">${metrics.royaltyPerUnit.toFixed(2)}</td>
                                <td className="p-3 text-right font-bold text-emerald-600">
                                    {formatCurrency(metrics.qtdRoyalty)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {tableData.length === 0 && (
                <div className="p-8 text-center text-slate-400">No stores found matching your filters.</div>
            )}
        </div>
    </div>
  );
};
