import React from 'react';
import { TrendingUp, ShoppingCart, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MARKET_DATA } from '../constants';
import { PageHeader } from './common/PageHeader';

export const MarketPerformance: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <PageHeader 
        number="04" 
        title="Market Performance" 
        subtitle="Top 5 Markets by Revenue & Velocity" 
        action={
            <div className="bg-white px-4 py-2 rounded-xl border-2 border-slate-200 shadow-sm text-sm text-slate-600 font-bold">
              Total Analyzed: 12 Markets
            </div>
        }
      />

      <div className="grid grid-cols-1 gap-6">
        {MARKET_DATA.map((market, index) => (
          <div key={market.id} className="bg-white rounded-[24px] border-3 border-black p-8 transition-all hover:-translate-y-1 hover:shadow-xl group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              
              {/* Market Header */}
              <div className="flex items-start space-x-6 lg:w-1/3">
                <div className="bg-slate-900 text-white p-4 rounded-2xl font-black text-2xl w-16 h-16 flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-black font-display text-slate-900 flex items-center gap-3">
                    {market.name}
                    {market.growth > 30 && (
                      <span className="bg-rd-green/10 text-rd-green text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold border border-rd-green/20">
                        Hot Market
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm font-bold text-slate-500">
                    <span className="flex items-center"><MapPin size={16} className="mr-1.5" /> {market.storeCount} Stores</span>
                    <span className="flex items-center"><TrendingUp size={16} className="mr-1.5" /> {market.share}% Share</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Revenue</div>
                    <div className="text-xl font-black text-slate-900">${(market.revenue / 1000).toFixed(1)}K</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Velocity</div>
                    <div className="text-xl font-black text-slate-900">{market.velocity} <span className="text-xs text-slate-400 font-medium">U/S/W</span></div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Growth</div>
                    <div className={`text-xl font-black flex items-center ${market.growth >= 0 ? 'text-rd-green' : 'text-rd-primary'}`}>
                        {market.growth >= 0 ? <ArrowUpRight size={20} className="mr-1" /> : <ArrowDownRight size={20} className="mr-1" />}
                        {Math.abs(market.growth)}%
                    </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Top Rival</div>
                    <div className="text-sm font-bold text-slate-700 truncate" title={market.topCompetitor}>
                        {market.topCompetitor}
                    </div>
                    <div className="text-xs text-rd-primary font-bold">+{market.competitorGrowth}%</div>
                </div>
              </div>

              {/* Retailer Context */}
              <div className="lg:w-1/4 lg:border-l-2 border-slate-100 lg:pl-8">
                 <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center tracking-wider">
                    <ShoppingCart size={12} className="mr-1.5" /> Key Retailers
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {market.retailers.map((r, i) => (
                        <span key={i} className="inline-block bg-white border-2 border-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-lg">
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
