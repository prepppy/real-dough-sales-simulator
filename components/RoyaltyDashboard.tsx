import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PageHeader } from './common/PageHeader';

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
    <div className="space-y-12 animate-fade-in pb-12">
        <PageHeader 
            number="02" 
            title="Royalty Dashboard" 
            subtitle="Real-time ASP-based payment calculation" 
        />

        {/* Channel Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DSD Card */}
            <div className="bg-white p-8 rounded-[24px] border-3 border-rd-primary relative overflow-hidden flex flex-col h-full shadow-lg shadow-rd-primary/5">
                <div className="flex justify-between items-center mb-8">
                    <span className="bg-rd-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">DSD Channel</span>
                    <span className="text-sm font-bold text-slate-400">Target, Regional</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Units</p>
                        <p className="text-3xl font-black font-display text-slate-900">{dsdData.units.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Weighted ASP</p>
                        <p className="text-3xl font-black font-display text-slate-900">${dsdData.weightedASP.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl space-y-3 mb-auto">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Base Royalty</span>
                        <span className="font-mono text-slate-900">${dsdData.baseRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Additional (ASP Based)</span>
                        <span className="font-mono text-slate-900">${dsdData.addlRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-200 font-bold text-base">
                        <span className="text-slate-900">Total Rate / Unit</span>
                        <span className="font-mono text-rd-primary">${dsdData.totalRate.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t-2 border-slate-100 flex justify-between items-end">
                    <span className="font-bold text-slate-400 uppercase text-sm tracking-wider">DSD Total</span>
                    <span className="text-4xl font-black font-display text-rd-primary">{formatCurrency(dsdData.totalRoyalty)}</span>
                </div>
            </div>

            {/* Warehouse Card */}
            <div className="bg-white p-8 rounded-[24px] border-3 border-rd-blue relative overflow-hidden flex flex-col h-full shadow-lg shadow-rd-blue/5">
                <div className="flex justify-between items-center mb-8">
                    <span className="bg-rd-blue text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Warehouse Channel</span>
                    <span className="text-sm font-bold text-slate-400">Walmart, Costco</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Units</p>
                        <p className="text-3xl font-black font-display text-slate-900">{warehouseData.units.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Weighted ASP</p>
                        <p className="text-3xl font-black font-display text-slate-900">${warehouseData.weightedASP.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl space-y-3 mb-auto">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Base Royalty</span>
                        <span className="font-mono text-slate-900">${warehouseData.baseRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Additional (ASP Based)</span>
                        <span className="font-mono text-slate-900">${warehouseData.addlRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-200 font-bold text-base">
                        <span className="text-slate-900">Total Rate / Unit</span>
                        <span className="font-mono text-rd-blue">${warehouseData.totalRate.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t-2 border-slate-100 flex justify-between items-end">
                    <span className="font-bold text-slate-400 uppercase text-sm tracking-wider">Warehouse Total</span>
                    <span className="text-4xl font-black font-display text-rd-blue">{formatCurrency(warehouseData.totalRoyalty)}</span>
                </div>
            </div>
        </div>

        {/* Grand Total - Massive */}
        <div className="bg-bg-dark rounded-[24px] p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                <div>
                    <span className="text-rd-green font-bold uppercase tracking-widest text-sm mb-2 block">Q2 2025 Total Royalty</span>
                    <div className="flex items-baseline text-white">
                        <span className="text-4xl font-bold opacity-50 mr-2">$</span>
                        <span className="text-8xl md:text-9xl font-black font-display tracking-tighter leading-none">{totalRoyalty.toLocaleString()}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-xl border border-white/10">
                        <p className="text-white font-bold text-lg mb-1">💳 Payment Due: July 15, 2025</p>
                        <p className="text-white/60 text-sm font-mono">Wire Transfer to Account ***6789</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Table & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border-3 border-black">
                <h3 className="text-2xl font-bold text-slate-900 font-display mb-8">Royalty Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-4 rounded-l-lg">Retailer</th>
                                <th className="p-4">Channel</th>
                                <th className="p-4 text-right">Units</th>
                                <th className="p-4 text-right">ASP</th>
                                <th className="p-4 text-right">Rate</th>
                                <th className="p-4 text-right rounded-r-lg">Total Royalty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {retailerRoyalties.map((r) => (
                                <tr key={r.name} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4 font-bold text-slate-900 group-hover:text-rd-primary transition-colors">{r.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${r.channel === 'DSD' ? 'bg-rd-primary/10 text-rd-primary' : 'bg-rd-blue/10 text-rd-blue'}`}>
                                            {r.channel}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">{r.units.toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">${r.asp.toFixed(2)}</td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">${r.rate.toFixed(2)}</td>
                                    <td className="p-4 text-right font-bold text-rd-green">{formatCurrency(r.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[24px] border-3 border-black flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 font-display mb-2">ASP Volume</h3>
                <p className="text-sm text-slate-500 mb-8">Distribution across price tiers</p>
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aspDistData} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                            <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="range" 
                                type="category" 
                                width={80} 
                                tick={{fontSize: 11, fill: '#64748b', fontWeight: 600}} 
                                axisLine={false} 
                                tickLine={false} 
                            />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#000', color: '#fff'}}
                                itemStyle={{color: '#fff'}}
                            />
                            <Bar dataKey="volume" radius={[0, 6, 6, 0]} barSize={32}>
                                {aspDistData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index > 3 ? '#E53935' : '#0066FF'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 text-center bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Highest Volume Tier</p>
                    <p className="text-lg font-bold text-slate-900">$9.26 - $9.50 ASP</p>
                </div>
            </div>
        </div>
    </div>
  );
};
