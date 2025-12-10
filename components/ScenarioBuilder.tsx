import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calculator, Save, ArrowRight, TrendingUp, PieChart, Info } from 'lucide-react';

export const ScenarioBuilder: React.FC = () => {
  const { products, retailers, addScenario, formatCurrency, getRetailerChannel } = useSimulation();

  const [selectedRetailer, setSelectedRetailer] = useState<string>(retailers[0].id);
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0].id);
  const [targetStoreCount, setTargetStoreCount] = useState<number>(50);
  const [promoWeeks, setPromoWeeks] = useState<number>(4);
  const [promoLift, setPromoLift] = useState<number>(40); 
  const [scenarioName, setScenarioName] = useState('Q3 Pitch Scenario');

  const currentRetailer = retailers.find(r => r.id === selectedRetailer);
  const currentProduct = products.find(p => p.id === selectedProduct);
  
  // Advanced Financial Logic
  const estimatedBaseVelocity = 12; // Units/week avg
  const wholesalePrice = currentProduct?.wholesalePrice || 0;
  const cogs = currentProduct?.cogs || 0;
  const unitMargin = wholesalePrice - cogs;
  
  // Revenue Calcs
  const annualBaseRevenue = estimatedBaseVelocity * targetStoreCount * wholesalePrice * 52;
  const promoRevenue = (estimatedBaseVelocity * targetStoreCount * wholesalePrice * promoWeeks * (promoLift / 100));
  const totalRevenue = annualBaseRevenue + promoRevenue;

  // Profit Calcs
  const annualBaseProfit = estimatedBaseVelocity * targetStoreCount * unitMargin * 52;
  const promoProfit = (estimatedBaseVelocity * targetStoreCount * unitMargin * promoWeeks * (promoLift / 100));
  const totalProfit = annualBaseProfit + promoProfit;

  // Lift
  const liftPercentage = annualBaseRevenue > 0 ? ((totalRevenue - annualBaseRevenue) / annualBaseRevenue) * 100 : 0;

  const data = [
    { name: 'Baseline', Revenue: annualBaseRevenue, Profit: annualBaseProfit },
    { name: 'With Promo', Revenue: totalRevenue, Profit: totalProfit },
  ];

  const handleSave = () => {
    addScenario({
        id: Date.now().toString(),
        name: scenarioName,
        description: `Pitch to ${currentRetailer?.name}`,
        targetRetailerId: selectedRetailer,
        targetProductIds: [selectedProduct],
        storeCount: targetStoreCount,
        promoWeeks,
        promoLiftMultiplier: 1 + (promoLift/100),
        incrementalRevenue: promoRevenue,
        incrementalProfit: promoProfit
    });
    alert('Scenario Saved!');
  };

  const channel = currentRetailer ? getRetailerChannel(currentRetailer.id) : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Controls */}
      <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Calculator size={20} /></div>
                <h2 className="text-xl font-bold text-slate-800">Configuration</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Scenario Name</label>
                    <input 
                      type="text" 
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all bg-slate-50 focus:bg-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Retailer</label>
                        <select 
                            value={selectedRetailer}
                            onChange={(e) => setSelectedRetailer(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white outline-none"
                        >
                            {retailers.map(r => <option key={r.id} value={r.id}>{r.name} ({r.channel})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Product</label>
                        <select 
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white outline-none"
                        >
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className={`p-4 rounded-xl border flex justify-between items-center text-sm ${channel === 'DSD' ? 'bg-rose-50 border-rose-100 text-rose-900' : 'bg-blue-50 border-blue-100 text-blue-900'}`}>
                    <div className="flex flex-col">
                        <span className="font-bold">{channel} Account</span>
                        <span className="text-xs opacity-80">{currentRetailer?.paymentTerms}</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-lg">{(currentRetailer?.marginRequirement || 0) * 100}%</span>
                        <span className="text-xs opacity-80">Req. Margin</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1">
            <h3 className="font-bold text-slate-700 text-sm flex items-center mb-6">
                <TrendingUp size={18} className="mr-2 text-slate-400" /> Simulation Variables
            </h3>
            
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-600 font-medium">Store Count</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{targetStoreCount}</span>
                    </div>
                    <input 
                        type="range" min="10" max="500" step="10"
                        value={targetStoreCount}
                        onChange={(e) => setTargetStoreCount(parseInt(e.target.value))}
                        className="w-full accent-rose-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer hover:bg-slate-200 transition-colors"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-600 font-medium">Promo Duration</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{promoWeeks} weeks</span>
                    </div>
                    <input 
                        type="range" min="0" max="12" step="1"
                        value={promoWeeks}
                        onChange={(e) => setPromoWeeks(parseInt(e.target.value))}
                        className="w-full accent-rose-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer hover:bg-slate-200 transition-colors"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-600 font-medium">Est. Lift %</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{promoLift}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="200" step="5"
                        value={promoLift}
                        onChange={(e) => setPromoLift(parseInt(e.target.value))}
                        className="w-full accent-rose-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer hover:bg-slate-200 transition-colors"
                    />
                </div>
            </div>

            <button 
                onClick={handleSave}
                className="w-full mt-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95"
            >
                <Save size={18} />
                <span>Save Scenario</span>
            </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">Financial Projection</h3>
                    <p className="text-slate-400 text-sm">Revenue vs. Profit Analysis</p>
                </div>
                <div className="flex space-x-4 text-xs font-medium">
                    <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span> Revenue</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span> Profit</div>
                </div>
             </div>
             
             <div className="flex-1 w-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={60}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{fontSize: 14, fontWeight: 600, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tickFormatter={(val) => `$${val/1000}k`} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc', radius: 8}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                            formatter={(val: number) => [formatCurrency(val)]} 
                        />
                        <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-700 uppercase font-bold tracking-wider">Incremental Profit</p>
                    <p className="text-3xl font-bold text-emerald-800 mt-2">+{formatCurrency(promoProfit)}</p>
                    <p className="text-xs text-emerald-600 mt-1 opacity-80">Net impact to bottom line</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-700 uppercase font-bold tracking-wider">Total Revenue Lift</p>
                    <div className="flex items-center text-blue-900 mt-2">
                        <ArrowRight size={24} className="text-blue-600 mr-2" />
                        <span className="text-3xl font-bold">{liftPercentage.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1 opacity-80">Top line growth</p>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
             <div>
                 <div className="flex items-center space-x-2 mb-1">
                    <Info size={16} className="text-slate-400" />
                    <h4 className="font-bold text-sm">Retailer Margin Check</h4>
                 </div>
                 <p className="text-xs text-slate-400">Ensure pitch meets buyer requirements</p>
             </div>
             
             <div className="flex space-x-8 text-right">
                  <div>
                      <span className="text-slate-500 block text-xs uppercase tracking-wider">Wholesale</span>
                      <span className="font-mono text-lg">${currentProduct?.wholesalePrice.toFixed(2)}</span>
                  </div>
                  <div>
                      <span className="text-slate-500 block text-xs uppercase tracking-wider">MSRP</span>
                      <span className="font-mono text-lg">${currentProduct?.msrp.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-800 px-4 py-1 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Margin %</span>
                      <span className="font-bold text-xl text-emerald-400">
                        {((1 - (currentProduct?.wholesalePrice || 0) / (currentProduct?.msrp || 1)) * 100).toFixed(1)}%
                      </span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};