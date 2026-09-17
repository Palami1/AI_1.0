"use client";

import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Activity, 
  AlertTriangle,
  Zap,
  RefreshCw
} from "lucide-react";

export default function LiquidityHeatmapPage() {
  const [symbol, setSymbol] = useState("BTC");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLiquidity = async (target: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/liquidity/heatmap/${target}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiquidity(symbol);
  }, [symbol]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Flame className="w-7 h-7 text-amber-500 animate-pulse" />
            <span>Liquidity & Liquidation Heatmap (CoinGlass Level)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ແຜນທີ່ຄວາມຮ້ອນ Liquidation Clusters, Long/Short Squeeze Targets ແລະ Stop Hunt Zones
          </p>
        </div>

        {/* Coin Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-white/10">
          {["BTC", "ETH", "SOL"].map((coin) => (
            <button
              key={coin}
              onClick={() => setSymbol(coin)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                symbol === coin
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {coin}
            </button>
          ))}
        </div>
      </div>

      {/* Liquidation Visual Clusters Banner */}
      <div className="glass-panel p-6 space-y-4 border-amber-500/30 bg-gradient-to-br from-[#1c1208]/30 via-[#090d16] to-[#04060a]">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Liquidation Density Ladder ({symbol}/USDT)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-white">
            ລາຄາປັດຈຸບັນ: ${data?.currentPrice?.toLocaleString()}
          </span>
        </div>

        {/* Visual Liquidity Ladder */}
        <div className="space-y-2.5 font-mono text-xs">
          {data?.clusters?.map((c: any, index: number) => {
            const isCurrent = c.type === "CURRENT_PRICE";
            const isShort = c.type === "SHORT_LIQUIDATION";

            return (
              <div
                key={index}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? "bg-blue-600/30 border-blue-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    : isShort
                    ? "bg-rose-950/20 border-rose-500/30 text-rose-300 hover:border-rose-500/60"
                    : "bg-emerald-950/20 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${
                    isCurrent ? "bg-blue-400 animate-ping" : isShort ? "bg-rose-500" : "bg-emerald-500"
                  }`} />
                  <span className="font-bold text-sm text-white">${c.level.toLocaleString()}</span>
                  <span className="text-xs font-sans text-gray-300 hidden sm:inline">
                    {c.labelLao}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {!isCurrent && (
                    <span className="font-bold text-amber-400 text-sm">{c.volumeUsd}</span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-sans ${
                    isCurrent ? "bg-blue-500 text-white" : isShort ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                  }`}>
                    {c.density}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Notes */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>ບົດສະຫຼຸບສະພາບຄ່ອງ Liquidity:</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {data?.summaryLao}
          </p>
          <p className="text-[11px] text-gray-400 italic">
            ⚠️ {data?.stopHuntWarning}
          </p>
        </div>
      </div>
    </div>
  );
}
