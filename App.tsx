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

    const setMetricMode = (mode: 'REVENUE' | 'PROFIT') => {
        setFilter('metricMode', mode);
    };

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
                    icon={<PieChart />} 
                    label="Executive Overview" 
                    number="01"
                    dataPage="executive-overview"
                />
                <NavButton 
                    active={activeTab === 'ROYALTY'} 
                    onClick={() => setActiveTab('ROYALTY')} 
                    icon={<Banknote />} 
                    label="Royalty Dashboard" 
                    number="02"
                    dataPage="royalty-dashboard"
                />
                <NavButton 
                    active={activeTab === 'RETAILER_PERF'} 
                    onClick={() => setActiveTab('RETAILER_PERF')} 
                    icon={<LayoutDashboard />} 
                    label="Retailer Performance" 
                    number="03"
                    dataPage="retailer-performance"
                />
                <NavButton 
                    active={activeTab === 'MARKET_PERF'} 
                    onClick={() => setActiveTab('MARKET_PERF')} 
                    icon={<BarChart3 />} 
                    label="Market Performance" 
                    number="04"
                    dataPage="market-performance"
                />
                <NavButton 
                    active={activeTab === 'SKU_PERF'} 
                    onClick={() => setActiveTab('SKU_PERF')} 
                    icon={<Package />} 
                    label="SKU Performance" 
                    number="05"
                    dataPage="sku-performance"
                />
                <NavButton 
                    active={activeTab === 'PROJECTIONS'} 
                    onClick={() => setActiveTab('PROJECTIONS')} 
                    icon={<TrendingUp />} 
                    label="2025 Forecast" 
                    number="06"
                    dataPage="2025-forecast"
                />
                <NavButton 
                    active={activeTab === 'MAP'} 
                    onClick={() => setActiveTab('MAP')} 
                    icon={<MapIcon />} 
                    label="Distribution Map" 
                    number="07"
                    dataPage="distribution-map"
                />
                <NavButton 
                    active={activeTab === 'SCENARIO'} 
                    onClick={() => setActiveTab('SCENARIO')} 
                    icon={<Calculator />} 
                    label="Scenario Builder" 
                    number="08"
                    dataPage="scenario-builder"
                />
                <NavButton 
                    active={activeTab === 'STORE_PERF'} 
                    onClick={() => setActiveTab('STORE_PERF')} 
                    icon={<Table />} 
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

                {/* Right Controls */}
                <div className="flex items-center space-x-4">
                    <div className="view-mode-toggle">
                        <button 
                            className={`toggle-option ${state.metricMode === 'REVENUE' ? 'active' : ''}`}
                            onClick={() => setMetricMode('REVENUE')}
                        >
                            <span className="toggle-icon">💵</span>
                            <span className="toggle-label">Revenue</span>
                        </button>
                        
                        <button 
                            className={`toggle-option ${state.metricMode === 'PROFIT' ? 'active' : ''}`}
                            onClick={() => setMetricMode('PROFIT')}
                        >
                            <span className="toggle-icon">💰</span>
                            <span className="toggle-label">Royalty</span>
                        </button>
                    </div>

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