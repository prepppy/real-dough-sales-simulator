import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { PageHeader } from './common/PageHeader';
import { MetricCard } from './common/MetricCard';

export const Dashboard: React.FC = () => {
  const { filteredStores, formatCurrency, getRetailerChannel, calculateStoreFinancials, state } = useSimulation();

  const isProfit = state.metricMode === 'PROFIT';
  const metricLabel = isProfit ? 'Net Profit' : 'Gross Revenue';

  const totalStores = filteredStores.length;
  
  const totalFinancials = filteredStores.reduce((acc, store) => {
    const fins = calculateStoreFinancials(store);
    acc.revenue += fins.revenue;
    acc.profit += fins.profit;
    return acc;
  }, { revenue: 0, profit: 0 });

  const displayTotal = isProfit ? totalFinancials.profit : totalFinancials.revenue;

  const avgVelocity = filteredStores.length > 0 
    ? filteredStores.reduce((acc, s) => acc + s.baseVelocity, 0) / filteredStores.length 
    : 0;

  // Split by Channel
  const channelData = filteredStores.reduce((acc, store) => {
    const channel = getRetailerChannel(store.retailerId);
    const fins = calculateStoreFinancials(store);
    const value = isProfit ? fins.profit : fins.revenue;
    acc[channel] = (acc[channel] || 0) + value;
    return acc;
  }, { 'DSD': 0, 'National Account': 0, 'Warehouse': 0 } as Record<string, number>);

  const pieData = [
    { name: 'DSD', value: channelData['DSD'] },
    { name: 'Warehouse/National', value: (channelData['National Account'] || 0) + (channelData['Warehouse'] || 0) },
  ];

  // Data for Bar Chart (Metric by Retailer)
  const metricByRetailer = filteredStores.reduce<Record<string, number>>((acc, store) => {
    const fins = calculateStoreFinancials(store);
    const value = isProfit ? fins.profit : fins.revenue;
    const retailerName = store.name.split(' #')[0];
    acc[retailerName] = (acc[retailerName] || 0) + value;
    return acc;
  }, {});

  const barChartData = Object.entries(metricByRetailer)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); 

  return (
    <div className="space-y-12 animate-fade-in pb-12">
        <PageHeader 
            number="03" 
            title="Retailer Performance" 
            subtitle="Channel & Account Analysis" 
            action={
                <span className={`text-xs font-bold px-4 py-2 rounded-full border-2 ${isProfit ? 'bg-rd-green/10 text-rd-green border-rd-green/20' : 'bg-rd-blue/10 text-rd-blue border-rd-blue/20'}`}>
                  Viewing: {metricLabel}
                </span>
            }
        />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          label={`REAL DOUGH ${isProfit ? 'PROFIT' : 'REVENUE'}`}
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: "compact" }).format(displayTotal)}
          trend={{ value: "Annualized", isPositive: true }}
          color={isProfit ? "green" : "blue"}
        />
        <MetricCard 
          label="ACTIVE STORES"
          value={totalStores.toLocaleString()} 
          context={`Across ${state.selectedState === 'ALL' ? 'All Regions' : state.selectedState}`}
          color="purple"
        />
        <MetricCard 
          label="AVG VELOCITY"
          value={avgVelocity.toFixed(1)} 
          context="Units Per Store / Week"
          color="orange"
        />
        <MetricCard 
          label="TOP RETAILER SHARE"
          value={barChartData.length > 0 ? ((barChartData[0].value / displayTotal) * 100).toFixed(0) + '%' : '0%'} 
          context={`Driven by ${barChartData.length > 0 ? barChartData[0].name : 'None'}`}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white p-8 rounded-[24px] border-3 border-black">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-display">{metricLabel} by Retailer</h3>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" horizontal={true} vertical={false} strokeWidth={2} />
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={140} 
                    tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} 
                    axisLine={false} 
                    tickLine={false} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 4}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: '#000', color: '#fff' }}
                  itemStyle={{color: '#fff'}}
                  formatter={(value: number) => [formatCurrency(value), metricLabel]}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? (isProfit ? '#00D084' : '#0066FF') : '#1A1A1A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[24px] border-3 border-black flex flex-col">
          <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">Channel Mix</h3>
          <p className="text-slate-500 mb-8">Volume Split</p>
          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  cornerRadius={8}
                  stroke="none"
                >
                  <Cell key="DSD" fill="#E53935" /> 
                  <Cell key="Warehouse/National" fill="#0066FF" /> 
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#000', color: '#fff' }}
                    itemStyle={{color: '#fff'}}
                    formatter={(value: number) => formatCurrency(value)} 
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total</p>
                    <p className="font-black font-display text-slate-900 text-2xl">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: "compact" }).format(displayTotal)}</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[24px] border-3 border-black">
          <h3 className="text-2xl font-bold text-slate-900 font-display mb-8">Top Performing Stores</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
                    <tr>
                        <th className="p-4 rounded-l-lg">Store</th>
                        <th className="p-4">Channel</th>
                        <th className="p-4">Region</th>
                        <th className="p-4 text-right">Velocity</th>
                        <th className="p-4 text-right rounded-r-lg">Est. Annual {isProfit ? 'Profit' : 'Revenue'}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredStores
                        .sort((a,b) => b.baseVelocity - a.baseVelocity)
                        .slice(0, 5)
                        .map(store => {
                            const fins = calculateStoreFinancials(store);
                            const val = isProfit ? fins.profit : fins.revenue;
                            return (
                                <tr key={store.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4 font-bold text-slate-900 group-hover:text-rd-primary transition-colors">{store.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getRetailerChannel(store.retailerId) === 'DSD' ? 'bg-rd-primary/10 text-rd-primary' : 'bg-rd-blue/10 text-rd-blue'}`}>
                                            {getRetailerChannel(store.retailerId)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 font-medium">{store.state}</td>
                                    <td className="p-4 text-right font-black text-slate-900">{store.baseVelocity.toFixed(1)}</td>
                                    <td className="p-4 text-right font-mono font-bold text-slate-600">
                                        {formatCurrency(val)}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};
