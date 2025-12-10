import { Product, Retailer, Store } from './types';

// Products with COGS added for Profitability Analysis
export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Wisco Kid', wholesalePrice: 4.50, msrp: 7.99, cogs: 2.10, caseCount: 12, casesPerPallet: 60, defaultRoyaltyRate: 0.05 },
  { id: 'p2', name: 'Peppin\' Ain\'t Easy', wholesalePrice: 5.00, msrp: 8.99, cogs: 2.25, caseCount: 12, casesPerPallet: 60, defaultRoyaltyRate: 0.05 },
  { id: 'p3', name: 'Lost in the Sausage', wholesalePrice: 5.50, msrp: 9.49, cogs: 2.60, caseCount: 12, casesPerPallet: 60, defaultRoyaltyRate: 0.05 },
  { id: 'p4', name: 'Curd Your Enthusiasm', wholesalePrice: 5.75, msrp: 9.99, cogs: 2.80, caseCount: 12, casesPerPallet: 60, defaultRoyaltyRate: 0.05 },
  { id: 'p5', name: 'Okie Dokie Artichokie', wholesalePrice: 6.00, msrp: 10.99, cogs: 3.10, caseCount: 10, casesPerPallet: 80, defaultRoyaltyRate: 0.05 },
];

export const RETAILERS: Retailer[] = [
  // DSD (Direct Store Distribution)
  { id: 'r_hyvee', name: 'Hy-Vee', channel: 'DSD', marginRequirement: 0.32, paymentTerms: 'Net 30', regionFocus: 'MIDWEST' },
  { id: 'r_meijer', name: 'Meijer', channel: 'DSD', marginRequirement: 0.34, paymentTerms: 'Net 45', regionFocus: 'MIDWEST_EAST' },
  { id: 'r_cashwise', name: 'Cash Wise', channel: 'DSD', marginRequirement: 0.30, paymentTerms: 'Net 15', regionFocus: 'UPPER_MIDWEST' },
  { id: 'r_woodmans', name: 'Woodman\'s', channel: 'DSD', marginRequirement: 0.28, paymentTerms: 'Net 15', regionFocus: 'WI_IL' },
  { id: 'r_festival', name: 'Festival Foods', channel: 'DSD', marginRequirement: 0.30, paymentTerms: 'Net 30', regionFocus: 'WI' },
  
  // National Accounts
  { id: 'r_sprouts', name: 'Sprouts', channel: 'National Account', marginRequirement: 0.38, paymentTerms: 'Net 60', regionFocus: 'NATIONAL_SCATTERED' },
  { id: 'r_ht', name: 'Harris Teeter', channel: 'National Account', marginRequirement: 0.36, paymentTerms: 'Net 45', regionFocus: 'MID_ATLANTIC' },
  { id: 'r_publix', name: 'Publix', channel: 'National Account', marginRequirement: 0.35, paymentTerms: 'Net 30', regionFocus: 'SOUTHEAST' },
  { id: 'r_costco', name: 'Costco', channel: 'National Account', marginRequirement: 0.14, paymentTerms: 'Net 30', regionFocus: 'NATIONAL_URBAN' },
];

const REGIONS: Record<string, { latMin: number, latMax: number, lngMin: number, lngMax: number, states: string[] }> = {
  MIDWEST: { latMin: 39, latMax: 43, lngMin: -96, lngMax: -90, states: ['IA', 'MO', 'IL', 'NE'] },
  MIDWEST_EAST: { latMin: 39, latMax: 44, lngMin: -88, lngMax: -83, states: ['MI', 'OH', 'IN', 'IL'] },
  UPPER_MIDWEST: { latMin: 44, latMax: 48, lngMin: -100, lngMax: -93, states: ['MN', 'ND', 'SD'] },
  WI_IL: { latMin: 42, latMax: 45, lngMin: -90, lngMax: -87, states: ['WI', 'IL'] },
  WI: { latMin: 43, latMax: 46, lngMin: -91, lngMax: -87, states: ['WI'] },
  MID_ATLANTIC: { latMin: 35, latMax: 39, lngMin: -81, lngMax: -76, states: ['NC', 'VA', 'MD'] },
  SOUTHEAST: { latMin: 26, latMax: 34, lngMin: -85, lngMax: -80, states: ['FL', 'GA', 'AL'] },
  NATIONAL_SCATTERED: { latMin: 30, latMax: 45, lngMin: -120, lngMax: -75, states: ['CA', 'TX', 'CO', 'AZ', 'GA'] },
  NATIONAL_URBAN: { latMin: 30, latMax: 45, lngMin: -118, lngMax: -74, states: ['CA', 'NY', 'IL', 'WA', 'TX'] },
};

