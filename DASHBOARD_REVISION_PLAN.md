# Real Dough Pizza Co Dashboard - Revision & Improvement Recommendations

## Overview of Current Implementation

Based on the screenshots provided, the dashboard has been implemented with the following pages:
1. **Executive Overview** - Q2 2025 Performance snapshot
2. **Command Center** - Executive Summary with gross revenue analysis
3. **2026 Projections** - Financial outlook
4. **Distribution Map** - Geographic store distribution
5. **Scenario Builder** - Deal configuration tool
6. **Store Data** - Account detail list

---

## Critical Issues & Redundancies to Address

### 🔴 ISSUE 1: Missing Core Module - Royalty Calculator

**Problem**: The most critical module (Royalty Payment Calculator) is not visible in any screenshot. This was specified as THE MOST IMPORTANT module for founders.

**Current State**: 
- EST. ROYALTY shows $157,410 on Executive Overview
- But no dedicated royalty calculation module exists
- No visibility into ASP-based royalty tiers
- No channel breakdown (DSD vs Warehouse)

**Required Changes**:

```
CREATE NEW PAGE: "Royalty Dashboard"
Priority: Insert as 2nd item in navigation (right after Executive Overview)

Module Structure:
┌─────────────────────────────────────────────────────────────────┐
│  ROYALTY PAYMENT CALCULATOR - Q2 2025                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CHANNEL BREAKDOWN                                              │
│                                                                 │
│  DSD CHANNEL                        WAREHOUSE CHANNEL           │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐ │
│  │ Total Units: 89,250         │  │ Total Units: 53,250     │ │
│  │ Weighted ASP: $9.32         │  │ Weighted ASP: $8.29     │ │
│  │ Base Royalty: $0.50/unit    │  │ Base Royalty: $0.50/unit│ │
│  │ Additional: $0.50/unit      │  │ Additional: $0.78/unit  │ │
│  │ Total Rate: $1.00/unit      │  │ Total Rate: $1.28/unit  │ │
│  │ ─────────────────────────── │  │ ─────────────────────── │ │
│  │ TOTAL: $89,250              │  │ TOTAL: $68,160          │ │
│  └─────────────────────────────┘  └─────────────────────────┘ │
│                                                                 │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ Q2 2025 TOTAL ROYALTY PAYMENT: $157,410                ┃  │
│  ┃ Payment Due: July 15, 2025                             ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                                                 │
│  RETAILER BREAKDOWN TABLE                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Retailer  │ Channel │ Units  │ ASP   │ Roy/Unit │ Total │  │
│  │ Target    │ DSD     │ 42,500 │ $9.45 │ $1.00    │ $42.5K│  │
│  │ Walmart   │ Wareh   │ 48,000 │ $8.33 │ $1.31    │ $62.9K│  │
│  │ Publix    │ DSD     │ 18,750 │ $9.38 │ $1.00    │ $18.8K│  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ASP DISTRIBUTION CHART                                         │
│  [Histogram showing volume distribution across price tiers]    │
└─────────────────────────────────────────────────────────────────┘
```

**Action Items**:
- Create dedicated "Royalty Dashboard" navigation item
- Move it to position #2 (after Executive Overview)
- Implement the channel breakdown cards
- Add retailer-level royalty table
- Include ASP distribution visualization
- Link to royalty tier structure from the spreadsheet

---

### 🔴 ISSUE 2: "Command Center" Naming & Purpose Confusion

**Problem**: 
- "Command Center" shows "Executive Summary" 
- This is redundant with "Executive Overview"
- The term "Command Center" doesn't clearly communicate its purpose to founders
- Shows gross revenue analysis, but founders care about ROYALTY revenue

**Current State**:
- Command Center shows: Total Gross Revenue ($13.96M), Active Store Count, Avg Velocity, DSD Contribution
- This is distributor-centric data, not Real Dough-specific
- Founders need to see THEIR performance, not distributor's total portfolio

**Required Changes**:

