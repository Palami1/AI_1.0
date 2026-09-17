"use client";

import React, { useState } from "react";
import { Bot, Play, Pause, Cpu, Sliders, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { TradeRecord } from "./TradeHistoryCard";

interface AutoTraderEngineCardProps {
  isAutoRunning: boolean;
  onToggleAuto: (running: boolean) => void;
  history: TradeRecord[];
}

export function AutoTraderEngineCard({ isAutoRunning, onToggleAuto, history }: AutoTraderEngineCardProps) {
  const total = history.length;
  const wins = history.filter((t) => t.result === "WIN").length;
  const losses = history.filter((t) => t.result === "LOSS").length;
  const winRate = total > 0 ? (wins / total) * 100 : 0;
  const totalProfit = history.reduce((acc, t) => acc + t.profit, 0);

  // Generate dynamic AI tuning feedback based on win rate performance
  const getOptimizationAdvice = () => {
    if (total === 0) {
      return {
        status: "WAITING",
        title: "⚙️ ກຳລັງຖ້າຂໍ້ມູນການເທຣດອັດຕະໂນມັດ...",
        detail: "ເປີດລະບົບ Auto Paper-Trader ເພື່ອໃຫ້ AI ເກັບຂໍ້ມູນ 20 ໄມ້ ມາປະເມີນຄ່າ Parameter.",
        recommendation: "ໃຫ້ເປີດປຸ່ມ AUTO-TRADER (ON) ດ້ານລຸ່ມ.",
        color: "text-gray-400",
        borderColor: "border-zinc-700",
      };
    }

    if (winRate >= 75) {
      return {
        status: "OPTIMAL",
        title: "🟢 ລະບົບ AI ມີຄວາມແນ່ນອນສູງຫຼາຍ (Win Rate > 75%)",
        detail: `ຈາກການປະເມີນຜົນ ${total} ໄມ້: ຊະນະ ${wins} / ເສຍ ${losses} (Win Rate: ${winRate.toFixed(1)}%). ຕົວແປ Indicator (EMA 9/21 + RSI 7) ເຮັດງານໄດ້ດີຫຼາຍ!`,
        recommendation: "✅ ຄຳແນະນຳ: ບໍ່ຕ້ອງປັບ Parameters ເພີ່ມ. ຮັກສາຄ່າປັດຈຸບັນ ແລະ ສາມາດເພີ່ມ Position Size ເປັນ 3% ຂອງທຶນໄດ້.",
        color: "text-emerald-400",
        borderColor: "border-emerald-500/40 bg-emerald-500/10",
      };
    } else if (winRate >= 65) {
      return {
        status: "GOOD",
        title: "🟡 ລະບົບປະມວນຜົນໄດ້ດີ (Win Rate 65% - 75%)",
        detail: `ຈາກການປະເມີນຜົນ ${total} ໄມ້: ຊະນະ ${wins} / ເສຍ ${losses} (Win Rate: ${winRate.toFixed(1)}%). ມີ Loss Streak ໃນບາງຮອບ.`,
        recommendation: "⚡ ຄຳແນະນຳປັບຕື່ມ: ປັບຄ່າ RSI (7) Threshold ເຂັ້ມຂຶ້ນເປັນ 25/75 (ຈາກ 30/70) ເພື່ອກັ່ນກອງ False Breakout.",
        color: "text-amber-400",
        borderColor: "border-amber-500/40 bg-amber-500/10",
      };
    } else {
      return {
        status: "NEEDS_TUNING",
        title: "🔴 ຕະຫຼາດມີ Noise ສູງ — ຕ້ອງປັບ Parameters ກັ່ນກອງ (Win Rate < 65%)",
        detail: `ຈາກການປະເມີນຜົນ ${total} ໄມ້: ຊະນະ ${wins} / ເສຍ ${losses} (Win Rate: ${winRate.toFixed(1)}%). ຕະຫຼາດ Sideways ລົບກວນສັນຍານ.`,
        recommendation: "🛠️ ຄຳແນະນຳປັບຕື່ມ: ເພີ່ມ ADX Filter Threshold ເປັນ > 25 (ເພື່ອຂ້າມຕະຫຼາດ Sideways 100%) ແລະ ປັບ EMA ຈາກ 9/21 ເປັນ 12/26.",
        color: "text-red-400",
        borderColor: "border-red-500/40 bg-red-500/10",
      };
    }
  };

  const advice = getOptimizationAdvice();

  return (
    <div className="glass-panel rounded-2xl p-6 border border-zinc-800 bg-zinc-900/80 mb-6">
      {/* Top Header & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-400">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                🤖 ລະບົບ AUTO PAPER-TRADER 24/7 & AI SELF-OPTIMIZATION
              </h3>
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                AUTO-EVALUATE
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              ລະບົບຈະລົງເທຣດອັດຕະໂນມັດທຸກໆ 30 ວິນາທີ ພ້ອມເກັບຜົນມາປະເມີນຄ່າ Parameter ເພື່ອປັບໃຫ້ແນ່ນອນ 70%+
            </p>
          </div>
        </div>

        {/* Auto Trader Toggle Switch */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-300 font-mono">
            {isAutoRunning ? "🟢 AUTO-TRADER: RUNNING" : "⏸️ AUTO-TRADER: PAUSED"}
          </span>
          <button
            onClick={() => onToggleAuto(!isAutoRunning)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wide border shadow-lg transition-all cursor-pointer ${
              isAutoRunning
                ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 border-emerald-400 shadow-emerald-500/30 active:scale-95 animate-pulse"
                : "bg-zinc-800 hover:bg-zinc-700 text-gray-300 border-zinc-600 active:scale-95"
            }`}
          >
            {isAutoRunning ? (
              <>
                <Pause className="w-4 h-4" /> ປິດ AUTO-TRADER
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> ເປີດ AUTO-TRADER
              </>
            )}
          </button>
        </div>
      </div>

      {/* Auto Trader Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 font-mono">
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-white/10">
          <p className="text-[11px] text-gray-400">ຈຳນວນໄມ້ Auto-Trade</p>
          <p className="text-xl font-black text-white mt-1">{total} ໄມ້</p>
        </div>

        <div className="bg-zinc-950/80 p-3 rounded-xl border border-white/10">
          <p className="text-[11px] text-gray-400">Win Rate ຮວມ</p>
          <p className={`text-xl font-black mt-1 ${winRate >= 70 ? "text-emerald-400" : "text-amber-400"}`}>
            {winRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-zinc-950/80 p-3 rounded-xl border border-white/10">
          <p className="text-[11px] text-gray-400">ຜົນກຳໄລລວມ (Simulated)</p>
          <p className={`text-xl font-black mt-1 ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {totalProfit >= 0 ? `+$${totalProfit.toFixed(2)}` : `-$${Math.abs(totalProfit).toFixed(2)}`}
          </p>
        </div>

        <div className="bg-zinc-950/80 p-3 rounded-xl border border-white/10">
          <p className="text-[11px] text-gray-400">ສະຖານະ AI Engine</p>
          <p className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 animate-spin" /> Self-Tuning Active
          </p>
        </div>
      </div>

      {/* Dynamic AI Self-Optimization Feedback Panel */}
      <div className={`p-4 rounded-xl border ${advice.borderColor} transition-all`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h4 className={`text-xs font-bold ${advice.color} uppercase tracking-wider`}>
            {advice.title}
          </h4>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-medium mb-2">
          {advice.detail}
        </p>
        <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-white/10 text-xs font-mono text-emerald-300">
          {advice.recommendation}
        </div>
      </div>
    </div>
  );
}
