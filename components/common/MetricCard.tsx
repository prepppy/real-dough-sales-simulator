import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  context?: string;
  color?: 'red' | 'orange' | 'purple' | 'blue' | 'green' | 'yellow';
  size?: 'normal' | 'mega';
  fullWidth?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  prefix = '', 
  suffix = '',
  trend, 
  context, 
  color = 'red',
  size = 'normal',
  fullWidth = false
}) => {
  
  const accentColor = {
    red: 'bg-rd-primary',
    orange: 'bg-rd-secondary',
    purple: 'bg-rd-purple',
    blue: 'bg-rd-blue',
    green: 'bg-rd-green',
    yellow: 'bg-rd-yellow',
  }[color];

  return (
    <div className={`metric-card bg-white rounded-[24px] border-3 border-black p-8 relative overflow-hidden flex flex-col justify-between h-full ${size === 'mega' ? 'lg:col-span-2' : ''} ${fullWidth ? 'w-full' : ''}`}>
      <div className={`absolute top-0 left-0 right-0 h-2 ${accentColor}`}></div>
      
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        {trend && (
          <span className={`${trend.isPositive ? 'bg-rd-green/10 text-rd-green' : 'bg-rd-primary/10 text-rd-primary'} text-xs font-bold px-3 py-1 rounded-full`}>
            {trend.value}
          </span>
        )}
      </div>

      <div className="flex items-baseline space-x-1 mb-2">
        {prefix && <span className={`font-bold text-slate-400 ${size === 'mega' ? 'text-4xl' : 'text-2xl'}`}>{prefix}</span>}
        <span className={`font-black font-display text-slate-900 tracking-tighter ${size === 'mega' ? 'text-7xl lg:text-8xl' : 'text-4xl lg:text-5xl'}`}>
          {value}
        </span>
        {suffix && <span className="font-bold text-slate-400 text-xl">{suffix}</span>}
      </div>

      {(context || (trend && trend.label)) && (
        <p className="text-sm font-bold text-slate-500 mt-auto">
          {context || trend?.label}
        </p>
      )}
    </div>
  );
};
