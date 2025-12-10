export const calculateRoyalty = (asp: number, channel: string) => {
    const fixedBaseRoyalty = 0.50;
    let additionalRoyalty = 0;

    // Logic derived from documentation
    if (channel === 'DSD') {
        // DSD Range: $9.50 - $8.38
        // Max Add'l: $0.50 | Min Add'l: $0.00
        if (asp >= 9.36) {
            additionalRoyalty = 0.50;
        } else if (asp <= 8.38) {
            additionalRoyalty = 0;
        } else {
            // Linear interpolation approximation based on pattern:
            // Roughly $0.01 drop per $0.02 price drop from $9.36
            // Slope approx 0.5
            const dropFromMax = 9.36 - asp;
            const royaltyDrop = dropFromMax * 0.5;
            additionalRoyalty = Math.max(0, 0.50 - royaltyDrop);
        }
    } else {
        // Warehouse Range: $8.49 - $6.91
        // Max Add'l: ~$0.90 | Min Add'l: $0.00
        // Pattern: More gradual decrease
        if (asp >= 8.49) {
            additionalRoyalty = 0.90;
        } else if (asp <= 6.91) {
            additionalRoyalty = 0;
        } else {
            // Linear interpolation approximation
            // Range spread: 8.49 - 6.91 = 1.58
            // Royalty spread: 0.90 - 0.00 = 0.90
            // Ratio: 0.90 / 1.58 ~= 0.57 per dollar
            const dropFromMax = 8.49 - asp;
            const royaltyDrop = dropFromMax * 0.57;
            additionalRoyalty = Math.max(0, 0.90 - royaltyDrop);
        }
    }

    return {
        base: fixedBaseRoyalty,
        additional: parseFloat(additionalRoyalty.toFixed(2)),
        total: parseFloat((fixedBaseRoyalty + additionalRoyalty).toFixed(2))
    };
};

export const calculateBernatellosMargin = (asp: number, channel: string) => {
    const FIXED_COGS = 4.34;
    const marketing = asp * 0.05; // 5% of ASP
    const royalty = calculateRoyalty(asp, channel);
    
    const totalCost = FIXED_COGS + marketing + royalty.total;
    const netMarginDollars = asp - totalCost;
    const netMarginPercent = (netMarginDollars / asp) * 100;

    return {
        cogs: FIXED_COGS,
        marketing,
        royalty,
        totalCost,
        netMarginDollars,
        netMarginPercent
    };
};

