"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore, CryptoCoin } from "@/store/useAppStore";
import { 
  TrendingUp, 
  TrendingDown, 
  BrainCircuit, 
  Sparkles, 
  Activity, 
  Flame, 
  BarChart3, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight,
  Layers,
  Search,
  Cpu,
  Radar,
  Landmark,
  Scale
} from "lucide-react";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { CryptoHeatmap } from "@/components/CryptoHeatmap";
import { WhaleActivityFeed } from "@/components/WhaleActivityFeed";
import { AIAlertsFeed } from "@/components/AIAlertsFeed";

export default function InstitutionalDashboardPage() {
  const { coins, setCoins, updateCoinPrice, setWsConnected, addWhaleEvent } = useAppStore();
  const [selectedChartCoin, setSelectedChartCoin] = useState("BTC/USDT");

  // WebSocket Live Stream & Initial Load
  useEffect(() => {
    fetch("http://localhost:8000/api/v1/market/coins")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCoins(data);
      })
      .catch(() => {});

    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket("ws://localhost:8000/ws/live");
      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => setWsConnected(false);
      ws.onerror = () => setWsConnected(false);
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "TICK" && payload.topCoins) {
            payload.topCoins.forEach((c: CryptoCoin) => {
              updateCoinPrice(c.symbol, c.currentPrice);
            });
          }
          if (payload.whaleEvent) {
            addWhaleEvent(payload.whaleEvent);
          }
        } catch (e) {}
      };
    } catch (e) {
      setWsConnected(false);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [setCoins, updateCoinPrice, setWsConnected, addWhaleEvent]);

  const btc = coins.find((c) => c.code === "BTC") || { code: "BTC", name: "Bitcoin", currentPrice: 66850, change24h: 3.85, symbol: "BTC/USDT" };
  const eth = coins.find((c) => c.code === "ETH") || { code: "ETH", name: "Ethereum", currentPrice: 3480, change24h: 4.20, symbol: "ETH/USDT" };
  const sol = coins.find((c) => c.code === "SOL") || { code: "SOL", name: "Solana", currentPrice: 182.5, change24h: 8.95, symbol: "SOL/USDT" };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Institutional Bloomberg Ticker Header */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="glass-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] text-gray-400 font-semibold flex items-center justify-between">
            <span>Market Cap</span>
            <DollarSign className="w-3.5 h-3.5 text-blue-400" />
          </span>
          <div className="mt-1">
            <span className="text-xl font-bold font-mono text-white">$2.38T</span>
            <span className="ml-2 text-xs font-semibold text-emerald-400">+3.42%</span>
          </div>
          <span className="text-[10px] text-gray-400">BTC Dom 55.4%</span>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] text-gray-400 font-semibold flex items-center justify-between">
            <span>Spot ETF Net Flow</span>
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <div className="mt-1">
            <span className="text-xl font-bold font-mono text-emerald-400">+$382.4M</span>
          </div>
          <span className="text-[10px] text-gray-400">BlackRock + Fidelity</span>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] text-gray-400 font-semibold flex items-center justify-between">
            <span>Open Interest (OI)</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </span>
          <div className="mt-1">
            <span className="text-xl font-bold font-mono text-purple-300">$34.8B</span>
            <span className="ml-1 text-xs text-emerald-400">+4.2%</span>
          </div>
          <span className="text-[10px] text-gray-400">Derivatives Depth</span>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between">
          <span className="text-[11px] text-gray-400 font-semibold flex items-center justify-between">
            <span>Funding Rate</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </span>
          <div className="mt-1">
            <span className="text-xl font-bold font-mono text-blue-400">0.0112%</span>
          </div>
          <span className="text-[10px] text-gray-400">Leverage Normal</span>
        </div>

        <div className="glass-panel p-4 flex flex-col justify-between bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-blue-950/40 border-purple-500/30 col-span-2 md:col-span-1">
          <span className="text-[11px] text-purple-300 font-semibold flex items-center justify-between">
            <span>Opportunity Radar</span>
            <Radar className="w-3.5 h-3.5 text-purple-400" />
          </span>
          <div className="mt-1">
            <span className="text-xl font-bold text-white">1,000 ຫຼຽນ</span>
          </div>
          <Link href="/radar" className="text-[10px] text-purple-300 hover:text-white flex items-center gap-1 font-semibold">
            <span>ເບິ່ງ Top Radar</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. Main 3 Crypto Big Cards (BTC, ETH, SOL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[btc, eth, sol].map((coin) => (
          <div 
            key={coin.code}
            onClick={() => setSelectedChartCoin(coin.symbol)}
            className={`glass-card p-5 cursor-pointer border relative overflow-hidden transition-all ${
              selectedChartCoin === coin.symbol ? "border-purple-500/80 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]" : "border-white/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold font-mono text-white text-sm">
                  {coin.code}
                </div>
                <div>
                  <h2 className="font-bold text-white text-base">{coin.name}</h2>
                  <span className="text-xs text-gray-400 font-mono">{coin.symbol}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                coin.change24h >= 0 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
              }`}>
                {coin.change24h >= 0 ? `+${coin.change24h}%` : `${coin.change24h}%`}
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-2xl font-bold font-mono text-white">
                ${coin.currentPrice.toLocaleString()}
              </div>
              <Link 
                href={`/analysis?symbol=${encodeURIComponent(coin.symbol)}`}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Sparkles className="w-3 h-3" />
                <span>10-Agent Consensus</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 3. TradingView Interactive Chart & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">Institutional TradingView Terminal ({selectedChartCoin})</h2>
            </div>
            <div className="flex items-center gap-2">
              {["BTC/USDT", "ETH/USDT", "SOL/USDT", "NEAR/USDT", "TAO/USDT"].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setSelectedChartCoin(sym)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-all ${
                    selectedChartCoin === sym 
                      ? "bg-purple-600 text-white font-bold shadow-sm" 
                      : "bg-slate-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {sym.split("/")[0]}
                </button>
              ))}
            </div>
          </div>
          <TradingViewWidget symbol={selectedChartCoin} height={440} />
        </div>

        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">ແຈ້ງເຕືອນ AI Consensus ສົດ</h2>
            </div>
            <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono">
              10 Agents
            </span>
          </div>
          <AIAlertsFeed />
        </div>
      </div>

      {/* 4. Crypto Heatmap Section */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Global Crypto Heatmap (ແຜນທີ່ຄວາມຮ້ອນຕະຫຼາດ)</h2>
              <p className="text-xs text-gray-400">ຂະໜາດຕາມ Market Cap • ສີຂຽວຂຶ້ນ / ສີແດງລົງ</p>
            </div>
          </div>
          <Link href="/market" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
            <span>ເບິ່ງຕະຫຼາດທັງໝົດ</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <CryptoHeatmap />
      </div>

      {/* 5. Whale Tracker Feed */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">Whale Intelligence Feed (ຕິດຕາມປາວານ)</h2>
              <p className="text-xs text-gray-400">ລາຍການຊື້-ຂາຍ ແລະ ຖອນອອກກະດານເທຣດ</p>
            </div>
          </div>
          <Link href="/whale" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
            <span>ເບິ່ງທັງໝົດ</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <WhaleActivityFeed />
      </div>
    </div>
  );
}