```
RENAME: "Command Center" → "Retailer Performance"

Purpose: Deep dive into performance at each retail partner

Keep the good elements:
✅ Gross Revenue by Retailer (horizontal bar chart)
✅ Channel Distribution (DSD vs National Accounts donut)

Add Real Dough-specific elements:
+ Filter to show ONLY Real Dough Pizza Co data (not all distributor brands)
+ Change "Active Store Count: 1,321" to "Real Dough Stores: 895"
+ Change "Avg Velocity: 15.7" to "Real Dough Velocity: 3.2"
+ Remove "DSD Contribution: 48%" (this is distributor metric, not relevant)

Revise Retailer Bar Chart:
- Currently shows: Publix, Hy-Vee, Meijer, Costco, Sprouts, Harris Teeter, Festival Foods, Woodman's
- Should show: Target, Walmart, Publix, Kroger (Real Dough's actual retailers)
- Add ASP column next to each retailer
- Add Royalty/Unit column
- Make bars clickable to drill into retailer detail
```

---

### 🔴 ISSUE 3: Executive Overview - Missing Key Metrics

**Problem**:
Current Executive Overview shows:
- QTD Revenue: $1,317,375 ✅
- Est. Royalty: $157,410 ✅
- Weighted ASP: $9.24 ✅
- Avg Velocity: 3.2 ✅

Missing critical metrics:
- ❌ No comparison to category growth
- ❌ No "vs Goal" context for velocity
- ❌ No visibility into which channel (DSD vs Warehouse) is driving performance
- ❌ No retailer-level performance preview

**Required Changes**:

```
ENHANCE: Executive Overview Cards

Current Cards (Keep):
✅ QTD Revenue: $1,317,375
✅ Est. Royalty: $157,410
✅ Weighted ASP: $9.24
✅ Avg Velocity: 3.2

Add Below Existing Cards:
┌──────────────────────────────────────────────────────────┐
│  TOP PERFORMING RETAILER          FASTEST GROWING MARKET │
│  Target: 42.5K units              Madison: +45% Growth   │
│  ASP: $9.45 | Roy: $42.5K         Velocity: 4.5 u/s/w    │
└──────────────────────────────────────────────────────────┘

Enhance Distribution Progress Card:
Current shows:
- Target: 147/150
- Walmart: 745/750
- Publix: 0/250 (Launching Q3 2025)
- Kroger: 0/200 (Launching Q3 2025)

ADD:
- Color coding: Green (>95% complete), Yellow (50-95%), Gray (not launched)
- Click to see store-level detail
```

---

### 🟡 ISSUE 4: "2026 Projections" - Wrong Time Frame Focus

**Problem**:
- Dashboard shows "2026 Financial Outlook"
- But founders are in Q2 2025 (just launched!)
- They care about 2025 performance first, then 2026
- Current year is more important than next year for a new brand

**Current State**:
- Shows: Proj. 2026 Revenue: $20.75M, Proj. 2026 Profit: $5.65M
- Quarterly breakdown for 2026
- No visibility into 2025 targets

**Required Changes**:

```
SPLIT INTO TWO VIEWS:

View 1: "2025 Forecast" (Primary View)
Show remaining 2025 quarters:
- Q2 2025 (Current - Actual): $1.32M revenue, $157K royalty
- Q3 2025 (Projected): $2.64M revenue, $313K royalty
- Q4 2025 (Projected): $3.53M revenue, $421K royalty
- 2025 Total: $7.49M revenue, $891K royalty

View 2: "2026 Projections" (Secondary View)
Keep current implementation but add:
- Comparison to 2025 actuals
- Key assumptions (new retailers, velocity improvements)
- Risk factors

Navigation:
Add toggle at top: [2025 Forecast] [2026 Projections]
Default to 2025 Forecast
```

---

### 🟡 ISSUE 5: Distribution Map - Needs Context Layer

**Problem**:
- Beautiful map showing store distribution
- But no way to understand PERFORMANCE in those markets
- Numbers show store count, but not velocity or royalty contribution
- No indication of which markets are top 5 performers

**Current State**:
- Shows bubble sizes representing store count
- Color coding: DSD (red) vs National Accounts (blue)
- Numbers on bubbles (e.g., 246 in Michigan area)

**Required Changes**:

