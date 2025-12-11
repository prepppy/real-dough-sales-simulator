import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Store } from '../types';
import { Search } from 'lucide-react';
import { calculateRoyalty } from '../utils/financials';
import { PageHeader } from './common/PageHeader';

export const RetailerTable: React.FC = () => {
  const { filteredStores, formatCurrency, getRetailerChannel, products } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');

  const tableData = filteredStores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRowMetrics = (store: Store) => {
     const avgWholesale = products.reduce((acc, p) => acc + p.wholesalePrice, 0) / products.length;
     const channel = getRetailerChannel(store.retailerId);
     const royalty = calculateRoyalty(avgWholesale, channel === 'DSD' ? 'DSD' : 'Warehouse');
     
     const unitsPerWeek = store.baseVelocity;
     const annualUnits = unitsPerWeek * 52;
     const estAnnualRevenue = annualUnits * avgWholesale;
     const qtdRoyalty = (unitsPerWeek * 13) * royalty.total;

     return {
         asp: avgWholesale,
         royaltyPerUnit: royalty.total,
         estAnnualRevenue,
         qtdRoyalty
     };
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 flex flex-col h-full">
        <PageHeader 
            number="09" 
            title="Store Data" 
            subtitle="Granular performance by location" 
            action={
                <div className="relative w-80">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search stores or states..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 text-sm font-bold border-2 border-slate-200 rounded-xl outline-none focus:border-black transition-colors"
                    />
                </div>
            }
        />
        
        {/* Summary Grid */}
        <div className="grid grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border-3 border-black shadow-sm">
                <p className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-2">TOTAL STORES</p>
                <p className="text-4xl font-black font-display text-slate-900">{filteredStores.length}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border-3 border-black shadow-sm">
                <p className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-2">AVG VELOCITY</p>
                <p className="text-4xl font-black font-display text-slate-900">
                    {(filteredStores.reduce((a, s) => a + s.baseVelocity, 0) / (filteredStores.length || 1)).toFixed(1)}
                </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border-3 border-rd-primary shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-rd-primary"></div>
                <p className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-2">DSD COUNT</p>
                <p className="text-4xl font-black font-display text-rd-primary">
                    {filteredStores.filter(s => getRetailerChannel(s.retailerId) === 'DSD').length}
                </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border-3 border-rd-blue shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-rd-blue"></div>
                <p className="text-xs uppercase text-slate-400 font-bold tracking-widest mb-2">WAREHOUSE</p>
                <p className="text-4xl font-black font-display text-rd-blue">
                    {filteredStores.filter(s => getRetailerChannel(s.retailerId) !== 'DSD').length}
                </p>
            </div>
        </div>

        <div className="flex-1 overflow-hidden bg-white rounded-[24px] border-3 border-black shadow-sm flex flex-col">
            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="p-5">Store Name</th>
                            <th className="p-5">Channel</th>
                            <th className="p-5">State</th>
                            <th className="p-5 text-right">Velocity</th>
                            <th className="p-5 text-right">Avg ASP</th>
                            <th className="p-5 text-right">Royalty/Unit</th>
                            <th className="p-5 text-right">QTD Royalty</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tableData.slice(0, 100).map(store => {
                            const channel = getRetailerChannel(store.retailerId);
                            const metrics = getRowMetrics(store);
                            return (
                                <tr key={store.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-5 font-bold text-slate-900">{store.name}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${channel === 'DSD' ? 'bg-rd-primary/10 text-rd-primary' : 'bg-rd-blue/10 text-rd-blue'}`}>
                                            {channel}
                                        </span>
                                    </td>
                                    <td className="p-5 text-slate-500 font-medium">{store.state}</td>
                                    <td className="p-5 text-right font-black text-slate-900 text-lg">{store.baseVelocity.toFixed(1)}</td>
                                    <td className="p-5 text-right text-slate-600 font-mono font-bold">${metrics.asp.toFixed(2)}</td>
                                    <td className="p-5 text-right text-slate-600 font-mono font-bold">${metrics.royaltyPerUnit.toFixed(2)}</td>
                                    <td className="p-5 text-right font-black text-rd-green text-lg">
                                        {formatCurrency(metrics.qtdRoyalty)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {tableData.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-bold">No stores found matching your filters.</div>
                )}
            </div>
        </div>
    </div>
  );
};
