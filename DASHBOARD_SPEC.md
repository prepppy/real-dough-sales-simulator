# Real Dough Pizza Co - Brand Performance Dashboard
## Pre-Launch Dashboard Specification with Seed Data Requirements

---

## Document Purpose
This document outlines the specifications for Real Dough Pizza Co's brand performance dashboard. The dashboard will be built with seed data to demonstrate functionality before launch, then populated with real sales data post-launch. While the distributor will have access, this dashboard is primarily designed as an operational tool for Real Dough Pizza Co founders to monitor sales performance, track royalty payments, and make strategic decisions.

---

## Executive Summary

### Dashboard Goals
1. **Real-time Performance Tracking**: Monitor sales across all retail partners
2. **Royalty Payment Transparency**: Clear visibility into ASP-based royalty calculations
3. **Distribution Growth**: Track store expansion and market penetration
4. **Competitive Intelligence**: Understand positioning vs category and competitors
5. **Strategic Decision Support**: Data-driven insights for founders

### Primary Users
- **Real Dough Pizza Co Founders** (Primary users - 80% of usage)
- **Distributor Account Managers** (Secondary users - view access for alignment)

---

## Seed Data Strategy

### Realistic Scenario for Seed Data
Since Real Dough Pizza Co hasn't launched yet, we'll model the dashboard using:

**Launch Assumptions:**
- **Target Launch Date**: Q2 2025
- **Initial Retail Partners**: Target (150 stores), Walmart (750 stores)
- **Initial Markets**: Minneapolis/St. Paul, Milwaukee, Chicago, Madison, Des Moines
- **Product Line**: 6-8 SKUs (various toppings, premium positioning)
- **Projected ASP**: $9.20-$9.50 range (DSD Channel), $8.20-$8.40 range (Warehouse)
- **Velocity Targets**: 2.5-3.5 units/store/week (year 1)

**Seed Data Approach:**
- Use Nielsen category benchmarks for frozen pizza
- Model Real Dough performance at 80-120% of category growth
- Use actual competitive brand data from presentation (Tony's +30%, Motor City +25%, Rao's +31%)
- Project realistic ramp-up from launch through quarters 1-4

---

## Dashboard Module 1: Executive Overview

### Purpose
High-level snapshot for founders to see business health at a glance

### Key Metrics (Weekly/Monthly View)
- QTD Units / Revenue / Weighted ASP
- Estimated Royalty (Base + Additional)
- Stores Carrying vs Target

---

## Dashboard Module 2: Royalty Payment Calculator

### Purpose
THE MOST CRITICAL MODULE - Real-time transparency on royalty payments tied to ASP performance

### Royalty Dashboard Layout & Logic
- **DSD Channel (Target, etc.):** 
  - Base Royalty: $0.50
  - Additional: Variable based on ASP ($9.50 max -> $8.38 min)
- **Warehouse Channel (Walmart, Costco):**
  - Base Royalty: $0.50
  - Additional: Variable based on ASP ($8.49 max -> $6.91 min)

---

## Dashboard Module 3: Retailer Performance

### Purpose
Track performance at each retail partner to optimize distribution and sales strategies

### Metrics
- **Velocity:** Units/Store/Week
- **ACV%:** All Commodity Volume (Market Presence)
- **ASP:** Average Selling Price per retailer
- **Royalty Contribution:** Total royalty dollars generated per retailer

---

## Dashboard Module 4: Geographic Market Performance

### Purpose
Understand which markets are driving growth and where to prioritize expansion

### Top Markets
1. Minneapolis/St. Paul
2. Milwaukee
3. Chicago
4. Madison
5. Des Moines

---

## Dashboard Module 5: SKU Performance Analysis

### Purpose
Understand which products are resonating with consumers and driving profitability

### Top SKUs
1. Classic Pepperoni (Hero SKU)
2. Sausage & Mushroom
3. Margherita

---

## Dashboard Module 6: Velocity & Distribution Tracker

### Purpose
Monitor product velocity trends and distribution expansion progress

### Lifecycle Phases
- **Launch (W1-4):** 1.2-1.8 units/store/week
- **Growth (W5-8):** 2.0-2.5 units/store/week
- **Scale (W9-13):** 2.8-3.2 units/store/week

---

## Dashboard Module 7: Competitive Intelligence

### Purpose
Understand Real Dough's positioning relative to category and key competitors

### Competitive Set
- **Premium:** Rao's, Motor City, Screamin' Sicilian
- **Category Leaders:** DiGiorno, Red Baron, Tony's

---

## Dashboard Module 8: Financial Summary & Projections

### Purpose
High-level financial view for founders to track against business plan

### Year 1 Goals
- **Total Units:** ~1.1M
- **Total Revenue:** ~$10.5M
- **Total Royalties:** ~$1.24M
- **Store Count:** ~1,450

