"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Layers } from "lucide-react";

interface HeatmapItem {
  code: string;
  name: string;
  symbol: string;
  marketCap: number;
  change24h: number;
  price: number;
  category: string;
}

interface CryptoHeatmapProps {
  coins?: HeatmapItem[];
}

const DEFAULT_COINS: HeatmapItem[] = [
  { code: "BTC", name: "Bitcoin", symbol: "BTC/USDT", marketCap: 1320000000000, change24h: 3.85, price: 66850, category: "Layer1" },
  { code: "ETH", name: "Ethereum", symbol: "ETH/USDT", marketCap: 410000000000, change24h: 4.20, price: 3480, category: "Layer1" },
  { code: "SOL", name: "Solana", symbol: "SOL/USDT", marketCap: 86000000000, change24h: 8.95, price: 182.5, category: "Layer1" },
  { code: "BNB", name: "BNB", symbol: "BNB/USDT", marketCap: 84000000000, change24h: 1.45, price: 575.0, category: "Layer1" },
  { code: "DOGE", name: "Dogecoin", symbol: "DOGE/USDT", marketCap: 22000000000, change24h: 11.20, price: 0.148, category: "Meme" },
  { code: "NEAR", name: "NEAR Protocol", symbol: "NEAR/USDT", marketCap: 7800000000, change24h: 7.60, price: 6.85, category: "AI" },
  { code: "RENDER", name: "Render", symbol: "RNDR/USDT", marketCap: 5400000000, change24h: 9.40, price: 9.20, category: "AI" },
  { code: "TAO", name: "Bittensor", symbol: "TAO/USDT", marketCap: 3900000000, change24h: 14.80, price: 535.0, category: "AI" },
  { code: "UNI", name: "Uniswap", symbol: "UNI/USDT", marketCap: 6200000000, change24h: -1.85, price: 10.45, category: "DeFi" },
  { code: "AAVE", name: "Aave", symbol: "AAVE/USDT", marketCap: 2300000000, change24h: 5.10, price: 158.2, category: "DeFi" },
  { code: "PEPE", name: "Pepe", symbol: "PEPE/USDT", marketCap: 4800000000, change24h: -3.40, price: 0.0000114, category: "Meme" },
  { code: "SUI", name: "Sui", symbol: "SUI/USDT", marketCap: 4900000000, change24h: 6.25, price: 1.95, category: "Layer1" },
];

export function CryptoHeatmap({ coins = DEFAULT_COINS }: CryptoHeatmapProps) {
  const getBgClass = (change: number) => {
    if (change >= 7) return "bg-emerald-600/40 border-emerald-500/60 text-emerald-300";
    if (change > 0) return "bg-emerald-900/30 border-emerald-600/30 text-emerald-400";
    if (change <= -7) return "bg-rose-600/40 border-rose-500/60 text-rose-300";
    return "bg-rose-900/30 border-rose-600/30 text-rose-400";
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {coins.map((coin, index) => {
          const isBig = index === 0; // BTC
          const isMedium = index === 1 || index === 2; // ETH, SOL
          const bgStyle = getBgClass(coin.change24h);

          return (
            <Link
              key={coin.symbol}
              href={`/coin/${coin.code}`}
              className={`rounded-xl p-3 border transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between ${bgStyle} ${
                isBig ? "col-span-2 row-span-2 p-5" : isMedium ? "col-span-1 sm:col-span-2 p-4" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold font-mono ${isBig ? "text-xl" : "text-sm"} text-white`}>
                    {coin.code}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-gray-300 font-mono">
                    {coin.category}
                  </span>
                </div>
                {coin.change24h >= 0 ? (
                  <TrendingUp className={`${isBig ? "w-5 h-5" : "w-3.5 h-3.5"} text-emerald-400`} />
                ) : (
                  <TrendingDown className={`${isBig ? "w-5 h-5" : "w-3.5 h-3.5"} text-rose-400`} />
                )}
              </div>

              <div className="mt-3">
                <div className={`font-mono font-bold text-white ${isBig ? "text-2xl" : "text-sm"}`}>
                  ${coin.price < 0.01 ? coin.price.toFixed(6) : coin.price.toLocaleString()}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`font-mono font-semibold ${isBig ? "text-sm" : "text-xs"}`}>
                    {coin.change24h >= 0 ? `+${coin.change24h}%` : `${coin.change24h}%`}
                  </span>
                  <span className="text-[10px] text-gray-400 hidden sm:inline">24H</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
