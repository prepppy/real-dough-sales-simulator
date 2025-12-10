export interface Product {
  id: string;
  name: string;
  wholesalePrice: number;
  msrp: number;
  cogs: number; // Now Fixed at $4.34 generally, but keep flexible
  caseCount: number;
  casesPerPallet: number;
}

export type RetailerChannel = 'DSD' | 'Warehouse' | 'National Account'; // Updated 'Warehouse' based on new docs

export interface Retailer {
  id: string;
  name: string;
  channel: RetailerChannel;
  marginRequirement: number; // e.g., 0.35 for 35%
  paymentTerms: string;
  regionFocus: string;
}

export interface Store {
  id: string;
  retailerId: string;
  name: string;
  lat: number;
  lng: number;
  state: string;
  currentSkuCount: number;
  baseVelocity: number; 
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  targetRetailerId: string;
  targetProductIds: string[];
  storeCount: number;
  promoWeeks: number;
  promoLiftMultiplier: number; 
  incrementalRevenue: number;
  incrementalProfit: number;
  // Custom Pricing Overrides
  customWholesalePrice?: number; // ASP (Average Selling Price) to Retailer
  customMSRP?: number;
  customCOGS?: number; // $4.34 Fixed
  slottingFees?: number;
  royaltyRate?: number; // Deprecated in favor of calculated Amount
  
  // New Fields for Detailed Analysis
  calculatedMarketing?: number; // 5% of ASP
  calculatedBaseRoyalty?: number; // Fixed $0.50
  calculatedAddlRoyalty?: number; // Variable
  calculatedNetMarginDollars?: number;
  calculatedNetMarginPercent?: number;
}

export interface GlobalState {
  selectedChannel: 'ALL' | RetailerChannel;
  selectedState: string | 'ALL';
  selectedRetailer: string | 'ALL';
  mapMode: 'PINS' | 'HEATMAP';
  metricMode: 'REVENUE' | 'PROFIT'; 
  presentationMode: boolean; 
}
