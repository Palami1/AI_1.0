"use client";

import { ShieldCheck, ShieldAlert, ShieldOff, Zap } from "lucide-react";

interface RiskScoreGaugeProps {
  score: number;
  level: string;
}

const LEVEL_CONFIG: Record<string, { color: string; bg: string; border: string; icon: typeof ShieldCheck; label: string }> = {
  Safe:          { color: "text-emerald-400", bg: "bg-emerald-400",  border: "border-emerald-400/30", icon: ShieldCheck, label: "ປອດໄພ" },
  Moderate:      { color: "text-amber-400",   bg: "bg-amber-400",    border: "border-amber-400/30",   icon: ShieldAlert, label: "ລະວັງ" },
  Danger:        { color: "text-orange-400",  bg: "bg-orange-400",   border: "border-orange-400/30",  icon: ShieldAlert, label: "ອັນຕະລາຍ" },
  "Stop Trading":{ color: "text-red-400",     bg: "bg-red-400",      border: "border-red-400/30",     icon: ShieldOff,   label: "ຢຸດ" },
};

export function RiskScoreGauge({ score, level }: RiskScoreGaugeProps) {
  const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.Moderate;
  const Icon = config.icon;
  const pct = Math.min(100, Math.max(0, score));

  return (
    <div className={`glass-panel rounded-2xl p-6 border ${config.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Risk Score</p>
          <p className={`text-5xl font-black ${config.color}`}>{score.toFixed(0)}</p>
        </div>
        <div className={`p-3 rounded-xl ${config.color} bg-white/5`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${config.bg} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        <span>0 ປອດໄພ</span>
        <span>60 ລະວັງ</span>
        <span>80 ອັນຕະລາຍ</span>
        <span>100 ຢຸດ</span>
      </div>

      <p className={`text-sm font-bold ${config.color}`}>{config.label}</p>
      <p className="text-xs text-gray-500 mt-1">
        {level === "Stop Trading"
          ? "Circuit Breaker ເປີດໃຊ້ງານ — ບໍ່ຮັບ Signal BUY ໃດໆ"
          : "ລະບົບ Risk Engine ກຳລັງຄຸ້ມຄອງຄວາມສ່ຽງ"}
      </p>
    </div>
  );
}
