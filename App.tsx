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
import { LayoutDashboard, Map as MapIcon, Table, Calculator, Filter, Download, Pizza, Store as StoreIcon, MonitorPlay, DollarSign, TrendingUp, PieChart, Banknote, BarChart3, Package } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MainLayout: React.FC = () => {
  const { state, setFilter, scenarios, filteredStores } = useSimulation();
  
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ROYALTY' | 'RETAILER_PERF' | 'MARKET_PERF' | 'SKU_PERF' | 'PROJECTIONS' | 'MAP' | 'SCENARIO' | 'STORE_PERF'>('OVERVIEW'); 
  const [isExporting, setIsExporting] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const element = document.getElementById('app-content');
    if (element) {
        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            // Add Header to PDF
            pdf.setFillColor(20, 20, 20);
            pdf.rect(0, 0, pdfWidth, 20, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(16);
            pdf.text('Real Dough Pizza Co. - Territory Analysis', 10, 13);
            
            pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
            pdf.save('RealDough_PitchDeck.pdf');
        } catch (e) {
            console.error(e);
            alert('Export failed, check console.');
        }
    }
    setIsExporting(false);
  };

  const toggleMetric = () => {
    setFilter('metricMode', state.metricMode === 'REVENUE' ? 'PROFIT' : 'REVENUE');
  };

  return (
    <div className="flex h-screen w-full bg-bg-primary font-sans text-slate-800 overflow-hidden">
        {/* Sidebar - Hidden in Presentation Mode */}
        <aside className={`${presentationMode ? '-ml-72' : 'w-20 lg:w-72'} bg-bg-dark text-white flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out shadow-xl z-30`}>
            <div className="p-6 flex items-center space-x-4 border-b border-slate-800/50">
                <div className="bg-rd-primary p-2.5 rounded-xl shadow-lg">
                    <Pizza size={28} className="text-white" />
                </div>
                <div className={`hidden lg:block transition-opacity duration-300 ${presentationMode ? 'opacity-0' : 'opacity-100'}`}>
                  <h1 className="font-display font-bold text-xl tracking-tight block">Real Dough</h1>
                  <span className="text-xs text-slate-400 font-medium tracking-wide">Sales Simulator v2.0</span>
                </div>
            </div>
            
            <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
                <NavButton 
                    active={activeTab === 'OVERVIEW'} 
                    onClick={() => setActiveTab('OVERVIEW')} 
                    icon={<PieChart size={20} />} 
                    label="Executive Overview" 
                    number="01"
                    color="red"
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'ROYALTY'} 
                    onClick={() => setActiveTab('ROYALTY')} 
                    icon={<Banknote size={20} />} 
                    label="Royalty Dashboard" 
                    number="02"
                    color="orange"
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'RETAILER_PERF'} 
                    onClick={() => setActiveTab('RETAILER_PERF')} 
                    icon={<LayoutDashboard size={20} />} 
                    label="Retailer Performance" 
                    number="03"
                    color="purple"
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'MARKET_PERF'} 
                    onClick={() => setActiveTab('MARKET_PERF')} 
                    icon={<BarChart3 size={20} />} 
                    label="Market Performance" 
                    number="04"
                    color="blue"
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'SKU_PERF'} 
                    onClick={() => setActiveTab('SKU_PERF')} 
                    icon={<Package size={20} />} 
                    label="SKU Performance" 
                    number="05"
                    color="green"
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'PROJECTIONS'} 
                    onClick={() => setActiveTab('PROJECTIONS')} 
                    icon={<TrendingUp size={20} />} 
                    label="2025 Forecast" 
                    number="06"
                    color="yellow"
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'MAP'} 
                    onClick={() => setActiveTab('MAP')} 
                    icon={<MapIcon size={20} />} 
                    label="Distribution Map" 
                    number="07"
                    color="pink" // Using pink for map as per plan
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'SCENARIO'} 
                    onClick={() => setActiveTab('SCENARIO')} 
                    icon={<Calculator size={20} />} 
                    label="Scenario Builder" 
                    number="08"
                    color="cyan" // Cyan isn't in config but we can handle it or use blue
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'STORE_PERF'} 
                    onClick={() => setActiveTab('STORE_PERF')} 
                    icon={<Table size={20} />} 
                    label="Store Data" 
                    number="09"
                    color="gray"
                    collapsed={presentationMode}
                />
            </nav>

            <div className="p-4 border-t border-slate-800/50">
                <div className="hidden lg:block bg-slate-800/50 rounded-xl p-4 text-xs text-slate-400 border border-slate-700/50">
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

                {/* Right Controls */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleMetric}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                            state.metricMode === 'PROFIT' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        <DollarSign size={16} />
                        <span>{state.metricMode === 'PROFIT' ? 'Net Profit' : 'Revenue'}</span>
                    </button>

                    {activeTab === 'MAP' && (
                        <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                             <button 
                                 onClick={() => setFilter('mapMode', 'PINS')}
                                 className={`px-3 py-1.5 text-xs rounded transition-all ${state.mapMode === 'PINS' ? 'bg-white shadow text-slate-800 font-bold' : 'text-slate-500'}`}
                             >
                                 Pins
                             </button>
                             <button 
                                 onClick={() => setFilter('mapMode', 'HEATMAP')}
                                 className={`px-3 py-1.5 text-xs rounded transition-all ${state.mapMode === 'HEATMAP' ? 'bg-white shadow text-slate-800 font-bold' : 'text-slate-500'}`}
                             >
                                 Heatmap
                             </button>
                        </div>
                    )}

                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"
                    >
                        <Download size={18} />
                        <span className="hidden md:inline">{isExporting ? 'Generating...' : 'Export One-Pager'}</span>
                    </button>
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
    color: string;
    collapsed: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, number, color, collapsed }) => {
    // Determine styles based on color prop
    let activeBg = 'bg-slate-800';
    let hoverColor = 'text-slate-400';
    let activeShadow = 'shadow-slate-900/20';

    if (color === 'red') { activeBg = 'bg-rd-primary'; hoverColor = 'hover:text-rd-primary'; activeShadow = 'shadow-rd-primary/30'; }
    if (color === 'orange') { activeBg = 'bg-rd-secondary'; hoverColor = 'hover:text-rd-secondary'; activeShadow = 'shadow-rd-secondary/30'; }
    if (color === 'purple') { activeBg = 'bg-rd-purple'; hoverColor = 'hover:text-rd-purple'; activeShadow = 'shadow-rd-purple/30'; }
    if (color === 'blue') { activeBg = 'bg-rd-blue'; hoverColor = 'hover:text-rd-blue'; activeShadow = 'shadow-rd-blue/30'; }
    if (color === 'green') { activeBg = 'bg-rd-green'; hoverColor = 'hover:text-rd-green'; activeShadow = 'shadow-rd-green/30'; }
    if (color === 'yellow') { activeBg = 'bg-rd-yellow'; hoverColor = 'hover:text-rd-yellow'; activeShadow = 'shadow-rd-yellow/30'; }
    // Add other color logic if needed, fallback to default for now

    return (
        <button 
            onClick={onClick}
            title={collapsed ? label : ''}
            className={`
                w-full flex items-center space-x-3 px-5 py-4 rounded-xl transition-all duration-200 group nav-item
                ${active 
                    ? `${activeBg} text-white shadow-lg ${activeShadow} font-bold` 
                    : `text-slate-400 hover:bg-slate-800/50 hover:text-white ${hoverColor}`
                }
            `}
        >
            <div className={`text-[10px] font-bold opacity-50 w-4 tabular-nums ${active ? 'text-white' : 'text-slate-600'}`}>
                {number}
            </div>
            <div className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'}>
                {icon}
            </div>
            {!collapsed && <span className="hidden lg:block font-medium text-sm tracking-wide">{label}</span>}
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