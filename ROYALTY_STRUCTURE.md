# Real Dough Pizza Co - Brand Partnership Royalty Payment Structure

## Overview
This document outlines the variable royalty payment structure between a distributor (Bernatello's) and Real Dough Pizza Co Brand. The royalty payments vary based on the **Average Selling Price (ASP)** per unit in a given quarter, with different structures for two distribution channels: **DSD (Direct Store Delivery)** and **Warehouse**.

## Key Components

### Fixed Costs Per Unit
- **Total COGS:** $4.34 per unit (constant across all scenarios)
- **Base Royalty:** $0.50 per unit (constant across all scenarios)

### Variable Costs Per Unit
- **Marketing:** Calculated as 5% of ASP (varies with price)

---

## Channel 1: DSD (Direct Store Delivery)

### ASP Range
- **Highest ASP:** $9.50
- **Lowest ASP:** $8.38
- **Increment:** $0.02 (decreases in 2-cent increments)

### Royalty Structure
- **Base Royalty (Fixed):** $0.50 per unit at all ASP levels
- **Additional Brand Royalty (Variable):** Decreases as ASP decreases.

| ASP Range | Additional Royalty | Total Brand Royalty |
|-----------|--------------------|---------------------|
| $9.50 - $9.36 | $0.50 | $1.00 |
| $9.30 | $0.49 | $0.99 |
| $9.28 | $0.48 | $0.98 |
| ... | ... | ... |
| $8.40 - $8.38 | $0.00 | $0.50 |

**Pattern:** Generally decreases by $0.01 for every $0.02 decrease in ASP.

---

## Channel 2: Warehouse

### ASP Range
- **Highest ASP:** $8.49
- **Lowest ASP:** $6.91
- **Increment:** $0.02 (decreases in 2-cent increments)

### Royalty Structure
- **Base Royalty (Fixed):** $0.50 per unit at all ASP levels
- **Additional Brand Royalty (Variable):** Higher start point than DSD but decreases more gradually.

| ASP Range | Additional Royalty (approx.) | Total Brand Royalty (approx.) |
|-----------|------------------------------|-------------------------------|
| $8.49 | $0.899 | $1.399 |
| $8.47 | $0.888 | $1.388 |
| ... | ... | ... |
| $6.91 | $0.000 | $0.500 |

---

## Margin Calculations

- **Available Margin Pool** = ASP - Total COGS - Marketing
- **Gross Margin % (Before Brand Royalty)** = (Available Margin Pool) / ASP
- **Net Margin $ (Bernatello's)** = ASP - Total COGS - Marketing - Total Brand Royalty
- **Net Margin %** = Net Margin $ / ASP

## Business Logic Summary
1.  **Base Royalty Protection:** Minimum $0.50/unit always guaranteed.
2.  **Performance-Based:** Higher prices = higher royalties.
3.  **Distributor Protection:** Royalty burden decreases as price/margin compresses.
4.  **Channel Differentiation:** Warehouse and DSD have distinct curves.

---

## Implementation Data Structures

### DSD Logic
- **Range:** $9.50 down to $8.38.
- **Max Total Royalty:** $1.00.
- **Min Total Royalty:** $0.50.

### Warehouse Logic
- **Range:** $8.49 down to $6.91.
- **Max Total Royalty:** ~$1.40.
- **Min Total Royalty:** $0.50.

