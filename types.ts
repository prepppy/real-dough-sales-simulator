export interface Product {
  id: string;
  name: string;
  wholesalePrice: number;
  msrp: number;
  cogs: number; // Cost of Goods Sold
  caseCount: number;
  casesPerPallet: number;
  defaultRoyaltyRate: number; // New: Percentage paid to brand/IP holder
}

export type RetailerChannel = 'DSD' | 'National Account';

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
  baseVelocity: number; // Units per store per week (UPSPW)
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
  customWholesalePrice?: number;
  customMSRP?: number;
  customCOGS?: number;
  slottingFees?: number;
  royaltyRate?: number; // New
}

export interface GlobalState {
  selectedChannel: 'ALL' | RetailerChannel;
  selectedState: string | 'ALL';
  selectedRetailer: string | 'ALL';
  mapMode: 'PINS' | 'HEATMAP';
  metricMode: 'REVENUE' | 'PROFIT'; 
  presentationMode: boolean; 
}
