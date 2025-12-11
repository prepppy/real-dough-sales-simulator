import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { RoyaltyDashboard } from './components/RoyaltyDashboard';
import { Dashboard } from './components/Dashboard';
import { MarketPerformance } from './components/MarketPerformance';
import { SkuPerformance } from './components/SkuPerformance';
import { MapPanel } from './components/MapPanel';
import { ScenarioBuilder } from './components/ScenarioBuilder';
import { RetailerTable } from './components/RetailerTable';
import { ProjectionsView } from './components/ProjectionsView';
import { LayoutDashboard, Map as MapIcon, Table, Calculator, Pizza, MonitorPlay, TrendingUp, PieChart, Banknote, BarChart3, Package } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { scenarios } = useSimulation();
  
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ROYALTY' | 'RETAILER_PERF' | 'MARKET_PERF' | 'SKU_PERF' | 'PROJECTIONS' | 'MAP' | 'SCENARIO' | 'STORE_PERF'>('OVERVIEW'); 
  const [presentationMode, setPresentationMode] = useState(false);

  return (
    <div className="flex h-screen w-full bg-bg-primary font-sans text-slate-800 overflow-hidden">
        {/* Sidebar - Hidden in Presentation Mode */}
        <aside className={`${presentationMode ? '-ml-72' : 'w-[280px]'} sidebar flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out shadow-xl z-30`}>
            {/* Brand Section */}
            <div className="brand-section">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-rd-primary p-2 rounded-xl shadow-lg inline-block">
                        <Pizza size={24} className="text-white" />
                    </div>
                </div>
                <h3>Real Dough</h3>
                <p className="subtitle">Sales Dashboard v2.0</p>
            </div>
            
            <nav className="flex-1 overflow-y-auto custom-scrollbar">
                <NavButton 
                    active={activeTab === 'OVERVIEW'} 
                    onClick={() => setActiveTab('OVERVIEW')} 
                    icon={<PieChart size={20} />} 
                    label="Executive Overview" 
                    number="01"
                    dataPage="executive-overview"
                />
                <NavButton 
                    active={activeTab === 'ROYALTY'} 
                    onClick={() => setActiveTab('ROYALTY')} 
                    icon={<Banknote size={20} />} 
                    label="Royalty Dashboard" 
                    number="02"
                    dataPage="royalty-dashboard"
                />
                <NavButton 
                    active={activeTab === 'RETAILER_PERF'} 
                    onClick={() => setActiveTab('RETAILER_PERF')} 
                    icon={<LayoutDashboard size={20} />} 
                    label="Retailer Performance" 
                    number="03"
                    dataPage="retailer-performance"
                />
                <NavButton 
                    active={activeTab === 'MARKET_PERF'} 
                    onClick={() => setActiveTab('MARKET_PERF')} 
                    icon={<BarChart3 size={20} />} 
                    label="Market Performance" 
                    number="04"
                    dataPage="market-performance"
                />
                <NavButton 
                    active={activeTab === 'SKU_PERF'} 
                    onClick={() => setActiveTab('SKU_PERF')} 
                    icon={<Package size={20} />} 
                    label="SKU Performance" 
                    number="05"
                    dataPage="sku-performance"
                />
                <NavButton 
                    active={activeTab === 'PROJECTIONS'} 
                    onClick={() => setActiveTab('PROJECTIONS')} 
                    icon={<TrendingUp size={20} />} 
                    label="2026 Forecast" 
                    number="06"
                    dataPage="2026-forecast"
                />
                <NavButton 
                    active={activeTab === 'MAP'} 
                    onClick={() => setActiveTab('MAP')} 
                    icon={<MapIcon size={20} />} 
                    label="Distribution Map" 
                    number="07"
                    dataPage="distribution-map"
                />
                <NavButton 
                    active={activeTab === 'SCENARIO'} 
                    onClick={() => setActiveTab('SCENARIO')} 
                    icon={<Calculator size={20} />} 
                    label="Scenario Builder" 
                    number="08"
                    dataPage="scenario-builder"
                />
                <NavButton 
                    active={activeTab === 'STORE_PERF'} 
                    onClick={() => setActiveTab('STORE_PERF')} 
                    icon={<Table size={20} />} 
                    label="Store Data" 
                    number="09"
                    dataPage="store-data"
                />
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-4 text-xs text-slate-400 border border-white/10">
                    <p className="font-bold text-slate-300 mb-2 uppercase tracking-wider text-[10px]">Saved Scenarios</p>
                    {scenarios.length === 0 ? (
                        <p className="italic opacity-50">No active scenarios.</p>
                    ) : (
                        <ul className="space-y-2">
                            {scenarios.map(s => <li key={s.id} className="truncate flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-rd-green mr-2"></div> {s.name}</li>)}
                        </ul>
                    )}
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-500 bg-bg-primary">
            
            {/* Header */}
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 flex-shrink-0 z-20">
                
                {/* Left Controls */}
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={() => setPresentationMode(!presentationMode)}
                        className={`p-2 rounded-lg transition-colors ${presentationMode ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
                        title="Toggle Presentation Mode"
                    >
                        <MonitorPlay size={20} />
                    </button>

                    <div className="h-8 w-px bg-slate-200"></div>

                    {/* Brand Filter Label (Visual Only for now) */}
                    <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Brand:</span>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-rd-primary rounded-full animate-pulse"></div>
                            <span className="text-sm font-bold text-slate-800">Real Dough Pizza Co.</span>
                        </div>
                    </div>
                </div>

            </header>

            {/* Scrollable Viewport */}
            <div id="app-content" className="flex-1 overflow-auto bg-bg-primary p-8 custom-scrollbar">
                {activeTab === 'OVERVIEW' && <ExecutiveOverview />}
                {activeTab === 'ROYALTY' && <RoyaltyDashboard />}
                {activeTab === 'RETAILER_PERF' && <Dashboard />}
                {activeTab === 'MARKET_PERF' && <MarketPerformance />}
                {activeTab === 'SKU_PERF' && <SkuPerformance />}
                {activeTab === 'PROJECTIONS' && <ProjectionsView />}
                {activeTab === 'MAP' && <MapPanel />}
                {activeTab === 'SCENARIO' && <ScenarioBuilder />}
                {activeTab === 'STORE_PERF' && <RetailerTable />}
            </div>

        </main>
    </div>
  );
};

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    number: string;
    dataPage: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, number, dataPage }) => {
    return (
        <button 
            onClick={onClick}
            data-page={dataPage}
            className={`nav-item ${active ? 'active' : ''}`}
        >
            <span className="nav-number">{number}</span>
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
        </button>
    );
};

const App: React.FC = () => {
    return (
        <SimulationProvider>
            <MainLayout />
        </SimulationProvider>
    );
}

export default App;