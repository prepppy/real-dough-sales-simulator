import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Cell } from 'recharts';
import { PageHeader } from './common/PageHeader';
import { Tooltip } from './common/Tooltip';

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

  // Q2 2026 Actuals - Expanded DSD breakdown
  // DSD Total: 89,250 units | Warehouse Total: 53,250 units
  const retailerRoyalties = [
    // DSD Retailers (Total: 89,250 units, $88,637 royalty)
    { name: 'Target', channel: 'DSD', units: 45680, asp: 9.45, rate: 1.00, total: 45680, stores: 147 },
    { name: 'Cub Foods', channel: 'DSD', units: 15220, asp: 9.28, rate: 0.99, total: 15068, stores: 62 },
    { name: 'Festival Foods', channel: 'DSD', units: 8950, asp: 9.18, rate: 0.98, total: 8771, stores: 35 },
    { name: "Pick 'n Save", channel: 'DSD', units: 7840, asp: 9.35, rate: 1.00, total: 7840, stores: 48 },
    { name: "Woodman's", channel: 'DSD', units: 6420, asp: 9.22, rate: 0.98, total: 6292, stores: 18 },
    { name: 'Jewel-Osco', channel: 'DSD', units: 5140, asp: 9.15, rate: 0.97, total: 4986, stores: 42 },
    // Warehouse Retailer (Total: 53,250 units, $68,160 royalty)
    { name: 'Walmart', channel: 'Warehouse', units: 53250, asp: 8.29, rate: 1.28, total: 68160, stores: 745 },
    // Publix - Launching Q3 2026
    // Kroger - Launching Q4 2026
  ];

  // Channel totals for section headers
  const dsdRetailers = retailerRoyalties.filter(r => r.channel === 'DSD');
  const warehouseRetailers = retailerRoyalties.filter(r => r.channel === 'Warehouse');
  const dsdTotalUnits = dsdRetailers.reduce((sum, r) => sum + r.units, 0);
  const dsdTotalRoyalty = dsdRetailers.reduce((sum, r) => sum + r.total, 0);
  const warehouseTotalUnits = warehouseRetailers.reduce((sum, r) => sum + r.units, 0);
  const warehouseTotalRoyalty = warehouseRetailers.reduce((sum, r) => sum + r.total, 0);
  const grandTotalUnits = dsdTotalUnits + warehouseTotalUnits;
  const grandTotalRoyalty = dsdTotalRoyalty + warehouseTotalRoyalty;

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
                        <span className="text-slate-500 inline-flex items-center">
                            Base Royalty
                            <Tooltip content="Fixed $0.50 per unit payment guaranteed at all ASP levels. Minimum royalty floor." />
                        </span>
                        <span className="font-mono text-slate-900">${dsdData.baseRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500 inline-flex items-center">
                            Additional (ASP Based)
                            <Tooltip content="Variable royalty based on Average Selling Price. Higher prices = higher additional royalty. Ranges from $0.00 to $0.50 for DSD." />
                        </span>
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
                        <span className="text-slate-500 inline-flex items-center">
                            Base Royalty
                            <Tooltip content="Fixed $0.50 per unit payment guaranteed at all ASP levels. Minimum royalty floor." />
                        </span>
                        <span className="font-mono text-slate-900">${warehouseData.baseRate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500 inline-flex items-center">
                            Additional (ASP Based)
                            <Tooltip content="Variable royalty based on Average Selling Price. Higher prices = higher additional royalty. Ranges from $0.00 to $0.90 for Warehouse." />
                        </span>
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
                    <span className="text-rd-green font-bold uppercase tracking-widest text-sm mb-2 block">Q2 2026 Total Royalty</span>
                    <div className="flex items-baseline text-white">
                        <span className="text-4xl font-bold opacity-50 mr-2">$</span>
                        <span className="text-8xl md:text-9xl font-black font-display tracking-tighter leading-none">{totalRoyalty.toLocaleString()}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-xl border border-white/10">
                        <p className="text-white font-bold text-lg mb-1">💳 Payment Due: July 15, 2026</p>
                        <p className="text-white/60 text-sm font-mono">Wire Transfer to Account ***6789</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Table & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border-3 border-black">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 font-display">Royalty Breakdown</h3>
                        <p className="text-sm text-slate-500 mt-1">Q2 2026 by retailer and channel</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-4 rounded-l-lg">Retailer</th>
                                <th className="p-4">Channel</th>
                                <th className="p-4 text-right">Stores</th>
                                <th className="p-4 text-right">Units</th>
                                <th className="p-4 text-right">ASP</th>
                                <th className="p-4 text-right">Rate</th>
                                <th className="p-4 text-right rounded-r-lg">Total Royalty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* DSD Section Header */}
                            <tr className="bg-slate-50 border-y-2 border-slate-200">
                                <td colSpan={7} className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rd-primary/10 text-rd-primary border border-rd-primary/20">
                                            DSD Channel
                                        </span>
                                        <span className="text-sm font-semibold text-slate-500">
                                            {dsdTotalUnits.toLocaleString()} units • {formatCurrency(dsdTotalRoyalty)} royalty
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            
                            {/* DSD Retailers */}
                            {dsdRetailers.map((r) => (
                                <tr key={r.name} className="hover:bg-slate-50 transition-colors group border-b border-slate-100">
                                    <td className="p-4 font-bold text-slate-900 group-hover:text-rd-primary transition-colors">{r.name}</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rd-primary/10 text-rd-primary">
                                            DSD
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-500">{r.stores}</td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">{r.units.toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">${r.asp.toFixed(2)}</td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">${r.rate.toFixed(2)}</td>
                                    <td className="p-4 text-right font-bold text-rd-green">{formatCurrency(r.total)}</td>
                                </tr>
                            ))}
                            
                            {/* Warehouse Section Header */}
                            <tr className="bg-slate-50 border-y-2 border-slate-200">
                                <td colSpan={7} className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <span className="px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rd-blue/10 text-rd-blue border border-rd-blue/20">
                                            Warehouse Channel
                                        </span>
                                        <span className="text-sm font-semibold text-slate-500">
                                            {warehouseTotalUnits.toLocaleString()} units • {formatCurrency(warehouseTotalRoyalty)} royalty
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            
                            {/* Warehouse Retailers */}
                            {warehouseRetailers.map((r) => (
                                <tr key={r.name} className="hover:bg-slate-50 transition-colors group border-b border-slate-100">
                                    <td className="p-4 font-bold text-slate-900 group-hover:text-rd-blue transition-colors">{r.name}</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rd-blue/10 text-rd-blue">
                                            Warehouse
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-500">{r.stores}</td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">{r.units.toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">${r.asp.toFixed(2)}</td>
                                    <td className="p-4 text-right font-mono font-medium text-slate-600">${r.rate.toFixed(2)}</td>
                                    <td className="p-4 text-right font-bold text-rd-green">{formatCurrency(r.total)}</td>
                                </tr>
                            ))}
                            
                            {/* Grand Total Row */}
                            <tr className="bg-slate-900 text-white">
                                <td colSpan={3} className="p-5 font-black text-base rounded-bl-xl">TOTAL</td>
                                <td className="p-5 text-right font-mono font-black text-base">{grandTotalUnits.toLocaleString()}</td>
                                <td className="p-5 text-right font-mono font-medium text-slate-400">$9.24</td>
                                <td className="p-5 text-right font-mono font-medium text-slate-400">$1.10</td>
                                <td className="p-5 text-right font-black text-xl text-rd-green rounded-br-xl">{formatCurrency(grandTotalRoyalty)}</td>
                            </tr>
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
                            <ChartTooltip 
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
