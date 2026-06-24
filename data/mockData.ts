
import { PortfolioAsset, Client, ModelPortfolio, AuditLog, Transaction, Stock } from '../types.ts';

const baseAssets: PortfolioAsset[] = [
    { id: '0', name: 'Cash', ticker: 'NGN', value: 15000000, change: 0, allocation: 0, sector: 'Cash', riskScore: 0, volatility: 0, liquidityScore: 1, marketCorrelation: 0 },
    { id: '1', name: 'Dangote Cement PLC', ticker: 'DANGCEM', value: 45200000, change: 1.2, allocation: 0, sector: 'Industrials', riskScore: 0.4, volatility: 0.22, liquidityScore: 0.85, marketCorrelation: 0.75 },
    { id: '2', name: 'MTN Nigeria Communications PLC', ticker: 'MTNN', value: 37700000, change: 2.5, allocation: 0, sector: 'Telecommunications', riskScore: 0.3, volatility: 0.18, liquidityScore: 0.95, marketCorrelation: 0.60 },
    { id: '3', name: 'Guaranty Trust Holding Company PLC', ticker: 'GTCO', value: 22600000, change: -0.5, allocation: 0, sector: 'Financials', riskScore: 0.6, volatility: 0.35, liquidityScore: 0.90, marketCorrelation: 0.85 },
    { id: '4', name: 'Zenith Bank PLC', ticker: 'ZENITHBANK', value: 18100000, change: 0.8, allocation: 0, sector: 'Financials', riskScore: 0.55, volatility: 0.33, liquidityScore: 0.88, marketCorrelation: 0.82 },
    { id: '5', name: 'BUA Foods PLC', ticker: 'BUAFOODS', value: 27150000, change: -1.1, allocation: 0, sector: 'Industrials', riskScore: 0.7, volatility: 0.40, liquidityScore: 0.70, marketCorrelation: 0.65 },
];

const recalculateAllocations = (assets: PortfolioAsset[]): PortfolioAsset[] => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    if (totalValue === 0) return assets.map(a => ({...a, allocation: 0}));

    return assets.map(asset => ({
        ...asset,
        allocation: (asset.value / totalValue) * 100,
    }));
};

export const mockAssets: PortfolioAsset[] = recalculateAllocations(baseAssets);

export const mockClients: Client[] = [
    {
        id: 'client-1',
        name: 'Ada Okoro',
        email: 'ada.okoro@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=adaokoro',
        kycStatus: 'Verified',
        riskProfile: {
            investmentGoals: 'Long-term capital appreciation and wealth preservation.',
            riskAppetite: 'Moderate',
            investmentHorizon: 'Long-term',
            behavioralRiskScore: 0.45,
        }
    },
    {
        id: 'client-2',
        name: 'Bayo Adekunle',
        email: 'bayo.adekunle@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=bayoadekunle',
        kycStatus: 'Verified',
        riskProfile: {
            investmentGoals: 'Aggressive growth with a focus on technology and emerging sectors.',
            riskAppetite: 'Aggressive',
            investmentHorizon: 'Medium-term',
            behavioralRiskScore: 0.78,
        }
    },
    {
        id: 'client-3',
        name: 'Chidinma Eze',
        email: 'chidinma.eze@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=chidinmaeze',
        kycStatus: 'Pending',
        riskProfile: {
            investmentGoals: 'Stable income generation through dividends and bonds.',
            riskAppetite: 'Conservative',
            investmentHorizon: 'Short-term',
            behavioralRiskScore: 0.21,
        }
    }
];

export const modelPortfolios: ModelPortfolio[] = [
    {
        id: 'model-1',
        name: 'Aggressive Growth',
        description: 'High-risk, high-reward portfolio focused on tech and growth stocks.',
        riskLevel: 'High',
        constituents: [
            { ticker: 'MTNN', weight: 30 },
            { ticker: 'AIRTELAFRI', weight: 25 },
            { ticker: 'FINTECH_ETF', weight: 20 },
            { ticker: 'GTCO', weight: 15 },
            { ticker: 'INTL_GROWTH', weight: 10 },
        ]
    },
    {
        id: 'model-2',
        name: 'Balanced Income',
        description: 'A moderate-risk portfolio blending stable dividend stocks and bonds.',
        riskLevel: 'Medium',
        constituents: [
            { ticker: 'DANGCEM', weight: 20 },
            { ticker: 'ZENITHBANK', weight: 20 },
            { ticker: 'FGN_BOND_2030', weight: 30 },
            { ticker: 'NESTLE', weight: 15 },
            { ticker: 'BUAFOODS', weight: 15 },
        ]
    },
    {
        id: 'model-3',
        name: 'ESG Focused',
        description: 'Invests in companies with strong Environmental, Social, and Governance ratings.',
        riskLevel: 'Low',
        constituents: [
            { ticker: 'GREEN_ENERGY_ETF', weight: 40 },
            { ticker: 'SUSTAIN_BANK', weight: 25 },
            { ticker: 'HEALTHCARE_INC', weight: 20 },
            { ticker: 'EDU_TECH', weight: 15 },
        ]
    }
];

