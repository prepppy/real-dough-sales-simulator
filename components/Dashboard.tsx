import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp, DollarSign, Package, Store } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; subtext: string; icon: React.ReactNode; color: string }> = ({ title, value, subtext, icon, color }) => (
  <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl text-slate-600 shadow-inner">
        {icon}
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { filteredStores, formatCurrency, getRetailerChannel, calculateStoreFinancials, state } = useSimulation();

  const isProfit = state.metricMode === 'PROFIT';
  const metricLabel = isProfit ? 'Net Profit' : 'Gross Revenue';

  // Metrics Logic - Filtered to Real Dough Pizza Co (Simulated)
  // In a real app, we'd filter by brandId. Here, we assume filteredStores contains the relevant data.
  // ISSUE 2 FIX: Renamed metrics to be Real Dough specific
  
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

  // Combine Warehouse and National Account for display if needed, or keep separate
  // Based on spec, Warehouse is key.
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
            {/* ISSUE 2 FIX: Renamed from "Executive Summary" to "Retailer Performance" */}
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Retailer Performance</h2>
            <p className="text-slate-500 mt-1">Real Dough Pizza Co. - Channel & Account Analysis</p>
        </div>
        <span className={`text-sm font-bold px-4 py-2 rounded-full shadow-sm transition-colors border ${isProfit ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
          Currently Viewing: {metricLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={`Real Dough ${metricLabel}`}
          value={formatCurrency(displayTotal)} 
          subtext="Annualized Run-Rate"
          icon={<DollarSign size={24} />}
          color={isProfit ? "bg-emerald-500" : "bg-blue-600"}
        />
        <StatCard 
          title="Real Dough Stores" 
          value={totalStores.toLocaleString()} 
          subtext={`Across ${state.selectedState === 'ALL' ? 'All Regions' : state.selectedState}`}
          icon={<Store size={24} />}
          color="bg-indigo-500"
        />
        <StatCard 
          title="Real Dough Velocity" 
          value={avgVelocity.toFixed(1)} 
          subtext="Units Per Store Per Week"
          icon={<TrendingUp size={24} />}
          color="bg-amber-500"
        />
        {/* ISSUE 2 FIX: Removed generic DSD Contribution, replaced with Top Retailer Share */}
        <StatCard 
          title="Top Retailer Share" 
          value={barChartData.length > 0 ? ((barChartData[0].value / displayTotal) * 100).toFixed(0) + '%' : '0%'} 
          subtext={`Driven by ${barChartData.length > 0 ? barChartData[0].name : 'None'}`}
          icon={<Package size={24} />}
          color="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">{metricLabel} by Retailer</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 12, fill: '#64748b', fontWeight: 500}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9', radius: 4}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), metricLabel]}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? (isProfit ? '#10b981' : '#3b82f6') : '#475569'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Channel Mix</h3>
          <p className="text-sm text-slate-400 mb-6">Real Dough Volume Split</p>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={6}
                  dataKey="value"
                  cornerRadius={6}
                >
                  <Cell key="DSD" fill="#e11d48" /> 
                  <Cell key="Warehouse/National" fill="#2563eb" /> 
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => formatCurrency(value)} 
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Total</p>
                    <p className="font-bold text-slate-800 text-lg">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: "compact" }).format(displayTotal)}</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Performing Stores (Real Dough)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
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
                                <tr key={store.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-4 font-medium text-slate-800 group-hover:text-red-700 transition-colors">{store.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getRetailerChannel(store.retailerId) === 'DSD' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {getRetailerChannel(store.retailerId)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500">{store.state}</td>
                                    <td className="p-4 text-right font-bold text-slate-700">{store.baseVelocity.toFixed(1)}</td>
                                    <td className="p-4 text-right font-mono text-slate-600 font-medium">
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
