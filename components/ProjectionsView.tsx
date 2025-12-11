import React, { useState } from 'react';
import { PROJECTIONS_2027 } from '../constants';
import { useSimulation } from '../context/SimulationContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { Store } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { MetricCard } from './common/MetricCard';

// Define 2026 Data locally as it's specific to this view's new requirement
const PROJECTIONS_2026 = [
  {
    quarter: 'Q2 2026',
    revenue: 1320000,
    profit: 157000, // Representing Royalty
    activeStores: 245,
    growth: 0,
    notes: "Launch Quarter (Actuals). Strong initial acceptance.",
    status: "ACTUAL"
  },
  {
    quarter: 'Q3 2026',
    revenue: 2640000,
    profit: 313000,
    activeStores: 580,
    growth: 100,
    notes: "Projected: Expansion into Chicago & Milwaukee.",
    status: "PROJECTED"
  },
  {
    quarter: 'Q4 2026',
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
  const [selectedYear, setSelectedYear] = useState<'2026' | '2027'>('2026');

  const currentData = selectedYear === '2026' ? PROJECTIONS_2026 : PROJECTIONS_2027;
  const is2026 = selectedYear === '2026';

  const totalRevenue = currentData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = currentData.reduce((acc, curr) => acc + curr.profit, 0);
  
  // Calculate growth properly
  const totalGrowth = is2026 
    ? ((PROJECTIONS_2026[2].revenue - PROJECTIONS_2026[0].revenue) / PROJECTIONS_2026[0].revenue) * 100
    : ((PROJECTIONS_2027[3].revenue - PROJECTIONS_2027[0].revenue) / PROJECTIONS_2027[0].revenue) * 100;

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <PageHeader 
        number="06" 
        title={is2026 ? '2026 Forecast' : '2027 Outlook'} 
        subtitle={is2026 ? 'Current year performance and remaining quarterly targets' : 'Long-term projected performance based on growth targets'}
        action={
            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center shadow-inner">
                <button 
                    onClick={() => setSelectedYear('2026')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${is2026 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    2026
                </button>
                <button 
                    onClick={() => setSelectedYear('2027')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!is2026 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    2027
                </button>
            </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard 
            label={is2026 ? 'TOTAL REVENUE' : 'PROJ REVENUE'}
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: "compact" }).format(totalRevenue)}
            color="blue"
        />
        <MetricCard 
            label={is2026 ? 'TOTAL ROYALTY' : 'PROJ PROFIT'}
            value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: "compact" }).format(totalProfit)}
            trend={{ value: `${(totalProfit/totalRevenue*100).toFixed(1)}% Margin`, isPositive: true }}
            color="green"
        />
        <MetricCard 
            label="GROWTH TARGET"
            value={`${totalGrowth.toFixed(1)}%`}
            context={is2026 ? 'Launch to Year End' : 'Q1 to Q4 Acceleration'}
            color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border-3 border-black">
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-8">
                {is2026 ? 'Revenue & Royalty Trajectory' : 'Revenue & Profit Trajectory'}
            </h3>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={currentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00D084" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#00D084" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#f1f5f9" vertical={false} strokeWidth={2} />
                        <XAxis 
                            dataKey="quarter" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                            dy={10} 
                        />
                        <YAxis 
                            yAxisId="left" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                            tickFormatter={(val) => `$${val/1000000}M`} 
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#000', color: '#fff' }}
                            itemStyle={{color: '#fff'}}
                            formatter={(value: any, name: string) => {
                                if (name === 'growth') return [`${value}%`, 'Growth'];
                                return [formatCurrency(value as number), name];
                            }}
                        />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#0066FF" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area yAxisId="left" type="monotone" dataKey="profit" name={is2026 ? "Royalty" : "Profit"} stroke="#00D084" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-[24px] border-3 border-black overflow-hidden flex flex-col">
            <div className="p-6 border-b-2 border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900 font-display text-lg">Quarterly Breakdown</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Key performance drivers</p>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {currentData.map((q, i) => (
                    <div key={q.quarter} className="p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-3">
                                <span className="font-black text-xl text-slate-900">{q.quarter}</span>
                                {is2026 && (
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                                        (q as any).status === 'ACTUAL' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {(q as any).status}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-rd-green/10 text-rd-green border border-rd-green/20`}>
                                {q.growth > 0 ? '+' : ''}{q.growth}%
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Revenue</span>
                                <span className="text-lg font-bold text-slate-700">{formatCurrency(q.revenue)}</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">{is2026 ? 'Royalty' : 'Profit'}</span>
                                <span className="text-lg font-bold text-rd-green">{formatCurrency(q.profit)}</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2 text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <Store size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
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
