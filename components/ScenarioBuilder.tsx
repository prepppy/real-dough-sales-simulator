import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Save, TrendingUp, DollarSign, Store, Crown, PieChart } from 'lucide-react';
import { calculateRoyalty } from '../utils/financials';

export const ScenarioBuilder: React.FC = () => {
  const { retailers, addScenario, formatCurrency } = useSimulation();

  // Scenario State
  const [scenarioName, setScenarioName] = useState('Expansion Scenario A');
  const [selectedRetailerId, setSelectedRetailerId] = useState<string>(retailers[0].id);
  const [newStoreCount, setNewStoreCount] = useState<number>(50);
  const [projectedASP, setProjectedASP] = useState<number>(9.30);
  const [projectedVelocity, setProjectedVelocity] = useState<number>(2.5);
  const [weeksInQuarter, setWeeksInQuarter] = useState<number>(13);
  
  // SKU Mix State (simplified)
  const [selectedSkus, setSelectedSkus] = useState({
    pepperoni: true,
    sausage: true,
    margherita: false,
    cheese: false,
    veggie: false
  });

  const selectedRetailer = retailers.find(r => r.id === selectedRetailerId);
  const channel = selectedRetailer?.channel || 'DSD';

  // Calculations
  const quarterlyUnits = newStoreCount * projectedVelocity * weeksInQuarter;
  const quarterlyRevenue = quarterlyUnits * projectedASP;
  
  // Royalty Calculation
  const royaltyInfo = calculateRoyalty(projectedASP, channel);
  const royaltyRate = royaltyInfo.total;
  const quarterlyRoyalty = quarterlyUnits * royaltyRate;

  // Mock Baselines for Impact Analysis (would come from context in real app)
  const baselineRevenue = 7490000; // Annualized or Current Quarter baseline
  const baselineRoyalty = 891000;
  const baselineACV = 24.8; // %

  // Impact Calculations
  const revenueIncreasePct = (quarterlyRevenue / (baselineRevenue / 4)) * 100; // Comparing to approx quarterly baseline
  const royaltyIncreaseDollars = quarterlyRoyalty;
  const newACV = baselineACV + (newStoreCount / 5000 * 100); // Mock ACV impact

  const handleSave = () => {
    addScenario({
        id: Date.now().toString(),
        name: scenarioName,
        description: `${channel} Expansion: ${selectedRetailer?.name}`,
        targetRetailerId: selectedRetailerId,
        targetProductIds: [], // Not tracking specific IDs in this view
        storeCount: newStoreCount,
        promoWeeks: 0,
        promoLiftMultiplier: 1,
        incrementalRevenue: quarterlyRevenue,
        incrementalProfit: quarterlyRoyalty, // Using profit field for Royalty
        customWholesalePrice: projectedASP,
        
        // Storing extra data for potential future use
        royaltyRate: royaltyRate,
        calculatedBaseRoyalty: royaltyInfo.base,
        calculatedAddlRoyalty: royaltyInfo.additional
    });
    alert('Scenario Saved!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Calculator size={20} /></div>
                <h2 className="text-xl font-bold text-slate-800">Expansion Modeler</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Scenario Name</label>
                    <input 
                      type="text" 
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Target Retailer</label>
                        <select 
                            value={selectedRetailerId}
                            onChange={(e) => setSelectedRetailerId(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white outline-none"
                        >
                            {retailers.map(r => <option key={r.id} value={r.id}>{r.name} ({r.channel})</option>)}
                        </select>
                    </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block">Active Channel</span>
                        <span className="font-bold text-indigo-900">{channel} Model</span>
                    </div>
                    <div className="text-right">
                         <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block">Royalty Logic</span>
                         <span className="font-bold text-indigo-900">{channel === 'DSD' ? 'Standard Tier' : 'Volume Tier'}</span>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center">
                        <Store size={16} className="mr-2 text-slate-400" /> Operational Inputs
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">New Stores</label>
                            <input 
                                type="number" 
                                value={newStoreCount}
                                onChange={(e) => setNewStoreCount(parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Weeks (Quarter)</label>
                            <input 
                                type="number"
                                value={weeksInQuarter}
                                onChange={(e) => setWeeksInQuarter(parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Proj. Velocity (U/S/W)</label>
                            <input 
                                type="number" step="0.1"
                                value={projectedVelocity}
                                onChange={(e) => setProjectedVelocity(parseFloat(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Proj. ASP ($)</label>
                            <input 
                                type="number" step="0.01"
                                value={projectedASP}
                                onChange={(e) => setProjectedASP(parseFloat(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center mb-2">
                        <PieChart size={16} className="mr-2 text-slate-400" /> SKU Mix
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { key: 'pepperoni', label: 'Pepperoni' },
                            { key: 'sausage', label: 'Sausage & Mush' },
                            { key: 'margherita', label: 'Margherita' },
                            { key: 'cheese', label: 'Four Cheese' },
                            { key: 'veggie', label: 'BBQ Chicken' }, // Reusing veggie key for demo
                        ].map((sku) => (
                             <label key={sku.key} className="flex items-center space-x-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={(selectedSkus as any)[sku.key]}
                                    onChange={(e) => setSelectedSkus({...selectedSkus, [sku.key]: e.target.checked})}
                                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                                />
                                <span className="text-xs font-medium text-slate-700">{sku.label}</span>
                             </label>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95"
                >
                    <Save size={18} />
                    <span>Save Scenario</span>
                </button>
            </div>
        </div>
      </div>

      {/* Right Column: Results */}
      <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Result Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
             
             <div className="relative z-10">
                <h3 className="font-bold text-slate-900 text-2xl mb-1">Projected Results</h3>
                <p className="text-slate-500 text-sm mb-8">Quarterly Estimates based on inputs</p>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total Units</p>
                        <p className="text-3xl font-bold text-slate-800">{quarterlyUnits.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 mt-1">Cases: {(quarterlyUnits / 12).toFixed(0)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-slate-800">{formatCurrency(quarterlyRevenue)}</p>
                        <p className="text-xs text-slate-400 mt-1">@ ${projectedASP.toFixed(2)} ASP</p>
                    </div>
                     <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Royalty Payment</p>
                        <p className="text-3xl font-bold text-emerald-600">{formatCurrency(quarterlyRoyalty)}</p>
                        <p className="text-xs text-emerald-600/70 mt-1 font-medium">${royaltyRate.toFixed(3)} / unit</p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                             <TrendingUp size={16} className="text-blue-500" />
                             <span className="text-xs font-bold text-slate-600 uppercase">ACV Impact</span>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-xl font-bold text-slate-800">{newACV.toFixed(1)}%</span>
                            <span className="text-xs text-green-600 font-bold">+{((newStoreCount/5000)*100).toFixed(1)}%</span>
                        </div>
                    </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                             <Crown size={16} className="text-amber-500" />
                             <span className="text-xs font-bold text-slate-600 uppercase">Royalty Lift</span>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-xl font-bold text-slate-800">+{formatCurrency(royaltyIncreaseDollars)}</span>
                        </div>
                    </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-2 mb-2">
                             <DollarSign size={16} className="text-emerald-500" />
                             <span className="text-xs font-bold text-slate-600 uppercase">Revenue Lift</span>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-xl font-bold text-slate-800">+{revenueIncreasePct.toFixed(1)}%</span>
                            <span className="text-xs text-slate-400">vs Qtr Base</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Royalty Detail Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1">
             <h3 className="font-bold text-slate-800 mb-6">Royalty Calculation Detail</h3>
             <div className="flex items-center justify-center h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                        { name: 'Base', amount: royaltyInfo.base },
                        { name: 'Additional', amount: royaltyInfo.additional },
                        { name: 'Total', amount: royaltyInfo.total }
                    ]} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(3)}`, 'Rate']} cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="amount" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24} background={{ fill: '#f8fafc' }} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
             <p className="text-center text-xs text-slate-400 mt-2">
                *Based on {channel} pricing tier at ${projectedASP.toFixed(2)} ASP
             </p>
          </div>

      </div>
    </div>
  );
};
