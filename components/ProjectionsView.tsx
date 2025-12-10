import React from 'react';
import { PROJECTIONS_2026 } from '../constants';
import { useSimulation } from '../context/SimulationContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Line } from 'recharts';
import { TrendingUp, DollarSign, Store, Calendar, ArrowUpRight } from 'lucide-react';

export const ProjectionsView: React.FC = () => {
  const { formatCurrency } = useSimulation();

  const totalRevenue2026 = PROJECTIONS_2026.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit2026 = PROJECTIONS_2026.reduce((acc, curr) => acc + curr.profit, 0);
  const totalGrowth = ((PROJECTIONS_2026[3].revenue - PROJECTIONS_2026[0].revenue) / PROJECTIONS_2026[0].revenue) * 100;

  return (
    <div className="space-y-8 animate-fade-in h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">2026 Financial Outlook</h2>
            <p className="text-slate-500 mt-1">Projected performance based on current pipeline and growth targets.</p>
        </div>
        <div className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center shadow-lg">
            <Calendar size={18} className="mr-2 text-rose-400" />
            <span className="font-bold">Fiscal Year 2026</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Proj. 2026 Revenue</p>
                <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(totalRevenue2026)}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <DollarSign size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Proj. 2026 Profit</p>
                <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(totalProfit2026)}</h3>
                <p className="text-xs text-emerald-600 font-medium mt-1">{(totalProfit2026/totalRevenue2026*100).toFixed(1)}% Net Margin</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp size={24} />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">YOY Growth Target</p>
                <h3 className="text-3xl font-bold text-slate-800">+{totalGrowth.toFixed(1)}%</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Q1 to Q4 Acceleration</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <ArrowUpRight size={24} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-800 mb-6 text-lg">Revenue & Profit Trajectory</h3>
            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={PROJECTIONS_2026} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                        <Area yAxisId="left" type="monotone" dataKey="profit" name="Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
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
                {PROJECTIONS_2026.map((q, i) => (
                    <div key={q.quarter} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-slate-900">{q.quarter}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700`}>
                                +{q.growth}%
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <span className="text-xs text-slate-400 block uppercase tracking-wider">Revenue</span>
                                <span className="text-sm font-semibold text-slate-700">{formatCurrency(q.revenue)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block uppercase tracking-wider">Profit</span>
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


