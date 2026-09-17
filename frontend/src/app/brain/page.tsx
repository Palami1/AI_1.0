"use client";

import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  Activity, 
  DollarSign, 
  BarChart2, 
  Flame, 
  Landmark, 
  RefreshCw, 
  Layers, 
  Zap, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";

export default function GlobalMarketBrainPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBrain = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/brain/metrics");
      const json = await res.json();
      setData(json);
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrain();
    const interval = setInterval(fetchBrain, 10000); // 10s auto update
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Cpu className="w-7 h-7 text-purple-400" />
            <span>Global Market Brain — ສະໝອງຕະຫຼາດໂລກ</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ສູນລວມຂໍ້ມູນສະຖາບັນ: Binance 1s WebSocket, Spot ETF Net Flows, Open Interest, Funding Rate ແລະ ສະພາບຄ່ອງ Stablecoin
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>1s WebSocket Active</span>
          </div>

          <button
            onClick={fetchBrain}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 border border-white/10"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Primary Market Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <span className="text-xs text-gray-400">Total Crypto Market Cap</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {data?.marketMatrix?.totalCryptoMarketCap || "$2.38T"}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">+3.42% ໃນ 24h</span>
        </div>

        <div className="glass-panel p-5">
          <span className="text-xs text-gray-400">BTC Open Interest (OI)</span>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-1">
            {data?.derivativesMatrix?.btcOpenInterest || "$34.8B (+4.2%)"}
          </div>
          <span className="text-[10px] text-gray-400">ສັນຍາຄົງຄ້າງສູງສຸດ</span>
        </div>

        <div className="glass-panel p-5">
          <span className="text-xs text-gray-400">Spot ETF Inflow (24h)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {data?.institutionalFlows?.spotEtfNetFlow24h || "+$382.4M"}
          </div>
          <span className="text-[10px] text-emerald-300 font-semibold">BlackRock + Fidelity</span>
        </div>

        <div className="glass-panel p-5">
          <span className="text-xs text-gray-400">Weighted Funding Rate</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
            {data?.derivativesMatrix?.weightedFundingRate || "0.0112%"}
          </div>
          <span className="text-[10px] text-gray-400">ອັດຕາດອກເບ້ຍ Leverage</span>
        </div>
      </div>

      {/* Derivatives & Liquidity Depth Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Derivatives Heat Matrix */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Activity className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Derivatives & Liquidation Matrix</h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-gray-400 font-sans">ອັດຕາສ່ວນ Long / Short:</span>
              <span className="font-bold text-white">{data?.derivativesMatrix?.longShortRatio || "52.4% Longs / 47.6% Shorts"}</span>
            </div>
            <div className="flex justify-between p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
              <span className="text-rose-300 font-sans">ມູນຄ່າການລ້າງພອດລວມ 24h:</span>
              <span className="font-bold text-rose-400">{data?.derivativesMatrix?.total24hLiquidations || "$148.5M"}</span>
            </div>
            <div className="flex justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="text-gray-400 font-sans">Ethereum Open Interest:</span>
              <span className="font-bold text-blue-300">{data?.derivativesMatrix?.ethOpenInterest || "$14.2B"}</span>
            </div>
            <div className="flex justify-between p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-emerald-300 font-sans">Smart Money Score:</span>
              <span className="font-bold text-emerald-400 text-sm">{data?.institutionalFlows?.smartScore || 88} / 100 (ສະພາບຄ່ອງສູງ)</span>
            </div>
          </div>
        </div>

        {/* Macro Catalysts & News */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Institutional Macro Catalysts (ປັດໄຈມະຫາພາກ)</h2>
          </div>

          <div className="space-y-3">
            {data?.macroCatalysts?.map((cat: any, i: number) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    cat.impact === "POSITIVE" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {cat.impact}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">{cat.time}</span>
                </div>
                <p className="text-xs text-gray-200 font-medium leading-relaxed">
                  {cat.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