```
ADD PERFORMANCE OVERLAY OPTIONS:

Toggle View Modes:
[ Store Count ] [ Revenue ] [ Velocity ] [ Royalty ] [ Growth % ]

Example: When "Velocity" is selected:
- Bubble size = store count
- Bubble color intensity = velocity
  * Dark green: >4.0 units/store/week (Madison)
  * Light green: 3.0-4.0 u/s/w (Minneapolis, Milwaukee)
  * Yellow: 2.0-3.0 u/s/w (Chicago)
  * Gray: <2.0 u/s/w

Add Market Labels:
- Currently shows generic numbers
- Should show: "Minneapolis: 143 stores, 3.8 velocity, $127K revenue"

Make Bubbles Clickable:
- Click bubble → See detailed market performance
- Links to that market's SKU breakdown, competitive context
```

---

### 🟡 ISSUE 6: "Scenario Builder" - Misaligned with Real Dough's Needs

**Problem**:
- Shows "Bernatello's Deal Config"
- This is distributor's internal tool, not Real Dough-specific
- Scenario builder should model Real Dough scenarios, not distributor deals
- Founders need to model: "What if we add 200 Kroger stores at $9.30 ASP?"

**Current State**:
- Shows Bernatello's pricing structure (COGS, Marketing, Brand Royalty)
- Retail price (MSRP): $7.99, Sell Price (ASP): $4.50
- This is showing distributor's margin analysis, not Real Dough's royalty analysis

**Required Changes**:

```
COMPLETELY REDESIGN: "Scenario Builder"

New Purpose: Model Real Dough expansion scenarios

Scenario Inputs:
┌─────────────────────────────────────────────────────────┐
│ SCENARIO NAME: [Kroger Expansion - Q3 2025]            │
│                                                         │
│ RETAILER: [Kroger ▾]                                   │
│ CHANNEL: [DSD ▾]                                       │
│ NEW STORES: [200]                                       │
│ PROJECTED ASP: [$9.30]                                  │
│ PROJECTED VELOCITY: [2.5] units/store/week             │
│ WEEKS IN QUARTER: [13]                                  │
│                                                         │
│ SKU MIX:                                                │
│ □ Pepperoni (30%)                                       │
│ □ Sausage & Mushroom (25%)                              │
│ □ Margherita (20%)                                      │
│ □ Four Cheese (15%)                                     │
│ □ BBQ Chicken (10%)                                     │
└─────────────────────────────────────────────────────────┘

Scenario Outputs:
┌─────────────────────────────────────────────────────────┐
│ PROJECTED RESULTS                                       │
│                                                         │
│ Quarterly Units: 65,000                                 │
│ Quarterly Revenue: $604,500                             │
│ Weighted ASP: $9.30                                     │
│ Royalty Rate: $0.995/unit                               │
│ Quarterly Royalty Payment: $64,675                      │
│                                                         │
│ Impact on Total Business:                               │
│ + New ACV%: +8.5% (from 24.8% to 33.3%)                │
│ + Total Q3 Royalty: $377,425 (vs $313K baseline)       │
│ + Revenue Increase: +22.9%                              │
└─────────────────────────────────────────────────────────┘

Save Scenario Button:
[Save as "Kroger Q3 Expansion"]
```

---

### 🟡 ISSUE 7: "Store Data" - Needs Real Dough Focus

**Problem**:
- Shows "Account Detail List" with Costco stores
- This appears to be distributor's full account list, not Real Dough-specific
- All Costco locations shown (National Account channel)
- Founders need to see stores carrying REAL DOUGH, not all distributor stores

