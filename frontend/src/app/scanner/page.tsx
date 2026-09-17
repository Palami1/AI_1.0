"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  Zap, 
  Filter, 
  Flame, 
  TrendingUp, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  Clock 
} from "lucide-react";

export default function SmartScannerPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/scanner/signals");
      const data = await res.json();
      setSignals(data.signals || []);
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 15000); // 15s auto refresh
    return () => clearInterval(interval);
  }, []);

  const filterTabs = [
    { id: "all", label: "ທັງໝົດ" },
    { id: "breakout", label: "Breakout (ທະລຸແນວຕ້ານ)" },
    { id: "volume", label: "Volume Spike" },
    { id: "whale", label: "Whale Buy (ປາວານຊື້)" },
    { id: "rsi", label: "RSI Oversold" },
    { id: "macd", label: "MACD Cross" },
  ];

  const filteredSignals = signals.filter((s) => {
    if (activeFilter === "all") return true;
    return s.signalType.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Search className="w-7 h-7 text-purple-400" />
            <span>Smart Scanner — ສະແກນຫຼຽນອັດຕະໂນມັດ 24/7</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ລະບົບກວດສອບ 500+ ຫຼຽນທຸກ 30 ວິນາທີ: Volume Spike, Breakout, RSI, MACD ແລະ Whale Accumulation
          </p>
        </div>

        <button
          onClick={fetchSignals}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-semibold border border-white/10 transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
          <span>ສະແກນໃໝ່ດຽວນີ້</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 glass-panel p-3">
        <span className="text-xs text-gray-400 mr-2 flex items-center gap-1 font-medium">
          <Filter className="w-3.5 h-3.5" /> ປະເພດສັນຍານ:
        </span>
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === tab.id
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-slate-800 text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Signals Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSignals.map((sig) => (
          <div
            key={sig.id}
            className="glass-card p-5 flex flex-col justify-between border-white/5 hover:border-purple-500/40 transition-all group"
          >
            <div>
              {/* Header Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold font-mono text-white text-sm">
                    {sig.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                      {sig.name}
                    </h3>
                    <span className="text-xs text-gray-400 font-mono">{sig.symbol}</span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  sig.change24h >= 0 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}>
                  {sig.change24h >= 0 ? "+" : ""}{sig.change24h}%
                </span>
              </div>

              {/* Signal Badge */}
              <div className="mt-3.5 flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-sans flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  {sig.signalType}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">{sig.timestamp}</span>
              </div>

              {/* Price & Ratio */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-gray-400 block text-[10px]">ລາຄາປັດຈຸບັນ</span>
                  <span className="font-bold text-white text-sm">${sig.price.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Volume Ratio</span>
                  <span className="font-bold text-emerald-400 text-sm">{sig.volumeRatio}</span>
                </div>
              </div>

              {/* Detail Lao */}
              <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                {sig.detailLao}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">ຄວາມໝັ້ນໃຈ:</span>
                <span className="text-xs font-bold font-mono text-emerald-400">{sig.confidence}%</span>
              </div>

              <Link
                href={`/analysis?symbol=${encodeURIComponent(sig.symbol)}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Consensus ວິເຄາະ</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
