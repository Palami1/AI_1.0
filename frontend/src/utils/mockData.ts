import { User, PortfolioItem, Stock, AIReport } from '../types';

export const mockUser: User = {
  id: 'usr_123',
  email: 'investor@laoai.com',
  name: 'Lao Investor',
  riskTolerance: 'LOW',
  role: 'USER',
};

export const mockStocks: Stock[] = [
  { id: 'btc', symbol: 'BTC/USDT', name: 'Bitcoin', type: 'CRYPTO', currentPrice: 65000 },
  { id: 'eth', symbol: 'ETH/USDT', name: 'Ethereum', type: 'CRYPTO', currentPrice: 3500 },
  { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', type: 'STOCK', currentPrice: 175 },
];

export const mockPortfolio: PortfolioItem[] = [
  {
    id: 'port_1',
    stockId: 'btc',
    quantity: 0.15,
    averageEntryPrice: 60000,
    currentValue: 9750,
    profitPercentage: 8.33,
  }
];

export const mockAIReport: AIReport = {
  id: 'rep_001',
  stockId: 'btc',
  action: 'WAIT',
  confidence: 85,
  riskLevel: 'HIGH',
  evidence: [
    'Momentum indicator shows divergence.',
    'Macro agent flags upcoming interest rate news.',
    'Volume profile indicates weak buying pressure.'
  ],
  weakness: [
    'Long-term trend is still technically bullish.',
    'Sentiment agent shows extreme fear (potential reversal).'
  ],
  timestamp: new Date().toISOString()
};
