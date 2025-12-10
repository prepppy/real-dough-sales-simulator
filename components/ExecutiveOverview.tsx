import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ArrowUpRight, DollarSign, Package, Percent, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ExecutiveOverview: React.FC = () => {
  const { formatCurrency } = useSimulation();

  // Mock Data based on Spec for Q2 2025
  const metrics = {
    qtdUnits: 142500,
    qtdRevenue: 1317375,
    weightedASP: 9.24,
    estRoyalty: 157410,
    storesCarrying: 895,
    targetStores: 150 + 750, // Target + Walmart initial
    velocity: 3.2
  };

  const trendData = [
    { week: 'W1', units: 8500 },
    { week: 'W2', units: 9200 },
    { week: 'W3', units: 10500 },
    { week: 'W4', units: 11200 },
    { week: 'W5', units: 11800 },
    { week: 'W6', units: 12500 },
    { week: 'W7', units: 12900 },
    { week: 'W8', units: 13500 },
    { week: 'W9', units: 14100 },
    { week: 'W10', units: 14800 },
    { week: 'W11', units: 15200 },
    { week: 'W12', units: 15800 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Executive Overview</h2>
                <p className="text-slate-500 text-sm">Q2 2025 Performance (Week 12)</p>
            </div>
            <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Launch Status</span>
                <div className="flex items-center text-emerald-600 font-bold text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    Live in 895 Stores
                </div>
            </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
                title="QTD Revenue" 
                value={formatCurrency(metrics.qtdRevenue)} 
                trend="+5% vs Goal" 
                icon={<DollarSign size={20} />}
                color="bg-blue-500"
            />
            <KpiCard 
                title="Est. Royalty" 
                value={formatCurrency(metrics.estRoyalty)} 
                trend="Base + Add'l" 
                icon={<Activity size={20} />}
                color="bg-amber-500"
            />
             <KpiCard 
                title="Weighted ASP" 
                value={`$${metrics.weightedASP.toFixed(2)}`} 
                trend="Target: $9.20" 
                icon={<Percent size={20} />}
                color="bg-emerald-500"
            />
            <KpiCard 
                title="Avg Velocity" 
                value={metrics.velocity.toFixed(1)} 
                trend="Units/Store/Wk" 
                icon={<ArrowUpRight size={20} />}
                color="bg-purple-500"
            />
        </div>

        {/* Main Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Unit Sales Trajectory (Launch to Date)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}
                            />
                            <Area type="monotone" dataKey="units" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUnits)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Distribution Status */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Distribution Progress</h3>
                
                <div className="space-y-6">
                    <DistroBar retailer="Target" current={147} target={150} color="bg-red-500" />
                    <DistroBar retailer="Walmart" current={745} target={750} color="bg-blue-600" />
                    <DistroBar retailer="Publix" current={0} target={250} color="bg-emerald-500" pending />
                    <DistroBar retailer="Kroger" current={0} target={200} color="bg-blue-400" pending />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">Total ACV %</span>
                        <span className="text-xl font-bold text-slate-900">24.8%</span>
                     </div>
                     <p className="text-xs text-slate-400">Targeting 52% by Year 1</p>
                </div>
            </div>
        </div>
    </div>
  );
};

const KpiCard = ({ title, value, trend, icon, color }: any) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color.replace('bg-', 'text-')}`}>
            {icon}
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">{value}</h3>
        <p className={`text-xs font-medium ${trend.includes('+') ? 'text-emerald-600' : 'text-slate-400'}`}>{trend}</p>
    </div>
);

const DistroBar = ({ retailer, current, target, color, pending }: any) => {
    const pct = Math.min(100, (current / target) * 100);
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">{retailer}</span>
                <span className="text-slate-500">{current} / {target}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${pending ? 'bg-slate-300' : color} transition-all duration-1000`} 
                    style={{ width: `${pct}%` }}
                ></div>
            </div>
            {pending && <p className="text-[10px] text-slate-400 mt-1 italic">Launching Q3 2025</p>}
        </div>
    );
};

