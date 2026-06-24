
export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    type: 'info' | 'warning' | 'error';
    read: boolean;
}

export interface NavItem {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  page: string;
}

export interface PortfolioAsset {
  id: string;
  name: string;
  ticker: string;
  value: number;
  change: number;
  allocation: number;
  sector: string;
  riskScore: number;
  volatility: number; 
  liquidityScore: number;
  marketCorrelation: number;
}

export interface OptimizationSuggestion {
  ticker: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  reasoning: string;
  confidenceScore: number;
}

export interface ComplianceCheck {
    id: string;
    rule: string;
    status: 'Passed' | 'Failed' | 'Pending';
    details: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Transaction {
    id: string;
    type: 'Buy' | 'Sell';
    ticker: string;
    amount: number;
    date: string;
}

export interface ClientReport {
    id: string;
    clientName: string;
    reportType: string;
    reportingPeriod: string;
    generationDate: string;
    summary: string;
}

export interface ScenarioAnalysisResult {
    estimatedImpact: number; // percentage change
    summary: string;
}

export interface WebContent {
    uri: string;
    title: string;
}

export interface GroundingChunk {
    web?: WebContent;
}

export interface GroundedInsight {
    text: string;
    sources: GroundingChunk[];
}

export interface RiskProfile {
    investmentGoals: string;
    riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
    investmentHorizon: 'Short-term' | 'Medium-term' | 'Long-term';
    behavioralRiskScore: number; // 0-1
}

export interface Client {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    kycStatus: 'Verified' | 'Pending' | 'Rejected';
    riskProfile: RiskProfile;
}

export interface AuditLog {
    id: string;
    user: string;
    action: string;
    details: string;
    timestamp: string;
    ipAddress: string;
}

export interface ModelPortfolio {
    id: string;
    name: string;
    description: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    constituents: { ticker: string; weight: number }[];
}

export interface ModelPortfolioAnalysis {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    projectedReturn: number; // Annualized
    maxDrawdown: number;
}


export interface PortfolioDoctorReport {
    overallScore: number; // 0-100
    summary: string;
    positivePoints: string[];
    areasForImprovement: string[];
}

export interface Stock {
    id: string;
    name: string;
    ticker: string;
    sector: string;
    price: number;
    change: number; // 24h percentage change
    marketCap: number; // in billions NGN
    peRatio: number;
    dividendYield: number; // percentage
    priceHistory: { date: string; price: number }[];
}

export interface SWOTAnalysis {
    strengths: string[];
    weaknesses:string[];
    opportunities: string[];
    threats: string[];
}