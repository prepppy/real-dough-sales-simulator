import React from 'react';

interface PageHeaderProps {
  number: string;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ number, title, subtitle, action }) => {
  return (
    <div className="flex justify-between items-end mb-12">
        <div>
            <div className="flex items-center space-x-3 mb-2">
                <span className="text-4xl font-bold font-display text-slate-300">{number}</span>
                <h2 className="text-5xl font-bold text-slate-900 font-display">{title}</h2>
            </div>
            <p className="text-slate-500 text-lg font-medium">{subtitle}</p>
        </div>
        {action && <div>{action}</div>}
    </div>
  );
};
