import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Product, Retailer, Store, Scenario, GlobalState, RetailerChannel } from '../types';
import { PRODUCTS, RETAILERS, STORES } from '../constants';

interface SimulationContextType {
  products: Product[];
  retailers: Retailer[];
  stores: Store[];
  filteredStores: Store[];
  state: GlobalState;
  scenarios: Scenario[];
  setFilter: (key: keyof GlobalState, value: any) => void;
  updateStore: (storeId: string, updates: Partial<Store>) => void;
  addScenario: (scenario: Scenario) => void;
  formatCurrency: (value: number) => string;
  getRetailerChannel: (retailerId: string) => RetailerChannel;
  calculateStoreFinancials: (store: Store) => { revenue: number; profit: number };
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [retailers] = useState<Retailer[]>(RETAILERS);
  const [stores, setStores] = useState<Store[]>(STORES);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const [globalState, setGlobalState] = useState<GlobalState>({
    selectedChannel: 'ALL',
    selectedState: 'ALL',
    selectedRetailer: 'ALL',
    mapMode: 'PINS',
    metricMode: 'REVENUE',
    presentationMode: false,
  });

  const getRetailerChannel = (retailerId: string): RetailerChannel => {
    return retailers.find(r => r.id === retailerId)?.channel || 'National Account';
  };

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      if (globalState.selectedState !== 'ALL' && store.state !== globalState.selectedState) return false;
      if (globalState.selectedRetailer !== 'ALL' && store.retailerId !== globalState.selectedRetailer) return false;
      if (globalState.selectedChannel !== 'ALL') {
        const channel = getRetailerChannel(store.retailerId);
        if (channel !== globalState.selectedChannel) return false;
      }
      return true;
    });
  }, [stores, globalState, retailers]);

  const setFilter = (key: keyof GlobalState, value: any) => {
    setGlobalState(prev => ({ ...prev, [key]: value }));
  };

  const updateStore = (storeId: string, updates: Partial<Store>) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, ...updates } : s));
  };

  const addScenario = (scenario: Scenario) => {
    setScenarios(prev => [...prev, scenario]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Centralized Financial Logic
  const calculateStoreFinancials = (store: Store) => {
    const avgPrice = products.reduce((acc, p) => acc + p.wholesalePrice, 0) / products.length;
    const avgCogs = products.reduce((acc, p) => acc + p.cogs, 0) / products.length;
    const avgMargin = avgPrice - avgCogs;

    const annualUnits = store.baseVelocity * store.currentSkuCount * 52;
    
    return {
        revenue: annualUnits * avgPrice,
        profit: annualUnits * avgMargin
    };
  };

  return (
    <SimulationContext.Provider value={{
      products,
      retailers,
      stores,
      filteredStores,
      state: globalState,
      scenarios,
      setFilter,
      updateStore,
      addScenario,
      formatCurrency,
      getRetailerChannel,
      calculateStoreFinancials
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
