import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  total: number;
  color?: string; // tailwind bg color class
  pending?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, total, color = 'bg-rd-blue', pending = false }) => {
  const pct = Math.min(100, (current / total) * 100);
  
  return (
    <div>
        <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-slate-900">{label}</span>
            <span className="font-bold text-slate-500 tabular-nums">{current} <span className="text-slate-300">/</span> {total}</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
                className={`h-full ${pending ? 'bg-slate-300' : color} transition-all duration-1000 ease-out`} 
                style={{ width: `${pct}%` }}
            ></div>
        </div>
        {pending && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">🚀 Launching Q3 2025</p>}
    </div>
  );
};
