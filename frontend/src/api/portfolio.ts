import { apiClient } from '@/lib/apiClient';

export interface PortfolioItem {
  id: string;
  stock_id: string;
  symbol: string;
  quantity: number;
  average_price: number;
  current_price?: number;
  pnl?: number;
  pnlPercent?: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  riskExposure: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const portfolioApi = {
  getPortfolio: () =>
    apiClient.get<PortfolioItem[]>('/portfolio/'),

  getRiskSummary: () =>
    apiClient.get<PortfolioSummary>('/portfolio/risk-summary'),
};
