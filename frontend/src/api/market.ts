import { apiClient } from '@/lib/apiClient';

export interface StockPrice {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
}

export interface StockListItem {
  symbol: string;
  name: string;
  market: string;
  currentPrice: number;
}

export const marketApi = {
  getStocks: () => apiClient.get<StockListItem[]>('/market/stocks'),

  getPrice: (symbol: string) =>
    apiClient.get<StockPrice>(`/market/stocks/${symbol}/price`),

  getHistory: (symbol: string, timeframe: string = '1D') =>
    apiClient.get<{ symbol: string; data: unknown[] }>(`/market/stocks/${symbol}/history?timeframe=${timeframe}`),
};