**Current State**:
- Lists individual Costco stores (#445, #268, #733, etc.)
- Shows: Channel, State, SKU Count (all showing "1"), Velocity, Annual Wholesale

**Required Changes**:

```
REFOCUS: "Store Data" → "Store Performance"

Purpose: Show stores carrying Real Dough Pizza Co products

Add Filters at Top:
[ All Retailers ▾ ] [ All Channels ▾ ] [ All States ▾ ] [ All Markets ▾ ]

Table Columns (keep most, revise some):
✅ Store Name
✅ Channel (DSD / National Account)
✅ State
✅ SKU Count (Real Dough SKUs carried)
✅ Velocity (Real Dough velocity at this store)
❌ Annual Wholesale → CHANGE TO: "QTD Revenue (Real Dough)"

Add New Columns:
+ Retailer (Target, Walmart, Publix, etc.)
+ Market/DMA (Minneapolis, Milwaukee, etc.)
+ Real Dough ASP (not wholesale price)
+ Royalty/Unit
+ QTD Royalty Earned

Example Row:
┌──────────────────────────────────────────────────────────────────┐
│ Store Name: Target #1234                                         │
│ Retailer: Target                                                 │
│ Channel: DSD                                                     │
│ Market: Minneapolis/St. Paul                                     │
│ State: MN                                                        │
│ SKU Count: 6 (all Real Dough SKUs)                              │
│ Velocity: 4.2 units/store/week                                  │
│ QTD Units: 327                                                   │
│ ASP: $9.45                                                       │
│ Royalty/Unit: $1.00                                              │
│ QTD Revenue: $3,090                                              │
│ QTD Royalty: $327                                                │
└──────────────────────────────────────────────────────────────────┘

Add Summary Cards Above Table:
┌─────────────────────────────────────────────────────────────┐
│ TOTAL STORES: 895       AVG VELOCITY: 3.2        AVG ASP: $9.24 │
│ DSD: 395 stores         WAREHOUSE: 500 stores                │
└─────────────────────────────────────────────────────────────┘
```

---

### 🟢 ISSUE 8: Missing Critical Pages from Spec

**Problem**: Several pages specified in the original spec are not implemented:

**Missing Pages**:
1. ❌ **Market Performance** - Top 5 markets (Minneapolis, Milwaukee, Chicago, Madison, Des Moines)
2. ❌ **SKU Performance** - Individual product performance
3. ❌ **Competitive Intelligence** - How Real Dough compares to Motor City, Rao's, etc.
4. ❌ **Velocity Tracker** - Trend of units/store/week over time

**Required Changes**:

```
ADD NEW PAGE: "Market Performance"
Navigation: Insert after "Retailer Performance"

Show Top 5 Markets Dashboard:
┌─────────────────────────────────────────────────────────────┐
│ 1. MINNEAPOLIS/ST. PAUL                   Revenue: $127.5K  │
│    Velocity: 3.8 u/s/w | Growth: +42% | Share: 1.8%        │
│    Retailers: Target (45), Walmart (98)                     │
│    Top Competitor: Motor City +25%                          │
│                                                             │
│ 2. MILWAUKEE                              Revenue: $95.3K   │
│    Velocity: 3.1 u/s/w | Growth: +38% | Share: 1.5%        │
│    [Similar detail...]                                      │
└─────────────────────────────────────────────────────────────┘

ADD NEW PAGE: "SKU Performance"
Navigation: Insert after "Market Performance"

Show SKU Ranking Table:
┌────────────────────────────────────────────────────────────────┐
│ SKU                    │ Units  │ ASP   │ Velocity │ Royalty   │
│ RD-001 Pepperoni       │ 38,250 │ $9.35 │ 3.5      │ $39,015   │
│ RD-002 Sausage & Mush  │ 29,750 │ $9.42 │ 2.8      │ $29,750   │
│ RD-003 Margherita      │ 24,500 │ $9.28 │ 2.3      │ $24,255   │
│ [etc...]                                                       │
└────────────────────────────────────────────────────────────────┘

ADD NEW TAB on Executive Overview: "Competitive Context"
Show comparison:
- Real Dough: 0.8% share, +38% growth, $9.32 ASP
- Rao's: 2.1% share, +31% growth, $9.85 ASP
- Motor City: 3.5% share, +25% growth, $9.45 ASP
- [etc...]
```

---

## UI/UX Improvements

### Navigation Improvements

**Current Navigation Issues**:
- "Command Center" is vague
- "2026 Projections" should not be prioritized over 2025
- Missing critical pages (Royalty, Markets, SKUs)

**Recommended Navigation Order**:
```
1. 📊 Executive Overview (current landing page) ✅
2. 💰 Royalty Dashboard (ADD - MOST IMPORTANT)
3. 🏪 Retailer Performance (rename from "Command Center")
4. 📍 Market Performance (ADD)
5. 📦 SKU Performance (ADD)
6. 📈 2025 Forecast (split from "2026 Projections")
7. 🔮 2026 Projections
8. 🗺️ Distribution Map ✅
9. 🎯 Scenario Builder (redesign)
10. 📋 Store Performance (rename from "Store Data")
```

---

### Color Coding Consistency

**Issue**: Current implementation uses:
- Blue for National Accounts
- Red for DSD Accounts
- But also blue in other contexts (revenue bars)

**Recommendation**:
```
Standard Color Palette:

Real Dough Brand Colors:
- Primary: #E53935 (Red - use for Real Dough data)
- Secondary: #1E88E5 (Blue - use for comparison/category)

Channel Colors:
- DSD: #E53935 (Red)
- Warehouse/National: #1E88E5 (Blue)

Status Colors:
- Green: Positive performance, on-track goals
- Yellow: Needs attention
- Red: Below target
- Gray: Not launched / inactive

Chart Colors:
- Real Dough performance: Red/pink tones
- Category/competitor: Blue/gray tones
- Projections: Lighter shades with dotted lines
```

---

### Data Visualization Improvements

**Issue 1: Unit Sales Trajectory Chart**
Current: Shows cumulative growth
Could be improved: Add velocity overlay, weekly targets

**Issue 2: Channel Distribution Donut**
Current: Shows 48% DSD, 52% National
Unclear: This seems to be distributor data, not Real Dough

**Recommendation**:
```
Executive Overview Chart Improvements:

Replace "Unit Sales Trajectory" with:
"Weekly Performance Trend"
- X-axis: Week 1 through Week 12
- Y-axis 1: Weekly units sold (bars)
- Y-axis 2: Velocity (line)
- Add target velocity line at 3.0
- Color weeks: Green if above target, yellow if below

Channel Distribution:
- Ensure this shows REAL DOUGH data only
- Add labels: "DSD: $632K (48%)", "Warehouse: $685K (52%)"
- Make it clear this is Real Dough's channel mix
```

---

## Data Accuracy & Consistency Checks

### Verify These Calculations

**From Executive Overview**:
- QTD Revenue: $1,317,375
- Est. Royalty: $157,410
- Weighted ASP: $9.24
- Units: 142,500 (not shown but should be: $1,317,375 / $9.24 = 142,532)

**Check**:
✅ If 142,500 units × $9.24 ASP = $1,316,700 (close enough with rounding)
✅ If royalty is $157,410 / 142,500 units = $1.10 per unit (matches expectation)

**From Command Center**:
- Total Gross Revenue: $13,960,313
- Active Store Count: 1,321

**Check**:
❌ This does NOT match Real Dough's numbers
❌ Real Dough has 895 stores, not 1,321
❌ Real Dough revenue is $1.32M, not $13.96M

**This confirms Command Center is showing distributor data, not Real Dough!**

---

## Filter Implementation Requirements

**Critical Need**: Every page needs "Real Dough Pizza Co" filter

**Current Issue**: 
- Dashboard appears to show ALL distributor brands in some views
- Founders only care about Real Dough Pizza Co performance
- No clear way to isolate Real Dough data

**Required Changes**:

```
Add Global Filter Bar (Top of Every Page):

┌────────────────────────────────────────────────────────────┐
│ [ALL] [DSD] [National]  |  🔍 All Regions ▾  |  💰 Revenue ▾│
└────────────────────────────────────────────────────────────┘

Current implementation: ✅ Already exists

ADD BRAND FILTER (Hidden by default since this is Real Dough dashboard):
But add "Real Dough Pizza Co" label prominently on each page:

┌────────────────────────────────────────────────────────────┐
│ 🍕 Real Dough Pizza Co - Executive Overview                │
└────────────────────────────────────────────────────────────┘

This makes it clear all data is Real Dough-specific.
```

---

## Export & Reporting Enhancements

**Current Feature**: "Export One-Pager" button exists ✅

**Recommended Enhancements**:

```
Export Options Menu:
[ Export One-Pager ▾ ]
  → Executive Summary (1 page)
  → Royalty Report (1 page)
  → Retailer Performance (2 pages)
  → Full Dashboard (8 pages)
  → Custom Selection

For Each Export:
- Include Real Dough branding
- Add "Generated on [date]" timestamp
- Add "Data as of Week Ending [date]"
- Professional formatting for sharing with board/investors

Add Scheduled Reports:
- Weekly email to founders with key metrics
- Quarterly royalty statement PDF
- Monthly performance summary
```

---

## Mobile Responsiveness Considerations

**Assumption**: Founders will primarily use desktop, but may check on mobile

**Recommendation**:
```
Mobile Priority Pages:
1. Executive Overview - Must be fully responsive
2. Royalty Dashboard - Critical for on-the-go checks
3. Retailer Performance - Quick retailer lookup

Desktop-Only Pages (acceptable):
- Distribution Map (complex visualization)
- Store Data table (too many columns)
- Scenario Builder (complex inputs)

Implementation:
- Executive Overview: Stack cards vertically on mobile
- Royalty Dashboard: Show channel cards stacked
- Add "View on Desktop for Full Experience" message on complex pages
```

---

## Performance & Loading Considerations

**Potential Issue**: Store Data showing 1,000+ rows could be slow

**Recommendations**:
```
Pagination & Lazy Loading:
- Store Data: Show 50 stores per page, load more on scroll
- Market lists: Show top 10 markets by default, expand for more
- SKU performance: Show top 10 SKUs by default

Caching Strategy:
- Cache weekly data (refreshes Sunday night)
- Real-time updates only for: current week metrics
- Historical data: cache aggressively

Progress Indicators:
- Show loading states for all data fetches
- "Last updated: 2 hours ago" timestamps
- "Refreshing data..." indicator when updating
```

---

## User Permissions & Access Control

**Current Assumption**: Dashboard is shared with distributor (read-only)

**Recommendations**:
```
User Roles:

1. Real Dough Founders (Admin)
   - Full access to all pages
   - Can edit scenarios
   - Can export all reports
   - Can see historical data

2. Distributor Account Managers (Viewer)
   - Read-only access
   - Can view all pages EXCEPT:
     × Royalty Dashboard (founders only)
     × 2026 Projections (founders only)
   - Cannot export data
   - Cannot create/edit scenarios

3. Real Dough Team Members (Viewer)
   - Read-only access
   - Can view all pages
   - Can export reports
   - Cannot edit scenarios

Implement:
- Login/auth system
- Role-based page visibility
- Audit log: "Who viewed what, when"
```

---

## Testing Checklist for Agent

### Data Validation
- [ ] Verify all numbers sum correctly (revenue, units, royalty)
- [ ] Check ASP calculations: Revenue / Units = ASP
- [ ] Check royalty calculations: Match tiers from Excel file
- [ ] Verify store counts match across all pages
- [ ] Confirm velocity = units / stores / weeks

### Feature Completeness
- [ ] Royalty Dashboard implemented and visible
- [ ] All 10 navigation pages present
- [ ] Filters work on every page
- [ ] Export function works for all page types
- [ ] Scenario Builder saves and loads scenarios
- [ ] Maps show correct geographic data

### User Experience
- [ ] Load time < 3 seconds for all pages
- [ ] Mobile responsive (at minimum: Executive Overview)
- [ ] Charts have proper legends and tooltips
- [ ] Tables are sortable by all columns
- [ ] No broken links or 404 errors
- [ ] All data has proper number formatting ($, %, units)

### Visual Consistency
- [ ] Real Dough branding consistent across all pages
- [ ] Color scheme matches brand guidelines
- [ ] Font sizes readable on all devices
- [ ] Spacing and padding consistent
- [ ] Icons match design system

---

## Priority Implementation Order

### Phase 1: Critical Fixes (Week 1)
1. **ADD: Royalty Dashboard page** (highest priority)
2. **RENAME: Command Center → Retailer Performance**
3. **FILTER: Show only Real Dough data in all views**
4. **FIX: Store Data to show Real Dough stores only**

### Phase 2: Essential Additions (Week 2)
5. **ADD: Market Performance page**
6. **ADD: SKU Performance page**
7. **SPLIT: 2026 Projections into 2025/2026 views**
8. **REDESIGN: Scenario Builder for Real Dough scenarios**

### Phase 3: Enhancements (Week 3)
9. **ADD: Competitive Intelligence tab**
10. **ENHANCE: Distribution Map with performance overlays**
11. **ADD: Velocity trend charts**
12. **IMPROVE: Export functionality**

### Phase 4: Polish (Week 4)
13. **ADD: User authentication and roles**
14. **OPTIMIZE: Performance and loading times**
15. **TEST: Mobile responsiveness**
16. **DOCUMENT: User guide for founders**

---

## Immediate Action Items for Cursor Agent

```markdown
PRIORITY 1: CREATE ROYALTY DASHBOARD PAGE
- New navigation item: "Royalty Dashboard"
- Position: #2 (after Executive Overview)
- Must include:
  * Channel breakdown cards (DSD vs Warehouse)
  * Retailer royalty table
  * ASP distribution chart
  * Quarterly projection

PRIORITY 2: FIX COMMAND CENTER
- Rename to "Retailer Performance"
- Filter all data to Real Dough Pizza Co only
- Update metrics: stores, velocity to Real Dough numbers
- Remove distributor-wide metrics

PRIORITY 3: FIX STORE DATA
- Rename to "Store Performance"
- Show only stores carrying Real Dough products
- Add Real Dough-specific columns (ASP, Royalty/Unit, QTD Royalty)
- Add filter by retailer, channel, state, market

PRIORITY 4: ADD MISSING PAGES
- Market Performance (Top 5 markets detail)
- SKU Performance (Product ranking table)

PRIORITY 5: SPLIT PROJECTIONS
- Create "2025 Forecast" page (default view)
- Keep "2026 Projections" (secondary view)
- Add toggle to switch between years
```

---

## Questions for Founders (to be resolved)

1. **Distributor Access**: Which specific pages should distributor see vs founders-only?
2. **Data Refresh**: How often should data update? Daily? Weekly? Real-time?
3. **Scenario Builder**: What expansion scenarios do you want pre-built?
4. **Alerts**: Do you want email/SMS alerts for key metrics (e.g., "Velocity dropped below 3.0")?
5. **Benchmark**: Do you want category/competitor benchmarks shown on every page?
6. **Historical Data**: How many quarters of historical data to maintain?

---

## Summary of Key Changes

### Must Fix Immediately:
1. ❌ **Add Royalty Dashboard** - most critical missing piece
2. ❌ **Fix Command Center** - currently showing distributor data, not Real Dough
3. ❌ **Fix Store Data** - showing all distributor stores, not Real Dough stores
4. ❌ **Add Market & SKU Performance pages** - specified in original doc

### Should Improve:
5. 🔧 **Rename pages** for clarity
6. 🔧 **Split 2025/2026 projections**
7. 🔧 **Redesign Scenario Builder** for Real Dough use cases
8. 🔧 **Add performance overlays** to Distribution Map

### Nice to Have:
9. ✨ Enhanced exports
10. ✨ Mobile optimization
11. ✨ User roles & permissions
12. ✨ Competitive intelligence integration

---

## Conclusion

The current implementation has a strong foundation with excellent visual design and several good features. However, it's mixing distributor-wide data with Real Dough-specific data, and is missing the most critical module (Royalty Dashboard) for the founders.

The key insight is: **This dashboard must be laser-focused on Real Dough Pizza Co's performance, not the distributor's overall portfolio.** Every metric, every chart, every table should answer: "How is Real Dough performing?"

With these revisions, the dashboard will become a powerful tool for Real Dough founders to:
- Monitor royalty payments in real-time
- Track performance at each retailer and market
- Make data-driven expansion decisions
- Prepare for board meetings and investor updates

---

## Document Metadata
- **Created**: December 2024
- **Based On**: Dashboard screenshots provided
- **Purpose**: Guide Cursor agent to improve implementation
- **Priority**: Focus on Royalty Dashboard, data filtering, and missing pages

