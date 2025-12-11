import React from 'react';
import { useSimulation } from '../context/SimulationContext';
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
    <div className="space-y-12 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-4xl font-bold font-display text-slate-300">01</span>
                    <h2 className="text-5xl font-bold text-slate-900 font-display">Executive Overview</h2>
                </div>
                <p className="text-slate-500 text-lg font-medium">Q2 2025 Performance (Week 12)</p>
            </div>
            <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Launch Status</span>
                <div className="inline-flex items-center bg-rd-green/10 text-rd-green px-4 py-2 rounded-full font-bold border border-rd-green/20">
                    <div className="w-2.5 h-2.5 bg-rd-green rounded-full mr-2.5 animate-pulse"></div>
                    Live in 895 Stores
                </div>
            </div>
        </div>

        {/* Hero KPI Grid - Asymmetric Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Mega Card - Royalty */}
            <div className="lg:col-span-2 metric-card bg-white rounded-[24px] border-3 border-black p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rd-primary to-rd-secondary"></div>
                <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">EST. Q2 ROYALTY</span>
                    <span className="bg-rd-green/10 text-rd-green text-xs font-bold px-3 py-1 rounded-full">+5% vs Goal</span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-slate-400">$</span>
                    <span className="text-8xl font-black font-display text-slate-900 tracking-tighter">157,410</span>
                </div>
                <div className="mt-4 flex items-center space-x-2 text-sm font-medium text-slate-500">
                   <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                   <span>Base $0.50</span>
                   <span className="text-slate-300">|</span>
                   <span className="w-2 h-2 rounded-full bg-rd-secondary"></span>
                   <span>Add'l $0.60 avg</span>
                </div>
            </div>

            {/* Revenue Card */}
            <div className="metric-card bg-white rounded-[24px] border-3 border-black p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-rd-secondary"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">QTD REVENUE</span>
                <div className="mb-2">
                    <span className="text-4xl font-black font-display text-slate-900 tracking-tight">$1.32M</span>
                </div>
                <p className="text-sm font-bold text-rd-green">↑ +8% vs Goal</p>
            </div>

            {/* Velocity & ASP Stacked */}
            <div className="flex flex-col space-y-8">
                <div className="metric-card bg-white rounded-[24px] border-3 border-black p-6 relative overflow-hidden flex-1">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-rd-purple"></div>
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">WEIGHTED ASP</span>
                            <span className="text-3xl font-black font-display text-slate-900">$9.24</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Target</span>
                            <span className="text-sm font-bold text-slate-600">$9.20</span>
                        </div>
                    </div>
                </div>

                <div className="metric-card bg-white rounded-[24px] border-3 border-black p-6 relative overflow-hidden flex-1">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-rd-blue"></div>
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">AVG VELOCITY</span>
                            <span className="text-3xl font-black font-display text-slate-900">3.2</span>
                        </div>
                        <div className="text-right">
                             <span className="text-[10px] font-bold text-slate-400 uppercase block">Units/Store</span>
                             <span className="text-sm font-bold text-slate-600">Per Week</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[24px] border-3 border-black">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 font-display">Sales Trajectory</h3>
                    <p className="text-slate-500">Weekly Unit Volume (Launch to Date)</p>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E53935" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#E53935" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#f1f5f9" vertical={false} strokeWidth={2} />
                            <XAxis 
                                dataKey="week" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#000', 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    color: '#fff',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)'
                                }}
                                itemStyle={{color: '#fff'}}
                                labelStyle={{color: '#94a3b8', marginBottom: '4px'}}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="units" 
                                stroke="#E53935" 
                                strokeWidth={4} 
                                fillOpacity={1} 
                                fill="url(#colorUnits)" 
                                dot={{r: 6, fill: '#E53935', strokeWidth: 2, stroke: '#fff'}}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Distribution Status */}
            <div className="bg-white p-10 rounded-[24px] border-3 border-black flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 font-display mb-8">Distribution</h3>
                    
                    <div className="space-y-8">
                        <DistroBar retailer="Target" current={147} target={150} color="bg-rd-primary" />
                        <DistroBar retailer="Walmart" current={745} target={750} color="bg-rd-blue" />
                        <DistroBar retailer="Publix" current={0} target={250} color="bg-rd-green" pending />
                        <DistroBar retailer="Kroger" current={0} target={200} color="bg-rd-purple" pending />
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t-2 border-slate-100">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">TOTAL ACV</span>
                        <span className="text-4xl font-black font-display text-slate-900">24.8%</span>
                     </div>
                     <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900 w-[24.8%] rounded-full"></div>
                     </div>
                     <p className="text-xs font-bold text-slate-400 mt-3 text-right">GOAL: 52% BY YEAR 1</p>
                </div>
            </div>
        </div>
    </div>
  );
};

const DistroBar = ({ retailer, current, target, color, pending }: any) => {
    const pct = Math.min(100, (current / target) * 100);
    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-900">{retailer}</span>
                <span className="font-bold text-slate-500 tabular-nums">{current} <span className="text-slate-300">/</span> {target}</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${pending ? 'bg-slate-300' : color} transition-all duration-1000 ease-out`} 
                    style={{ width: `${pct}%` }}
                ></div>
            </div>
            {pending && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">🚀 Launching Q3 2025</p>}
        </div>
    );
};
