import React from 'react';
import { TrendingUp, ShoppingCart, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MARKET_DATA } from '../constants';
import { PageHeader } from './common/PageHeader';
import { Tooltip } from './common/Tooltip';

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

      {/* Methodology Note */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm text-blue-900 mb-4">
        <p className="font-bold mb-1">📊 Note on Revenue Calculations</p>
        <p>Market revenues include direct store sales, distributor pipeline fill, and indirect sales through regional wholesalers. Velocity figures represent direct store movement only. This explains revenue values exceeding simple velocity × stores calculations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MARKET_DATA.map((market, index) => (
          <div key={market.id} className="market-card">
            {/* Rank Badge */}
            <div className="market-rank">
                {index + 1}
            </div>

            {/* Market Info */}
            <div className="market-info">
              <div className="market-header">
                <h3 className="market-name">{market.name}</h3>
                {market.growth > 30 && (
                  <span className="market-badge">
                    Hot Market
                  </span>
                )}
              </div>
              
              <div className="market-meta">
                <span className="market-meta-item">
                  <MapPin size={16} />
                  {market.storeCount} Stores
                </span>
                <span className="market-meta-item">
                  <TrendingUp size={16} />
                  {market.share}% Share
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="market-metrics">
                <div className="market-metric">
                    <span className="metric-label">Revenue</span>
                    <span className="metric-value">${(market.revenue / 1000).toFixed(1)}k</span>
                </div>
                
                <div className="market-metric">
                    <span className="metric-label inline-flex items-center">
                        Velocity
                        <Tooltip content="Units per Store per Week - the average number of units sold per store location per week in this market." />
                    </span>
                    <span className="metric-value">{market.velocity}</span>
                    <span className="metric-unit">U/S/W</span>
                </div>
                
                <div className="market-metric">
                    <span className="metric-label">Growth</span>
                    <span className="metric-value" style={{ color: market.growth >= 0 ? '#00D084' : '#E53935' }}>
                        {market.growth >= 0 ? <ArrowUpRight size={20} className="inline mr-1" /> : <ArrowDownRight size={20} className="inline mr-1" />}
                        {Math.abs(market.growth)}%
                    </span>
                </div>
                
                <div className="market-metric">
                    <span className="metric-label">Top Rival</span>
                    <span className="competitor-name" title={market.topCompetitor}>{market.topCompetitor}</span>
                    <span className="competitor-growth">+{market.competitorGrowth}%</span>
                </div>
            </div>

            {/* Key Retailers */}
            <div className="market-retailers">
                 <span className="retailers-label">Key Retailers</span>
                 {market.retailers.map((r, i) => {
                    const match = r.match(/(.*) \((\d+)\)/);
                    const name = match ? match[1] : r;
                    const count = match ? match[2] : '';
                    
                    return (
                        <div key={i} className="retailer-item">
                            <span>{name}</span>
                            {count && <span className="retailer-count">{count}</span>}
                        </div>
                    );
                 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
