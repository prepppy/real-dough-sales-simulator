import React, { useState } from 'react';
import { PROJECTIONS_2026 } from '../constants';
import { useSimulation } from '../context/SimulationContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts';
import { TrendingUp, DollarSign, Store, Calendar, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';

// Define 2025 Data locally as it's specific to this view's new requirement
const PROJECTIONS_2025 = [
  {
    quarter: 'Q2 2025',
    revenue: 1320000,
    profit: 157000, // Representing Royalty
    activeStores: 245,
    growth: 0,
    notes: "Launch Quarter (Actuals). Strong initial acceptance.",
    status: "ACTUAL"
  },
  {
    quarter: 'Q3 2025',
    revenue: 2640000,
    profit: 313000,
    activeStores: 580,
    growth: 100,
    notes: "Projected: Expansion into Chicago & Milwaukee.",
    status: "PROJECTED"
  },
  {
    quarter: 'Q4 2025',
    revenue: 3530000,
    profit: 421000,
    activeStores: 920,
    growth: 33.7,
    notes: "Projected: Holiday season push & 1000 store goal.",
    status: "PROJECTED"
  }
];

export const ProjectionsView: React.FC = () => {
  const { formatCurrency } = useSimulation();
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026'>('2025');

  const currentData = selectedYear === '2025' ? PROJECTIONS_2025 : PROJECTIONS_2026;
  const is2025 = selectedYear === '2025';

  const totalRevenue = currentData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = currentData.reduce((acc, curr) => acc + curr.profit, 0);
  
  // Calculate growth properly
  const totalGrowth = is2025 
    ? ((PROJECTIONS_2025[2].revenue - PROJECTIONS_2025[0].revenue) / PROJECTIONS_2025[0].revenue) * 100
    : ((PROJECTIONS_2026[3].revenue - PROJECTIONS_2026[0].revenue) / PROJECTIONS_2026[0].revenue) * 100;

  return (
    <div className="space-y-8 animate-fade-in h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {is2025 ? '2025 Forecast' : '2026 Financial Outlook'}
            </h2>
            <p className="text-slate-500 mt-1">
                {is2025 
                    ? 'Current year performance and remaining quarterly targets.' 
                    : 'Long-term projected performance based on growth targets.'}
            </p>
        </div>
        
        <div className="flex items-center space-x-4">
            {/* Year Toggle */}
            <div className="bg-slate-200 p-1 rounded-xl flex items-center shadow-inner">
                <button 
                    onClick={() => setSelectedYear('2025')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${is2025 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    2025 Forecast
                </button>
                <button 
                    onClick={() => setSelectedYear('2026')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!is2025 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    2026 Projections
                </button>
            </div>

            <div className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center shadow-lg">
                <Calendar size={18} className="mr-2 text-rose-400" />
                <span className="font-bold">Fiscal Year {selectedYear}</span>
            </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {is2025 ? '2025 Total Revenue' : 'Proj. 2026 Revenue'}
                </p>
                <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <DollarSign size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {is2025 ? '2025 Total Royalty' : 'Proj. 2026 Profit'}
                </p>
                <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(totalProfit)}</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                    {(totalProfit/totalRevenue*100).toFixed(1)}% {is2025 ? 'Eff. Rate' : 'Net Margin'}
                </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {is2025 ? 'Q2-Q4 Growth' : 'YOY Growth Target'}
                </p>
                <h3 className="text-3xl font-bold text-slate-800">+{totalGrowth.toFixed(1)}%</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                    {is2025 ? 'Launch to Year End' : 'Q1 to Q4 Acceleration'}
                </p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <ArrowUpRight size={24} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-6 text-lg">
                {is2025 ? '2025 Revenue & Royalty Trajectory' : 'Revenue & Profit Trajectory'}
            </h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 600}} dy={10} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000000}M`} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} hide />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            formatter={(value: any, name: string) => {
                                if (name === 'growth') return [`${value}%`, 'Growth'];
                                return [formatCurrency(value as number), name];
                            }}
                        />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                        <Area yAxisId="left" type="monotone" dataKey="profit" name={is2025 ? "Royalty" : "Profit"} stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white p-0 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Quarterly Breakdown</h3>
                <p className="text-xs text-slate-500">Key performance drivers</p>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {currentData.map((q, i) => (
                    <div key={q.quarter} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-slate-900">{q.quarter}</span>
                                {is2025 && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                        (q as any).status === 'ACTUAL' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {(q as any).status}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700`}>
                                {q.growth > 0 ? '+' : ''}{q.growth}%
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <span className="text-xs text-slate-400 block uppercase tracking-wider">Revenue</span>
                                <span className="text-sm font-semibold text-slate-700">{formatCurrency(q.revenue)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block uppercase tracking-wider">{is2025 ? 'Royalty' : 'Profit'}</span>
                                <span className="text-sm font-semibold text-emerald-600">{formatCurrency(q.profit)}</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2 text-xs text-slate-500 bg-slate-100 p-2 rounded-lg">
                            <Store size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{q.notes}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
