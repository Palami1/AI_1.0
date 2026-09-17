"use client";

import React from "react";
import { CheckCircle2, XCircle, TrendingUp, BarChart3 } from "lucide-react";

export interface TradeRecord {
  id: number;
  time: string;
  symbol: string;
  action: "BUY" | "SELL";
  result: "WIN" | "LOSS";
  amount: number;
  profit: number;
}

interface TradeHistoryCardProps {
  history: TradeRecord[];
  onAddResult?: (result: "WIN" | "LOSS") => void;
}

export function TradeHistoryCard({ history, onAddResult }: TradeHistoryCardProps) {
  const total = history.length;
  const wins = history.filter((t) => t.result === "WIN").length;
  const losses = history.filter((t) => t.result === "LOSS").length;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";
  const netProfit = history.reduce((acc, t) => acc + t.profit, 0);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-zinc-800 bg-zinc-900/60">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            ບັນທຶກຜົນການເທຣດ 20 ໄມ້ (Trade History Log)
          </h3>
        </div>

        {/* Win Rate Stats Badge */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700">
            <span>Win Rate: </span>
            <strong className={`${Number(winRate) >= 60 ? "text-emerald-400" : "text-amber-400"} text-sm font-bold`}>
              {winRate}%
            </strong>
          </div>
          <div className="bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700">
            <span className="text-emerald-400 font-bold">✅ {wins} WIN</span>
            <span className="text-gray-500 mx-1.5">|</span>
            <span className="text-red-400 font-bold">❌ {losses} LOSS</span>
          </div>
        </div>
      </div>

      {/* Manual Test Tracker Buttons */}
      {onAddResult && (
        <div className="flex items-center justify-between gap-2 mb-4 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
          <span className="text-xs text-gray-300 font-medium">
            ➕ ທົດລອງບັນທຶກຜົນໄມ້ນີ້:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddResult("WIN")}
              className="flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> ໄມ້ນີ້ WIN (ຊະນະ)
            </button>
            <button
              onClick={() => onAddResult("LOSS")}
              className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              <XCircle className="w-3.5 h-3.5" /> ໄມ້ນີ້ LOSS (ເສຍ)
            </button>
          </div>
        </div>
      )}

      {/* History Grid List */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 font-mono text-xs">
        {history.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
              item.result === "WIN"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                : "bg-red-500/10 border-red-500/40 text-red-400"
            }`}
          >
            <span className="text-[10px] text-gray-400 mb-0.5">ໄມ້ {idx + 1}</span>
            {item.result === "WIN" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-[10px] font-bold mt-1">
              {item.result === "WIN" ? "+85%" : "-100%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
