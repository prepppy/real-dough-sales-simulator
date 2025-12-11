import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader } from './common/PageHeader';
import { MetricCard } from './common/MetricCard';
import { ProgressBar } from './common/ProgressBar';

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
        <PageHeader 
            number="01" 
            title="Executive Overview" 
            subtitle="Q2 2025 Performance (Week 12)" 
            action={
                <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Launch Status</span>
                    <div className="inline-flex items-center bg-rd-green/10 text-rd-green px-4 py-2 rounded-full font-bold border border-rd-green/20">
                        <div className="w-2.5 h-2.5 bg-rd-green rounded-full mr-2.5 animate-pulse"></div>
                        Live in 895 Stores
                    </div>
                </div>
            }
        />

        {/* Hero KPI Grid - Asymmetric Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <MetricCard 
                size="mega"
                label="EST. Q2 ROYALTY"
                prefix="$"
                value="157,410"
                trend={{ value: "+5% vs Goal", isPositive: true }}
                context="Base $0.50 + Add'l $0.60 avg"
                color="red"
            />

            <MetricCard 
                label="QTD REVENUE"
                value="$1.32M"
                trend={{ value: "+8% vs Goal", isPositive: true }}
                color="orange"
            />

            <div className="flex flex-col space-y-8">
                <MetricCard 
                    label="WEIGHTED ASP"
                    prefix="$"
                    value="9.24"
                    trend={{ value: "Target $9.20", isPositive: true, label: "Target: $9.20" }}
                    color="purple"
                />

                <MetricCard 
                    label="AVG VELOCITY"
                    value="3.2"
                    context="Units/Store Per Week"
                    color="blue"
                />
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
                        <ProgressBar label="Target" current={147} total={150} color="bg-rd-primary" />
                        <ProgressBar label="Walmart" current={745} total={750} color="bg-rd-blue" />
                        <ProgressBar label="Publix" current={0} total={250} color="bg-rd-green" pending />
                        <ProgressBar label="Kroger" current={0} total={200} color="bg-rd-purple" pending />
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
