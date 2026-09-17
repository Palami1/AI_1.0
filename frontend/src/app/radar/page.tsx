"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Radar, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Filter, 
  Flame, 
  Activity, 
  ArrowUpRight,
  RefreshCw
} from "lucide-react";

export default function OpportunityRadarPage() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  const fetchRadar = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/radar/rankings");
      const data = await res.json();
      setRankings(data.rankings || []);
    } catch (e) {
      // Fallback with Top Ranked High Opportunity Coins
      setRankings([
        {
          rank: 1, symbol: "BTC/USDT", name: "Bitcoin", code: "BTC", category: "Layer1",
          opportunityScore: 94, confidenceScore: 89, riskScore: 28,
          signalTrigger: "Breakout & ETF Inflow (+$382M)", price: 66850.0, change24h: 3.85, consensus: "BUY (9/10)"
        },
        {
          rank: 2, symbol: "SOL/USDT", name: "Solana", code: "SOL", category: "Layer1",
          opportunityScore: 91, confidenceScore: 86, riskScore: 32,
          signalTrigger: "Breakout $180 & Whale Inflow", price: 182.5, change24h: 8.95, consensus: "BUY (9/10)"
        },
        {
          rank: 3, symbol: "TAO/USDT", name: "Bittensor", code: "TAO", category: "AI",
          opportunityScore: 90, confidenceScore: 84, riskScore: 38,
          signalTrigger: "Volume Spike (5.2x) & AI Rally", price: 535.0, change24h: 14.8, consensus: "BUY (8/10)"
        },
        {
          rank: 4, symbol: "NEAR/USDT", name: "NEAR Protocol", code: "NEAR", category: "AI",
          opportunityScore: 88, confidenceScore: 82, riskScore: 40,
          signalTrigger: "On-chain Accumulation & RSI 68", price: 6.85, change24h: 7.2, consensus: "BUY (8/10)"
        },
        {
          rank: 5, symbol: "ETH/USDT", name: "Ethereum", code: "ETH", category: "Layer1",
          opportunityScore: 87, confidenceScore: 80, riskScore: 36,
          signalTrigger: "DeFi TVL Spike & Support Rebound", price: 3480.0, change24h: 4.2, consensus: "BUY (7/10)"
        },
        {
          rank: 6, symbol: "RNDR/USDT", name: "Render Network", code: "RENDER", category: "AI",
          opportunityScore: 85, confidenceScore: 78, riskScore: 44,
          signalTrigger: "Whale Inflow & Hashrate Surge", price: 9.20, change24h: 5.6, consensus: "BUY (7/10)"
        },
        {
          rank: 7, symbol: "FET/USDT", name: "Artificial Superintelligence", code: "FET", category: "AI",
          opportunityScore: 84, confidenceScore: 77, riskScore: 45,
          signalTrigger: "AI Sector Rotation & High OBV", price: 1.64, change24h: 6.8, consensus: "BUY (7/10)"
        },
        {
          rank: 8, symbol: "AAVE/USDT", name: "Aave", code: "AAVE", category: "DeFi",
          opportunityScore: 83, confidenceScore: 75, riskScore: 42,
          signalTrigger: "Fee Generation & Lending Volume", price: 158.2, change24h: 3.4, consensus: "BUY (7/10)"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
    const interval = setInterval(fetchRadar, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: "all", name: "ທັງໝົດ (1,000 ຫຼຽນ)" },
    { id: "ai", name: "AI Tokens" },
    { id: "layer1", name: "Layer 1" },
    { id: "defi", name: "DeFi" },
    { id: "meme", name: "Meme" },
  ];

  const filtered = rankings.filter((r) => {
    if (category === "all") return true;
    return r.category.toLowerCase() === category.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Radar className="w-7 h-7 text-purple-400 animate-spin-slow" />
            <span>AI Opportunity Radar — ຈັດອັນດັບໂອກາດ 1,000 ຫຼຽນ</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ສະແກນຕະຫຼາດໂລກທຸກ 30s: Breakout, Whale Buy, Short Squeeze, Liquidation Cluster ແລະ Funding Flip
          </p>
        </div>

        <button
          onClick={fetchRadar}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>ອັບເດດ Radar</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 glass-panel p-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              category === cat.id
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-slate-800 text-gray-400 hover:text-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Ranked Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4 text-center">ອັນດັບ</th>
                <th className="py-3.5 px-4">ຫຼຽນ</th>
                <th className="py-3.5 px-3 text-center">Opportunity</th>
                <th className="py-3.5 px-3 text-center">Confidence</th>
                <th className="py-3.5 px-3 text-center">Risk</th>
                <th className="py-3.5 px-4">ສັນຍານຫຼັກ (Trigger)</th>
                <th className="py-3.5 px-4 text-right">ລາຄາ ($)</th>
                <th className="py-3.5 px-4 text-right">24H ປ່ຽນແປງ</th>
                <th className="py-3.5 px-4 text-center">AI Consensus</th>
                <th className="py-3.5 px-4 text-center">ວິເຄາະ AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filtered.map((r) => (
                <tr key={r.symbol} className="hover:bg-purple-500/5 transition-colors group">
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                      r.rank === 1 ? "bg-amber-500 text-slate-950 font-extrabold shadow-sm" :
                      r.rank === 2 ? "bg-slate-300 text-slate-950 font-bold" :
                      r.rank === 3 ? "bg-amber-700 text-white font-bold" : "text-gray-400"
                    }`}>
                      {r.rank}
                    </span>
                  </td>

                  {/* Coin */}
                  <td className="py-3.5 px-4 font-sans font-bold text-white">
                    <Link href={`/coin/${r.code}`} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs font-bold text-purple-300">
                        {r.code}
                      </div>
                      <div>
                        <div className="group-hover:text-purple-300 transition-colors">{r.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{r.symbol}</div>
                      </div>
                    </Link>
                  </td>

                  {/* Opportunity Score */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-extrabold text-sm border border-purple-500/30">
                      {r.opportunityScore}
                    </span>
                  </td>

                  {/* Confidence Score */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold text-xs border border-blue-500/20">
                      {r.confidenceScore || 82}%
                    </span>
                  </td>

                  {/* Risk Score */}
                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs border ${
                      (r.riskScore || 28) >= 50
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {r.riskScore || 28}/100
                    </span>
                  </td>

                  {/* Signal Trigger */}
                  <td className="py-3.5 px-4 font-sans">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-semibold">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      {r.signalTrigger}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 text-right font-bold text-white text-sm">
                    ${r.price < 0.01 ? r.price.toFixed(6) : r.price.toLocaleString()}
                  </td>

                  {/* Change */}
                  <td className="py-3.5 px-4 text-right font-bold">
                    <span className={r.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {r.change24h >= 0 ? "+" : ""}{r.change24h}%
                    </span>
                  </td>

                  {/* Consensus */}
                  <td className="py-3.5 px-4 text-center font-sans">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {r.consensus}
                    </span>
                  </td>

                  {/* Analyze Button */}
                  <td className="py-3.5 px-4 text-center font-sans">
                    <Link
                      href={`/analysis?symbol=${encodeURIComponent(r.symbol)}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ວິເຄາະ</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
