import { create } from 'zustand';

export interface CryptoCoin {
  symbol: string;
  name: string;
  code: string;
  category: string;
  marketCap: number;
  currentPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  rank: number;
}

export interface WhaleEvent {
  id: string;
  action: string;
  type: string;
  coin: string;
  amount: number;
  valueUsd: number;
  route: string;
  timestamp: string;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  name: string;
  buyPrice: number;
  currentPrice: number;
  amount: number;
  totalCost: number;
  totalValue: number;
  pnlUsd: number;
  pnlPercent: number;
}

interface AppState {
  isAuthenticated: boolean;
  user: { id: string; name: string; role: string } | null;
  coins: CryptoCoin[];
  watchlist: string[];
  portfolio: PortfolioPosition[];
  whaleEvents: WhaleEvent[];
  wsConnected: boolean;
  fearAndGreed: { score: number; status: string; sentiment: string };
  
  // Actions
  loginWithPin: (pin: string) => boolean;
  logout: () => void;
  setCoins: (coins: CryptoCoin[]) => void;
  updateCoinPrice: (symbol: string, newPrice: number) => void;
  toggleWatchlist: (symbol: string) => void;
  setWsConnected: (connected: boolean) => void;
  addWhaleEvent: (event: WhaleEvent) => void;
  addPortfolioPosition: (pos: Omit<PortfolioPosition, 'id' | 'totalCost' | 'totalValue' | 'pnlUsd' | 'pnlPercent'>) => void;
  removePortfolioPosition: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: typeof window !== 'undefined' ? localStorage.getItem('lao_ai_auth') === 'true' : true,
  user: { id: 'master_user', name: 'ນັກລົງທຶນ VIP (Master Investor)', role: 'ເຈົ້າຂອງລະບົບ' },
  coins: [],
  watchlist: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'NEAR/USDT'],
  portfolio: [
    {
      id: 'p-1',
      symbol: 'BTC/USDT',
      name: 'Bitcoin',
      buyPrice: 62500,
      currentPrice: 66850,
      amount: 0.45,
      totalCost: 28125,
      totalValue: 30082.5,
      pnlUsd: 1957.5,
      pnlPercent: 6.96
    },
    {
      id: 'p-2',
      symbol: 'SOL/USDT',
      name: 'Solana',
      buyPrice: 145,
      currentPrice: 182.5,
      amount: 35,
      totalCost: 5075,
      totalValue: 6387.5,
      pnlUsd: 1312.5,
      pnlPercent: 25.86
    },
    {
      id: 'p-3',
      symbol: 'NEAR/USDT',
      name: 'NEAR Protocol',
      buyPrice: 5.20,
      currentPrice: 6.85,
      amount: 800,
      totalCost: 4160,
      totalValue: 5480,
      pnlUsd: 1320,
      pnlPercent: 31.73
    }
  ],
  whaleEvents: [],
  wsConnected: false,
  fearAndGreed: { score: 74, status: 'ໂລບມາກ (Greed)', sentiment: 'BULLISH' },

  loginWithPin: (pin: string) => {
    if (pin === '888888' || pin === '123456') {
      if (typeof window !== 'undefined') localStorage.setItem('lao_ai_auth', 'true');
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('lao_ai_auth');
    set({ isAuthenticated: false });
  },

  setCoins: (coins) => set({ coins }),

  updateCoinPrice: (symbol, newPrice) => {
    set((state) => ({
      coins: state.coins.map((c) =>
        c.symbol === symbol ? { ...c, currentPrice: newPrice } : c
      ),
      portfolio: state.portfolio.map((p) => {
        if (p.symbol === symbol) {
          const totalVal = p.amount * newPrice;
          const pnl = totalVal - p.totalCost;
          const pnlPct = (pnl / p.totalCost) * 100;
          return { ...p, currentPrice: newPrice, totalValue: totalVal, pnlUsd: pnl, pnlPercent: pnlPct };
        }
        return p;
      })
    }));
  },

  toggleWatchlist: (symbol) => {
    set((state) => {
      const exists = state.watchlist.includes(symbol);
      return {
        watchlist: exists ? state.watchlist.filter((s) => s !== symbol) : [...state.watchlist, symbol]
      };
    });
  },

  setWsConnected: (connected) => set({ wsConnected: connected }),

  addWhaleEvent: (event) => {
    set((state) => ({
      whaleEvents: [event, ...state.whaleEvents.slice(0, 24)]
    }));
  },

  addPortfolioPosition: (pos) => {
    set((state) => {
      const totalCost = pos.buyPrice * pos.amount;
      const totalValue = pos.currentPrice * pos.amount;
      const pnlUsd = totalValue - totalCost;
      const pnlPercent = (pnlUsd / totalCost) * 100;
      const newPos: PortfolioPosition = {
        id: `p-${Date.now()}`,
        ...pos,
        totalCost,
        totalValue,
        pnlUsd,
        pnlPercent
      };
      return { portfolio: [...state.portfolio, newPos] };
    });
  },

  removePortfolioPosition: (id) => {
    set((state) => ({
      portfolio: state.portfolio.filter((p) => p.id !== id)
    }));
  }
}));