const generateStores = (): Store[] => {
  const stores: Store[] = [];
  let idCounter = 0;

  RETAILERS.forEach(retailer => {
    let count = 50; 
    if (retailer.name === 'Hy-Vee') count = 285;
    if (retailer.name === 'Meijer') count = 260;
    if (retailer.name === 'Cash Wise') count = 17;
    if (retailer.name === 'Woodman\'s') count = 19;
    if (retailer.name === 'Festival Foods') count = 40;
    if (retailer.name === 'Sprouts') count = 150; 
    if (retailer.name === 'Harris Teeter') count = 100;
    if (retailer.name === 'Publix') count = 300; 
    if (retailer.name === 'Costco') count = 150; 

    const region = REGIONS[retailer.regionFocus];
    
    for (let i = 0; i < count; i++) {
      idCounter++;
      const lat = region.latMin + (Math.random() * (region.latMax - region.latMin));
      const lng = region.lngMin + (Math.random() * (region.lngMax - region.lngMin));
      const state = region.states[Math.floor(Math.random() * region.states.length)];
      
      let baseVel = Math.random() * 15 + 5;
      if (retailer.name === 'Costco') baseVel = Math.random() * 40 + 20;
      if (retailer.name === 'Woodman\'s') baseVel = Math.random() * 25 + 10;

      let skus = Math.floor(Math.random() * 5) + 1; 
      if (retailer.name === 'Costco') skus = 1; 
      
      stores.push({
        id: `s_${idCounter}`,
        retailerId: retailer.id,
        name: `${retailer.name} #${Math.floor(Math.random() * 900) + 100}`,
        lat,
        lng,
        state,
        currentSkuCount: skus,
        baseVelocity: baseVel, 
      });
    }
  });

  return stores;
};

export const STORES: Store[] = generateStores();

// Seed Data for 2026 Projections
export interface QuarterlyProjection {
  quarter: string;
  revenue: number;
  profit: number;
  activeStores: number;
  notes: string;
  growth: number;
}

export const PROJECTIONS_2026: QuarterlyProjection[] = [
  {
    quarter: 'Q1 2026',
    revenue: 4200000,
    profit: 1100000,
    activeStores: 1250,
    growth: 5.2,
    notes: "Post-holiday reset. Focus on DSD expansion in Midwest.",
  },
  {
    quarter: 'Q2 2026',
    revenue: 4850000,
    profit: 1350000,
    activeStores: 1380,
    growth: 15.5,
    notes: "Spring resets complete. New National Account (Sprouts) ramping up.",
  },
  {
    quarter: 'Q3 2026',
    revenue: 5600000,
    profit: 1550000,
    activeStores: 1450,
    growth: 15.4,
    notes: "Summer peak season. Costco rotation active.",
  },
  {
    quarter: 'Q4 2026',
    revenue: 6100000,
    profit: 1650000,
    activeStores: 1520,
    growth: 8.9,
    notes: "Holiday entertaining push. Strong Q4 finish expected.",
  }
];

export interface MarketData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  revenue: number;
  velocity: number;
  growth: number;
  share: number;
  retailers: string[];
  topCompetitor: string;
  competitorGrowth: number;
  storeCount: number;
}

export const MARKET_DATA: MarketData[] = [
  {
    id: 'm_msp',
    name: 'Minneapolis / St. Paul',
    lat: 44.9778,
    lng: -93.2650,
    revenue: 127500,
    velocity: 3.8,
    growth: 42.0,
    share: 1.8,
    retailers: ['Target (45)', 'Walmart (98)', 'Cub Foods (62)', 'Lunds & Byerlys (22)'],
    topCompetitor: 'Motor City',
    competitorGrowth: 25.0,
    storeCount: 227
  },
  {
    id: 'm_mke',
    name: 'Milwaukee',
    lat: 43.0389,
    lng: -87.9065,
    revenue: 95300,
    velocity: 3.1,
    growth: 38.0,
    share: 1.5,
    retailers: ['Pick \'n Save (48)', 'Festival Foods (12)', 'Woodman\'s (4)'],
    topCompetitor: 'Palermo\'s',
    competitorGrowth: 12.0,
    storeCount: 145
  },
  {
    id: 'm_chi',
    name: 'Chicago (Greater)',
    lat: 41.8781,
    lng: -87.6298,
    revenue: 185200,
    velocity: 2.9,
    growth: 55.0,
    share: 0.8,
    retailers: ['Jewel-Osco (120)', 'Mariano\'s (35)', 'Tony\'s Fresh Market (15)'],
    topCompetitor: 'Home Run Inn',
    competitorGrowth: 5.0,
    storeCount: 310
  },
  {
    id: 'm_mad',
    name: 'Madison',
    lat: 43.0731,
    lng: -89.4012,
    revenue: 62400,
    velocity: 4.2,
    growth: 18.0,
    share: 2.4,
    retailers: ['Metcalfe\'s (3)', 'Festival Foods (5)', 'Woodman\'s (2)', 'Hy-Vee (2)'],
    topCompetitor: 'Lotzza Motzza',
    competitorGrowth: 8.5,
    storeCount: 45
  },
  {
    id: 'm_dsm',
    name: 'Des Moines',
    lat: 41.5868,
    lng: -93.6250,
    revenue: 45800,
    velocity: 3.5,
    growth: 22.0,
    share: 1.2,
    retailers: ['Hy-Vee (18)', 'Fareway (6)', 'Walmart (4)'],
    topCompetitor: 'Casey\'s (Frozen)',
    competitorGrowth: 15.0,
    storeCount: 65
  }
];
