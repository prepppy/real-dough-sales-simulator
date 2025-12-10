import React from 'react';
import { TrendingUp, Users, ShoppingCart, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MARKET_DATA } from '../constants';

export const MarketPerformance: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Market Performance</h2>
          <p className="text-slate-500">Top 5 Markets by Revenue & Velocity Contribution</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Total Analyzed Markets:</span> 12
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MARKET_DATA.map((market, index) => (
          <div key={market.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Market Header */}
              <div className="flex items-start space-x-4 lg:w-1/4">
                <div className="bg-slate-100 p-3 rounded-lg text-slate-600 font-bold text-xl w-12 h-12 flex items-center justify-center border border-slate-200">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {market.name}
                    {market.growth > 30 && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                        Hot Market
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500">
                    <span className="flex items-center"><MapPin size={14} className="mr-1" /> {market.storeCount} Stores</span>
                    <span className="flex items-center"><TrendingUp size={14} className="mr-1" /> {market.share}% Share</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium uppercase">Revenue</div>
                    <div className="text-lg font-bold text-slate-800">${(market.revenue / 1000).toFixed(1)}K</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium uppercase">Velocity (U/S/W)</div>
                    <div className="text-lg font-bold text-slate-800">{market.velocity}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium uppercase">Growth (YoY)</div>
                    <div className={`text-lg font-bold flex items-center ${market.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {market.growth >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                        {Math.abs(market.growth)}%
                    </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-xs text-slate-400 font-medium uppercase">Competitor</div>
                    <div className="text-sm font-semibold text-slate-700 truncate" title={market.topCompetitor}>
                        {market.topCompetitor}
                    </div>
                    <div className="text-xs text-red-500 font-medium">+{market.competitorGrowth}%</div>
                </div>
              </div>

              {/* Retailer Context */}
              <div className="lg:w-1/4 border-l border-slate-100 lg:pl-6">
                 <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center">
                    <ShoppingCart size={12} className="mr-1.5" /> Key Retailers
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {market.retailers.map((r, i) => (
                        <span key={i} className="inline-block bg-white border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded shadow-sm">
                            {r}
                        </span>
                    ))}
                 </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
