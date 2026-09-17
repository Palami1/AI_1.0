export interface User {
  id: string;
  email: string;
  name: string;
  riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  role: 'USER' | 'ADMIN';
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  type: 'CRYPTO' | 'STOCK' | 'FX';
  currentPrice: number;
}

export interface MarketData {
  stockId: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PortfolioItem {
  id: string;
  stockId: string;
  quantity: number;
  averageEntryPrice: number;
  currentValue: number;
  profitPercentage: number;
}

export interface Analysis {
  stockId: string;
  timestamp: string;
  agentsVote: {
    trend: 'BUY' | 'SELL' | 'WAIT';
    momentum: 'BUY' | 'SELL' | 'WAIT';
    volume: 'BUY' | 'SELL' | 'WAIT';
    macro: 'BUY' | 'SELL' | 'WAIT';
  };
  overallScore: number;
}

export interface Risk {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  maxPositionSize: number;
  recommendation: string;
}

export interface AIReport {
  id: string;
  stockId: string;
  action: 'BUY' | 'SELL' | 'WAIT';
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: string[];
  weakness: string[];
  timestamp: string;
}
