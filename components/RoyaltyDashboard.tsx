import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { DollarSign, Activity, TrendingUp } from 'lucide-react';

export const RoyaltyDashboard: React.FC = () => {
  const { formatCurrency } = useSimulation();

  // Seed Data for Royalty Dashboard (Based on Spec)
  const dsdData = {
    units: 89250,
    weightedASP: 9.32,
    baseRate: 0.50,
    addlRate: 0.50,
    totalRate: 1.00,
    totalRoyalty: 89250
  };

  const warehouseData = {
    units: 53250,
    weightedASP: 8.29,
    baseRate: 0.50,
    addlRate: 0.78,
    totalRate: 1.28,
    totalRoyalty: 68160
  };

  const totalRoyalty = dsdData.totalRoyalty + warehouseData.totalRoyalty;

  const retailerRoyalties = [
    { name: 'Target', channel: 'DSD', units: 42500, asp: 9.45, rate: 1.00, total: 42500 },
    { name: 'Walmart', channel: 'Warehouse', units: 48000, asp: 8.33, rate: 1.31, total: 62880 },
    { name: 'Publix', channel: 'DSD', units: 18750, asp: 9.38, rate: 1.00, total: 18750 },
    { name: 'Kroger', channel: 'DSD', units: 15000, asp: 9.22, rate: 0.95, total: 14250 },
    { name: 'Costco', channel: 'Warehouse', units: 5250, asp: 8.05, rate: 1.00, total: 5250 },
    { name: 'Regional', channel: 'DSD', units: 13000, asp: 9.18, rate: 0.93, total: 12090 },
  ];

  // ASP Distribution Mock Data
  const aspDistData = [
    { range: '$8.00-8.25', volume: 5000 },
    { range: '$8.26-8.50', volume: 48000 },
    { range: '$8.51-9.00', volume: 2000 },
    { range: '$9.01-9.25', volume: 28000 },
    { range: '$9.26-9.50', volume: 59500 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Royalty Dashboard</h2>
                <p className="text-slate-500 mt-1">Q2 2025 Performance & Payment Calculator</p>
            </div>
            <div className="text-right bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Estimated Q2 Payment</span>
                <span className="text-2xl font-bold text-emerald-700">{formatCurrency(totalRoyalty)}</span>
                <span className="text-[10px] text-emerald-500 block mt-1">Due July 15, 2025</span>
            </div>
        </div>

        {/* Channel Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DSD Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">DSD Channel</h3>
                    <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2 py-1 rounded">Target, Regional</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Total Units</p>
                        <p className="text-xl font-bold text-slate-700">{dsdData.units.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Weighted ASP</p>
                        <p className="text-xl font-bold text-slate-700">${dsdData.weightedASP.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Base Royalty</span>
                        <span className="font-mono font-medium">${dsdData.baseRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Additional (ASP Based)</span>
                        <span className="font-mono font-medium">${dsdData.addlRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-800">
                        <span>Total Rate / Unit</span>
                        <span className="font-mono">${dsdData.totalRate.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-600">Total DSD Royalty</span>
                    <span className="text-2xl font-bold text-rose-600">{formatCurrency(dsdData.totalRoyalty)}</span>
                </div>
            </div>

            {/* Warehouse Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Warehouse Channel</h3>
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">Walmart, Costco</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Total Units</p>
                        <p className="text-xl font-bold text-slate-700">{warehouseData.units.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Weighted ASP</p>
                        <p className="text-xl font-bold text-slate-700">${warehouseData.weightedASP.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Base Royalty</span>
                        <span className="font-mono font-medium">${warehouseData.baseRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Additional (ASP Based)</span>
                        <span className="font-mono font-medium">${warehouseData.addlRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-800">
                        <span>Total Rate / Unit</span>
                        <span className="font-mono">${warehouseData.totalRate.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-600">Total Warehouse Royalty</span>
                    <span className="text-2xl font-bold text-blue-600">{formatCurrency(warehouseData.totalRoyalty)}</span>
                </div>
            </div>
        </div>

        {/* Detailed Table & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-6">Royalty Breakdown by Retailer</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                            <tr>
                                <th className="p-3 rounded-l-lg">Retailer</th>
                                <th className="p-3">Channel</th>
                                <th className="p-3 text-right">Units</th>
                                <th className="p-3 text-right">ASP</th>
                                <th className="p-3 text-right">Rate</th>
                                <th className="p-3 text-right rounded-r-lg">Total Royalty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {retailerRoyalties.map((r) => (
                                <tr key={r.name} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-3 font-bold text-slate-700">{r.name}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${r.channel === 'DSD' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>
                                            {r.channel}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-600">{r.units.toLocaleString()}</td>
                                    <td className="p-3 text-right font-mono text-slate-600">${r.asp.toFixed(2)}</td>
                                    <td className="p-3 text-right font-mono text-slate-600">${r.rate.toFixed(2)}</td>
                                    <td className="p-3 text-right font-bold text-emerald-600">{formatCurrency(r.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-2">ASP Volume Distribution</h3>
                <p className="text-xs text-slate-400 mb-6">Volume across price tiers</p>
                <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aspDistData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="range" type="category" width={70} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                            />
                            <Bar dataKey="volume" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                                {aspDistData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index > 2 ? '#e11d48' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-400">High Volume Zone</p>
                    <p className="font-bold text-slate-700">$9.26 - $9.50 ASP</p>
                </div>
            </div>
        </div>
    </div>
  );
};

