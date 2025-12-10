
import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Store } from '../types';
import { Search } from 'lucide-react';

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

  const getEstRev = (store: Store) => {
     const avgPrice = products.reduce((acc, p) => acc + p.wholesalePrice, 0) / products.length;
     return store.baseVelocity * store.currentSkuCount * avgPrice * 52;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-stone-50">
            <h3 className="font-bold text-slate-800">Account Detail List</h3>
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 text-slate-400" size={16} />
                <input 
                    type="text"
                    placeholder="Search accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-red-500"
                />
            </div>
        </div>
        <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-sm text-left">
                <thead className="bg-stone-100 text-slate-600 sticky top-0 z-10">
                    <tr>
                        <th className="p-3 font-semibold">Store Name</th>
                        <th className="p-3 font-semibold">Channel</th>
                        <th className="p-3 font-semibold">State</th>
                        <th className="p-3 font-semibold">SKU Count</th>
                        <th className="p-3 font-semibold text-right">Velocity</th>
                        <th className="p-3 font-semibold text-right">Annual Wholesale</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {tableData.slice(0, 100).map(store => {
                        const channel = getRetailerChannel(store.retailerId);
                        return (
                            <tr key={store.id} className="hover:bg-stone-50 transition-colors">
                                <td className="p-3 font-medium text-slate-800">{store.name}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${channel === 'DSD' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                        {channel}
                                    </span>
                                </td>
                                <td className="p-3 text-slate-500">{store.state}</td>
                                <td className="p-3">
                                    {editId === store.id ? (
                                        <div className="flex items-center space-x-2">
                                            <input 
                                                type="number" 
                                                className="w-16 border rounded p-1"
                                                value={editVal}
                                                onChange={(e) => setEditVal(Number(e.target.value))}
                                            />
                                            <button onClick={() => handleSave(store.id)} className="text-green-600 text-xs font-bold">OK</button>
                                        </div>
                                    ) : (
                                        <span 
                                            onClick={() => handleEditClick(store)}
                                            className="cursor-pointer border-b border-dashed border-slate-300 hover:text-red-600 hover:border-red-600"
                                            title="Click to Edit"
                                        >
                                            {store.currentSkuCount}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 text-right text-slate-600">{store.baseVelocity.toFixed(1)}</td>
                                <td className="p-3 text-right font-mono text-slate-700">
                                    {formatCurrency(getEstRev(store))}
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
