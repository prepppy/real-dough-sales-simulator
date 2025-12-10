import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { ExecutiveOverview } from './components/ExecutiveOverview'; // New Import
import { Dashboard } from './components/Dashboard';
import { MapPanel } from './components/MapPanel';
import { ScenarioBuilder } from './components/ScenarioBuilder';
import { RetailerTable } from './components/RetailerTable';
import { ProjectionsView } from './components/ProjectionsView';
import { LayoutDashboard, Map as MapIcon, Table, Calculator, Filter, Download, Pizza, Store as StoreIcon, MonitorPlay, DollarSign, TrendingUp, PieChart } from 'lucide-react'; // Added PieChart
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MainLayout: React.FC = () => {
  const { state, setFilter, scenarios, filteredStores } = useSimulation();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DASHBOARD' | 'MAP' | 'SCENARIO' | 'TABLE' | 'PROJECTIONS'>('OVERVIEW'); // Added OVERVIEW
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
    <div className="flex h-screen w-full bg-stone-100 font-sans text-slate-800 overflow-hidden">
        {/* Sidebar - Hidden in Presentation Mode */}
        <aside className={`${presentationMode ? '-ml-72' : 'w-20 lg:w-72'} bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out shadow-xl z-30`}>
            <div className="p-6 flex items-center space-x-4 border-b border-slate-800/50">
                <div className="bg-gradient-to-br from-red-600 to-red-800 p-2.5 rounded-xl shadow-lg">
                    <Pizza size={28} className="text-white" />
                </div>
                <div className={`hidden lg:block transition-opacity duration-300 ${presentationMode ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="font-bold text-xl tracking-tight block">Real Dough</span>
                  <span className="text-xs text-slate-400 font-medium tracking-wide">Sales Simulator v2.0</span>
                </div>
            </div>
            
            <nav className="flex-1 py-6 space-y-2 px-3">
                <NavButton 
                    active={activeTab === 'OVERVIEW'} 
                    onClick={() => setActiveTab('OVERVIEW')} 
                    icon={<PieChart size={20} />} 
                    label="Executive Overview" 
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'DASHBOARD'} 
                    onClick={() => setActiveTab('DASHBOARD')} 
                    icon={<LayoutDashboard size={20} />} 
                    label="Command Center" 
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'PROJECTIONS'} 
                    onClick={() => setActiveTab('PROJECTIONS')} 
                    icon={<TrendingUp size={20} />} 
                    label="2026 Projections" 
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'MAP'} 
                    onClick={() => setActiveTab('MAP')} 
                    icon={<MapIcon size={20} />} 
                    label="Distribution Map" 
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'SCENARIO'} 
                    onClick={() => setActiveTab('SCENARIO')} 
                    icon={<Calculator size={20} />} 
                    label="Scenario Builder" 
                    collapsed={presentationMode}
                />
                <NavButton 
                    active={activeTab === 'TABLE'} 
                    onClick={() => setActiveTab('TABLE')} 
                    icon={<Table size={20} />} 
                    label="Store Data" 
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
                            {scenarios.map(s => <li key={s.id} className="truncate flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div> {s.name}</li>)}
                        </ul>
                    )}
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-500">
            
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

                    {/* Channel Selector */}
                    <div className="flex items-center space-x-3 bg-white px-1 py-1 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex bg-slate-100/50 rounded-lg p-1">
                            {['ALL', 'DSD', 'National Account'].map((opt) => (
                                <button 
                                    key={opt}
                                    onClick={() => setFilter('selectedChannel', opt)}
                                    className={`px-4 py-1.5 text-xs rounded-md transition-all font-bold ${state.selectedChannel === opt 
                                        ? 'bg-white shadow text-slate-900 ring-1 ring-black/5' 
                                        : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {opt === 'National Account' ? 'National' : opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors cursor-pointer">
                        <Filter size={18} className="text-slate-400 group-hover:text-blue-500" />
                        <select 
                            className="bg-transparent text-sm font-semibold outline-none text-slate-700 cursor-pointer min-w-[120px]"
                            value={state.selectedState}
                            onChange={(e) => setFilter('selectedState', e.target.value)}
                        >
                            <option value="ALL">All Regions</option>
                            <option value="IL">Illinois</option>
                            <option value="WI">Wisconsin</option>
                            <option value="MN">Minnesota</option>
                            <option value="IA">Iowa</option>
                            <option value="MO">Missouri</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="NC">North Carolina</option>
                            <option value="CA">California</option>
                            <option value="TX">Texas</option>
                        </select>
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
            <div id="app-content" className="flex-1 overflow-auto bg-slate-50 p-8 custom-scrollbar">
                {activeTab === 'OVERVIEW' && <ExecutiveOverview />}
                {activeTab === 'DASHBOARD' && <Dashboard />}
                {activeTab === 'PROJECTIONS' && <ProjectionsView />}
                {activeTab === 'MAP' && <MapPanel />}
                {activeTab === 'SCENARIO' && <ScenarioBuilder />}
                {activeTab === 'TABLE' && <RetailerTable />}
            </div>

        </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; collapsed: boolean }> = ({ active, onClick, icon, label, collapsed }) => (
    <button 
        onClick={onClick}
        title={collapsed ? label : ''}
        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${active ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
    >
        <div className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'}>{icon}</div>
        {!collapsed && <span className="hidden lg:block font-semibold text-sm tracking-wide">{label}</span>}
    </button>
);

const App: React.FC = () => {
    return (
        <SimulationProvider>
            <MainLayout />
        </SimulationProvider>
    );
}

export default App;