import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="inline-flex items-center text-slate-400 hover:text-slate-600 transition-colors ml-1"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="More information"
      >
        {children || <Info size={14} />}
      </button>
      
      {isVisible && (
        <div className="absolute z-50 w-64 px-4 py-3 text-sm font-medium text-white bg-slate-900 rounded-xl shadow-xl bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none">
          <div className="relative">
            {content}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