export const mockTransactions: Transaction[] = [
    { id: '1', type: 'Buy', ticker: 'MTNN', amount: 1500000, date: 'Jul 27, 2024' },
    { id: '2', type: 'Sell', ticker: 'BUAFOODS', amount: 850000, date: 'Jul 26, 2024' },
    { id: '3', type: 'Buy', ticker: 'GTCO', amount: 1200000, date: 'Jul 26, 2024' },
    { id: '4', type: 'Sell', ticker: 'DANGCEM', amount: 2000000, date: 'Jul 24, 2024' },
];


export const mockAuditLogs: AuditLog[] = [
    { id: 'log-1', user: 'Femi Adebayo', action: 'LOGIN_SUCCESS', details: 'User logged in successfully.', timestamp: '2024-07-29 09:01:14', ipAddress: '192.168.1.1' },
    { id: 'log-2', user: 'Femi Adebayo', action: 'VIEW_PAGE', details: 'Accessed Portfolio Management page.', timestamp: '2024-07-29 09:02:30', ipAddress: '192.168.1.1' },
    { id: 'log-3', user: 'SYSTEM', action: 'RUN_COMPLIANCE_CHECKS', details: 'Automated daily compliance scan initiated.', timestamp: '2024-07-29 09:05:00', ipAddress: 'N/A' },
    { id: 'log-4', user: 'Femi Adebayo', action: 'UPDATE_ASSET', details: 'Edited asset: MTNN. New value: 38,000,000 NGN.', timestamp: '2024-07-29 09:08:55', ipAddress: '192.168.1.1' },
    { id: 'log-5', user: 'Femi Adebayo', action: 'GENERATE_REPORT', details: 'Generated Quarterly Report for client Aliko Dangote.', timestamp: '2024-07-29 09:15:21', ipAddress: '192.168.1.1' },
    { id: 'log-6', user: 'SYSTEM', action: 'AI_OPTIMIZATION', details: 'AI optimization suggestions generated for portfolio.', timestamp: '2024-07-29 09:16:05', ipAddress: 'N/A' },
];


const generatePriceHistory = (basePrice: number, days: number) => {
    const history = [];
    let currentPrice = basePrice;
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        history.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: currentPrice,
        });
        currentPrice *= 1 + (Math.random() - 0.5) * 0.05; // Fluctuate by up to 5%
    }
    return history;
};

export const mockStockUniverse: Stock[] = [
    { id: 's-1', name: 'Dangote Cement PLC', ticker: 'DANGCEM', sector: 'Industrials', price: 650.50, change: 1.2, marketCap: 11080, peRatio: 15.2, dividendYield: 3.1, priceHistory: generatePriceHistory(640, 30) },
    { id: 's-2', name: 'MTN Nigeria Communications PLC', ticker: 'MTNN', sector: 'Telecommunications', price: 230.00, change: 2.5, marketCap: 4680, peRatio: 9.8, dividendYield: 6.5, priceHistory: generatePriceHistory(220, 30) },
    { id: 's-3', name: 'Guaranty Trust Holding Company PLC', ticker: 'GTCO', sector: 'Financials', price: 38.75, change: -0.5, marketCap: 1140, peRatio: 4.5, dividendYield: 8.0, priceHistory: generatePriceHistory(39, 30) },
    { id: 's-4', name: 'Zenith Bank PLC', ticker: 'ZENITHBANK', sector: 'Financials', price: 35.10, change: 0.8, marketCap: 1100, peRatio: 3.9, dividendYield: 9.1, priceHistory: generatePriceHistory(34.5, 30) },
    { id: 's-5', name: 'BUA Foods PLC', ticker: 'BUAFOODS', sector: 'Consumer Goods', price: 350.00, change: -1.1, marketCap: 6300, peRatio: 25.5, dividendYield: 2.5, priceHistory: generatePriceHistory(355, 30) },
    { id: 's-6', name: 'Seplat Energy PLC', ticker: 'SEPLAT', sector: 'Energy', price: 3400.00, change: 0.0, marketCap: 2000, peRatio: 7.1, dividendYield: 5.5, priceHistory: generatePriceHistory(3400, 30) },
    { id: 's-7', name: 'Airtel Africa PLC', ticker: 'AIRTELAFRI', sector: 'Telecommunications', price: 2050.00, change: -0.2, marketCap: 7700, peRatio: 12.3, dividendYield: 2.1, priceHistory: generatePriceHistory(2060, 30) },
    { id: 's-8', name: 'FBN Holdings PLC', ticker: 'FBNH', sector: 'Financials', price: 28.50, change: 1.8, marketCap: 1020, peRatio: 5.1, dividendYield: 3.5, priceHistory: generatePriceHistory(28, 30) },
    { id: 's-9', name: 'United Bank for Africa PLC', ticker: 'UBA', sector: 'Financials', price: 22.00, change: 0.9, marketCap: 752, peRatio: 3.2, dividendYield: 9.5, priceHistory: generatePriceHistory(21.5, 30) },
    { id: 's-10', name: 'Nestle Nigeria PLC', ticker: 'NESTLE', sector: 'Consumer Goods', price: 950.00, change: -0.8, marketCap: 753, peRatio: 28.0, dividendYield: 4.2, priceHistory: generatePriceHistory(960, 30) },
];
