import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, Save, TrendingUp, DollarSign, Store, Crown, PieChart } from 'lucide-react';
import { calculateRoyalty } from '../utils/financials';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';

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
    <div className="space-y-8 animate-fade-in pb-12 h-full flex flex-col">
      <PageHeader 
        number="08" 
        title="Scenario Builder" 
        subtitle="Model expansion impact & royalty lift" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            
            <div className="bg-white p-8 rounded-[24px] border-3 border-black shadow-sm">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="p-3 bg-rd-primary rounded-xl text-white shadow-lg shadow-rd-primary/20"><Calculator size={24} /></div>
                    <h2 className="text-xl font-black font-display text-slate-900">Expansion Modeler</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Scenario Name</label>
                        <input 
                        type="text" 
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl font-bold text-slate-900 focus:border-rd-primary focus:ring-4 focus:ring-rd-primary/10 outline-none transition-all bg-slate-50 focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Target Retailer</label>
                        <select 
                            value={selectedRetailerId}
                            onChange={(e) => setSelectedRetailerId(e.target.value)}
                            className="w-full p-4 border-2 border-slate-200 rounded-xl font-bold text-slate-900 bg-slate-50 focus:bg-white outline-none cursor-pointer appearance-none"
                        >
                            {retailers.map(r => <option key={r.id} value={r.id}>{r.name} ({r.channel})</option>)}
                        </select>
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-white">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Channel Model</span>
                            <span className="font-bold text-white">{channel}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Pricing Tier</span>
                            <span className="font-bold text-rd-primary">{channel === 'DSD' ? 'Standard' : 'Volume'}</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t-2 border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 flex items-center mb-4 uppercase tracking-wide">
                            Operational Inputs
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">New Stores</label>
                                <input 
                                    type="number" 
                                    value={newStoreCount}
                                    onChange={(e) => setNewStoreCount(parseInt(e.target.value) || 0)}
                                    className="w-full p-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:border-rd-blue outline-none text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Velocity (U/S/W)</label>
                                <input 
                                    type="number" step="0.1"
                                    value={projectedVelocity}
                                    onChange={(e) => setProjectedVelocity(parseFloat(e.target.value) || 0)}
                                    className="w-full p-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:border-rd-blue outline-none text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Avg ASP ($)</label>
                                <input 
                                    type="number" step="0.01"
                                    value={projectedASP}
                                    onChange={(e) => setProjectedASP(parseFloat(e.target.value) || 0)}
                                    className="w-full p-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:border-rd-blue outline-none text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">Weeks</label>
                                <input 
                                    type="number"
                                    value={weeksInQuarter}
                                    onChange={(e) => setWeeksInQuarter(parseInt(e.target.value) || 0)}
                                    className="w-full p-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:border-rd-blue outline-none text-center"
                                />
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleSave} className="w-full" icon={<Save size={18} />}>
                        Save Scenario
                    </Button>
                </div>
            </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Main Result Card */}
            <div className="bg-white p-10 rounded-[24px] border-3 border-black relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rd-primary/5 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <h3 className="font-black text-slate-900 text-3xl font-display mb-2">Projected Quarterly Impact</h3>
                    <p className="text-slate-500 font-medium mb-10">Based on expansion into {selectedRetailer?.name} ({newStoreCount} stores)</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">ROYALTY PAYMENT</p>
                            <p className="text-4xl font-black font-display text-rd-green tracking-tight">{formatCurrency(quarterlyRoyalty)}</p>
                            <p className="text-sm text-slate-500 font-bold mt-2">Rate: ${royaltyRate.toFixed(3)} / unit</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">REVENUE LIFT</p>
                            <p className="text-4xl font-black font-display text-rd-blue tracking-tight">+{formatCurrency(quarterlyRevenue)}</p>
                            <p className="text-sm text-slate-500 font-bold mt-2">Volume: {quarterlyUnits.toLocaleString()} units</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">ACV IMPACT</p>
                            <div className="flex items-baseline space-x-2">
                                <p className="text-4xl font-black font-display text-slate-900 tracking-tight">{newACV.toFixed(1)}%</p>
                                <span className="text-sm font-bold text-rd-green">+{((newStoreCount/5000)*100).toFixed(1)}%</span>
                            </div>
                            <p className="text-sm text-slate-500 font-bold mt-2">Total Target: 52%</p>
                        </div>
                    </div>

                    {/* Royalty Detail Bar */}
                    <div className="bg-slate-900 rounded-2xl p-8 text-white">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-lg">Royalty Composition</h4>
                            <span className="text-sm font-mono text-slate-400">Total Rate: ${royaltyRate.toFixed(2)}</span>
                        </div>
                        
                        <div className="h-16 w-full flex rounded-xl overflow-hidden font-bold text-sm">
                            <div style={{ width: `${(royaltyInfo.base / royaltyRate) * 100}%` }} className="bg-rd-primary flex items-center justify-center relative group">
                                <span>Base ${royaltyInfo.base.toFixed(2)}</span>
                            </div>
                            <div style={{ width: `${(royaltyInfo.additional / royaltyRate) * 100}%` }} className="bg-rd-orange flex items-center justify-center relative group">
                                <span>Add'l ${royaltyInfo.additional.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Fixed Base Rate</span>
                            <span>ASP Driven Bonus</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
