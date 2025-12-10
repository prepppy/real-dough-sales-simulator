import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Calculator, Save, ArrowRight, TrendingUp, Info, DollarSign, Percent } from 'lucide-react';
import { calculateBernatellosMargin } from '../utils/financials';

export const ScenarioBuilder: React.FC = () => {
  const { products, retailers, addScenario, formatCurrency, getRetailerChannel } = useSimulation();

  const [selectedRetailer, setSelectedRetailer] = useState<string>(retailers[0].id);
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0].id);
  const [targetStoreCount, setTargetStoreCount] = useState<number>(50);
  const [promoWeeks, setPromoWeeks] = useState<number>(4);
  const [promoLift, setPromoLift] = useState<number>(40); 
  const [scenarioName, setScenarioName] = useState('Q3 Pitch Scenario');

  // Custom Pricing State
  // "customWholesale" now represents the ASP (Average Selling Price) to the retailer
  const [customASP, setCustomASP] = useState<number>(0); 
  const [customMSRP, setCustomMSRP] = useState<number>(0);
  // COGS is now fixed at $4.34 usually, but we allow override
  const [customCOGS, setCustomCOGS] = useState<number>(4.34);
  const [slottingFees, setSlottingFees] = useState<number>(0);

  const currentRetailer = retailers.find(r => r.id === selectedRetailer);
  const currentProduct = products.find(p => p.id === selectedProduct);
  const currentChannel = currentRetailer?.channel === 'DSD' ? 'DSD' : 'Warehouse'; 
  
  // Reset defaults when product changes
  useEffect(() => {
    if (currentProduct) {
        setCustomASP(currentProduct.wholesalePrice); // Using wholesalePrice as default ASP
        setCustomMSRP(currentProduct.msrp);
        // Reset COGS to standard 4.34
        setCustomCOGS(4.34);
    }
  }, [currentProduct]);

  // Advanced Financial Logic via Utility
  const financials = calculateBernatellosMargin(customASP, currentChannel);
  
  // Scenario Aggregates
  const estimatedBaseVelocity = 12; // Units/week avg
  
  // Revenue = ASP * Units (Manufacturer Revenue)
  const annualBaseRevenue = estimatedBaseVelocity * targetStoreCount * customASP * 52;
  const promoRevenue = (estimatedBaseVelocity * targetStoreCount * customASP * promoWeeks * (promoLift / 100));
  const totalRevenue = annualBaseRevenue + promoRevenue;

  // Profit = Net Margin Dollars * Units
  const annualBaseProfitRaw = estimatedBaseVelocity * targetStoreCount * financials.netMarginDollars * 52;
  const promoProfit = (estimatedBaseVelocity * targetStoreCount * financials.netMarginDollars * promoWeeks * (promoLift / 100));
  
  // Net Profit = (Base Profit + Promo Profit) - Slotting Fees
  const totalProfit = annualBaseProfitRaw + promoProfit - slottingFees;

  // Lift
  const liftPercentage = annualBaseRevenue > 0 ? ((totalRevenue - annualBaseRevenue) / annualBaseRevenue) * 100 : 0;

  // Retailer Margin
  const retailerMarginAmt = customMSRP - customASP;
  const retailerMarginPercent = customMSRP > 0 ? (retailerMarginAmt / customMSRP) * 100 : 0;
  const isMarginCompliant = currentRetailer && (retailerMarginPercent / 100) >= currentRetailer.marginRequirement;

  const data = [
    { name: 'Baseline', Revenue: annualBaseRevenue, Profit: annualBaseProfitRaw },
    { name: 'With Promo', Revenue: totalRevenue, Profit: totalProfit },
  ];

  // Unit Economics Waterfall Data
  const unitEconomicsData = [
    { name: 'COGS', value: financials.cogs, fill: '#94a3b8' }, // Slate 400
    { name: 'Marketing', value: financials.marketing, fill: '#f472b6' }, // Pink 400
    { name: 'Royalty', value: financials.royalty.total, fill: '#f59e0b' }, // Amber 500
    { name: 'Bernatello\'s Net', value: financials.netMarginDollars, fill: '#10b981' }, // Emerald 500
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
        incrementalProfit: promoProfit - slottingFees, // Net incremental
        customWholesalePrice: customASP,
        customMSRP: customMSRP,
        customCOGS: customCOGS,
        slottingFees: slottingFees,
        royaltyRate: 0, // Unused
        
        // New Fields
        calculatedMarketing: financials.marketing,
        calculatedBaseRoyalty: financials.royalty.base,
        calculatedAddlRoyalty: financials.royalty.additional,
        calculatedNetMarginDollars: financials.netMarginDollars,
        calculatedNetMarginPercent: financials.netMarginPercent
    });
    alert('Scenario Saved!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Controls */}
      <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Calculator size={20} /></div>
                <h2 className="text-xl font-bold text-slate-800">Bernatello's Deal Config</h2>
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
                
                {/* Channel Indicator */}
                <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-500 flex justify-between">
                    <span>Active Channel Model:</span>
                    <span className="font-bold text-slate-800 uppercase">{currentChannel}</span>
                </div>

                {/* Pricing Inputs */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center">
                        <DollarSign size={16} className="mr-1" /> Pricing Structure
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Retail Price (MSRP)</label>
                            <input 
                                type="number" step="0.01"
                                value={customMSRP}
                                onChange={(e) => setCustomMSRP(parseFloat(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Sell Price (ASP)</label>
                            <input 
                                type="number" step="0.01"
                                value={customASP}
                                onChange={(e) => setCustomASP(parseFloat(e.target.value) || 0)}
                                className={`w-full p-2 border rounded-lg text-sm font-semibold text-slate-700 ${customASP < (currentChannel === 'DSD' ? 8.38 : 6.91) ? 'border-amber-300 bg-amber-50' : 'border-slate-200'}`}
                            />
                            {/* ASP Warning */}
                            {customASP < (currentChannel === 'DSD' ? 8.38 : 6.91) && (
                                <p className="text-[10px] text-amber-600 mt-1 font-medium">Below Min Tier: Base Royalty Only</p>
                            )}
                        </div>
                        <div className="col-span-2">
                             <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">Slotting Fees ($)</label>
                            <input 
                                type="number" step="100"
                                value={slottingFees}
                                onChange={(e) => setSlottingFees(parseFloat(e.target.value) || 0)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                            />
                        </div>
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
          
          {/* Top Card: Unit Economics Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">Distribution Economics</h3>
                    <p className="text-slate-400 text-sm">ASP Breakdown per Unit</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Bernatello's Net Margin</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(financials.netMarginDollars)}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{financials.netMarginPercent.toFixed(1)}% of ASP</p>
                </div>
             </div>
             
             {/* Stacked Bar Visual for Unit Econ */}
             <div className="relative h-16 w-full flex rounded-xl overflow-hidden font-bold text-white text-xs">
                {unitEconomicsData.map((item, i) => {
                    const pct = (item.value / customASP) * 100; // % of ASP, not MSRP for Dist view
                    return (
                        <div key={item.name} style={{ width: `${pct}%`, backgroundColor: item.fill }} className="flex flex-col justify-center items-center h-full relative group">
                            <span className="z-10 drop-shadow-md">${item.value.toFixed(2)}</span>
                            {/* Tooltip on hover */}
                            <div className="absolute -top-10 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                {item.name}: {pct.toFixed(1)}%
                            </div>
                        </div>
                    )
                })}
             </div>
             <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium px-1">
                <div className="flex items-center"><div className="w-2 h-2 bg-slate-400 rounded-full mr-1"></div> COGS</div>
                <div className="flex items-center"><div className="w-2 h-2 bg-pink-400 rounded-full mr-1"></div> Marketing (5%)</div>
                <div className="flex items-center"><div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div> Brand Royalty</div>
                <div className="flex items-center"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></div> Bernatello's Net</div>
             </div>
             
             {/* Detailed Breakdown Grid */}
             <div className="mt-6 grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div>
                    <span className="block text-[10px] uppercase tracking-wide text-slate-400">Fixed COGS</span>
                    <span className="font-mono text-sm font-bold text-slate-700">$4.34</span>
                </div>
                <div>
                    <span className="block text-[10px] uppercase tracking-wide text-slate-400">Marketing</span>
                    <span className="font-mono text-sm font-bold text-slate-700">${financials.marketing.toFixed(2)}</span>
                </div>
                <div>
                    <span className="block text-[10px] uppercase tracking-wide text-slate-400">Brand Royalty</span>
                    <div className="flex flex-col">
                        <span className="font-mono text-sm font-bold text-amber-600">${financials.royalty.total.toFixed(2)}</span>
                        <span className="text-[9px] text-amber-600/70">(${financials.royalty.base.toFixed(2)} Base + ${financials.royalty.additional.toFixed(2)} Add'l)</span>
                    </div>
                </div>
                <div>
                    <span className="block text-[10px] uppercase tracking-wide text-slate-400">Total Cost</span>
                    <span className="font-mono text-sm font-bold text-slate-900">${financials.totalCost.toFixed(2)}</span>
                </div>
             </div>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">Financial Projection</h3>
                    <p className="text-slate-400 text-sm">Revenue vs. Profit Analysis</p>
                </div>
                <div className="flex space-x-4 text-xs font-medium">
                    <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span> Manufacturer Revenue</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span> Net Profit</div>
                </div>
             </div>
             
             <div className="flex-1 w-full min-h-[250px]">
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
                    <p className="text-3xl font-bold text-emerald-800 mt-2">{promoProfit - slottingFees > 0 ? '+' : ''}{formatCurrency(promoProfit - slottingFees)}</p>
                    <p className="text-xs text-emerald-600 mt-1 opacity-80">Bernatello's bottom line impact</p>
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
                      <span className="text-slate-500 block text-xs uppercase tracking-wider">Target MSRP</span>
                      <span className="font-mono text-lg">${customMSRP.toFixed(2)}</span>
                  </div>
                  <div>
                      <span className="text-slate-500 block text-xs uppercase tracking-wider">Target ASP</span>
                      <span className="font-mono text-lg">${customASP.toFixed(2)}</span>
                  </div>
                  <div className={`bg-slate-800 px-4 py-1 rounded-lg border ${isMarginCompliant ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Retailer Margin %</span>
                      <span className={`font-bold text-xl ${isMarginCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                        {retailerMarginPercent.toFixed(1)}%
                      </span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
