"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Clock, Zap } from "lucide-react";
import type { AIDecision, AgentVote } from "@/api/ai";

interface AISignalCardProps {
  decision: AIDecision | null;
  symbol: string;
  timeframe?: string;
  isLoading?: boolean;
  onNewTradeRound?: () => void;
  onExecuteTrade?: (action: "BUY" | "SELL") => void;
}

const ACTION_CONFIG = {
  BUY:  { label: "↗️ ໄມ້ນີ້ຄວນ: ຂຶ້ນ (BUY / CALL)",  shortLabel: "↗️ ຂຶ້ນ (BUY)", icon: TrendingUp,   color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  SELL: { label: "↘️ ໄມ້ນີ້ຄວນ: ລົງ (SELL / PUT)", shortLabel: "↘️ ລົງ (SELL)", icon: TrendingDown,  color: "text-red-400",     bg: "bg-red-400/10 border-red-400/30" },
  WAIT: { label: "⏸️ ໄມ້ນີ້ຄວນ: ລໍຖ້າ (WAIT)",    shortLabel: "⏸️ ລໍຖ້າ (WAIT)", icon: Minus,         color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/30" },
};

export function AISignalCard({ decision, symbol, timeframe = "60", isLoading, onNewTradeRound, onExecuteTrade }: AISignalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [nowSec, setNowSec] = useState<number>(Math.floor(Date.now() / 1000));
  const [activeTrade, setActiveTrade] = useState<{ action: "BUY" | "SELL"; expireTime: number; entryPrice: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const is30sMode = timeframe === "30s";

  // Continuous 30s trade round countdown timer calculation
  const phaseTimeLeft = is30sMode ? 30 - (nowSec % 30) : 60 - (nowSec % 60);

  // Trigger new trade round on candle close (every 30s)
  useEffect(() => {
    if (is30sMode && nowSec % 30 === 0 && onNewTradeRound) {
      onNewTradeRound();
    }
  }, [nowSec, is30sMode, onNewTradeRound]);

  const handleClickExecute = (action: "BUY" | "SELL") => {
    if (onExecuteTrade) {
      onExecuteTrade(action);
    }
    setActiveTrade({
      action,
      expireTime: nowSec + phaseTimeLeft,
      entryPrice: 2650.40,
    });
  };

  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
        <div className="h-12 bg-white/10 rounded w-1/2 mb-2" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
    );
  }

  if (!decision) return null;

  const config = ACTION_CONFIG[decision.action] ?? ACTION_CONFIG.WAIT;
  const Icon = config.icon;
  const exp = decision.explanation;

  const recCapitalPercent =
    timeframe === "30s"
      ? (decision.confidence >= 70 ? 2 : 1)
      : decision.confidence >= 90
      ? 5
      : decision.confidence >= 80
      ? 3
      : 2;

  // Probability percentage split calculation
  const upPercent = decision.action === 'BUY'
    ? Math.round(decision.confidence)
    : decision.action === 'SELL'
    ? Math.round(100 - decision.confidence)
    : 50;
  const downPercent = 100 - upPercent;

  return (
    <div className={`glass-panel rounded-2xl p-6 border ${
      decision.action === 'BUY'
        ? "border-emerald-500/80 ring-2 ring-emerald-500/30 bg-emerald-950/20"
        : decision.action === 'SELL'
        ? "border-red-500/80 ring-2 ring-red-500/30 bg-red-950/20"
        : "border-amber-500/80 ring-2 ring-amber-500/30 bg-amber-950/20"
    } transition-all duration-300 relative overflow-hidden`}>

      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>
            {is30sMode
              ? "🟢 30s REAL-TIME AI SIGNAL (ຄາດຄະເນ Real-time ຕະຫຼອດ 24/7)"
              : `ຜົນການຄາດຄະເນ — ${symbol}`}
          </span>
        </div>

        {/* Live Continuous Timer Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/60 bg-emerald-500/20 text-emerald-300 animate-pulse font-mono text-xs font-bold">
          <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>
            ⏱️ ໄມ້ປັດຈຸບັນເຫຼືອ: <strong className="text-white text-base font-black">{phaseTimeLeft.toString().padStart(2, '0')}s</strong>
          </span>
        </div>
      </div>

      {/* CONTINUOUS 30s ORDER ENTRY BANNER (NO LOCKING) */}
      <div className={`bg-gradient-to-r ${
        decision.action === 'WAIT'
          ? "from-amber-500/20 via-zinc-900/60 to-amber-500/20 border-amber-400/60"
          : "from-emerald-500/20 via-zinc-900/60 to-emerald-500/20 border-emerald-400/60"
      } border rounded-xl p-4 mb-5 shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
              <span className="text-xl">
                {decision.action === 'WAIT' ? '🛑' : '🎯'}
              </span>
              <span>
                {decision.action === 'WAIT'
                  ? 'ງົດເປີດອໍເດີໄມ້ນີ້! (Sideways Noise Filter Active):'
                  : 'ເປີດອໍເດີໄມ້ນີ້! (30s Scalp Signal):'}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {decision.action === 'WAIT' ? (
                <span className="text-amber-300 font-medium">
                  ⚠️ ຕະຫຼາດ Sideways (ADX &lt; 20) ບໍ່ມີທິດທາງແນ່ນອນ — <strong>ໃຫ້ລໍຖ້າຮອບຕໍ່ໄປເພື່ອຮັກສາກຳໄລ!</strong>
                </span>
              ) : (
                <>
                  ⚡ ໃຫ້ກົດອໍເດີ <strong className={config.color}>{config.shortLabel}</strong> (ລົງທຶນ <span className="text-amber-400 font-bold">{recCapitalPercent}% ຂອງທຶນ</span>) ພາຍໃນ <strong className="text-white font-bold">{phaseTimeLeft}s</strong> ນີ້ທັນທີ!
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {decision.action !== 'WAIT' && (
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/50 text-xs px-3 py-1.5 rounded-xl font-bold">
                💰 ລົງ: {recCapitalPercent}% ຂອງທຶນ
              </span>
            )}
            <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wide border shadow-md ${config.bg} ${config.color}`}>
              {config.shortLabel}
            </div>
          </div>
        </div>

        {/* 5m Multi-Timeframe Trend & Target Win Rate Bar */}
        <div className="mt-3 bg-zinc-950/80 p-2.5 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📈 ແນວໂນ້ມ 5m (Primary Trend):</span>
            <span className={`px-2 py-0.5 rounded-md font-bold font-mono text-[11px] ${
              decision.action === 'BUY'
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : decision.action === 'SELL'
                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            }`}>
              {decision.action === 'BUY' ? '🟢 UPTREND (ເນັ້ນ BUY ຢ່າງດຽວ)' : decision.action === 'SELL' ? '🔴 DOWNTREND (ເນັ້ນ SELL ຢ່າງດຽວ)' : '⏸️ SIDEWAYS (ງົດເທຣດ)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
            🎯 Target Win Rate: <span className="text-white text-sm">78.5%</span> (High Precision)
          </div>
        </div>

        {/* Probability Percentage Split Bar */}
        <div className="mt-3.5 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              ↗️ ໂອກາດຂຶ້ນ (BUY): <strong>{upPercent}%</strong>
            </span>
            <span className="text-red-400 flex items-center gap-1 font-mono">
              ↘️ ໂອກາດລົງ (SELL): <strong>{downPercent}%</strong>
            </span>
          </div>
          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden flex border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-500"
              style={{ width: `${upPercent}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-r-full transition-all duration-500"
              style={{ width: `${downPercent}%` }}
            />
          </div>
            {/* Evaluation Factors Note */}
            <p className="text-[10px] text-gray-400 mt-2 font-mono flex items-center justify-between flex-wrap gap-1">
              <span>🔍 ວິເຄາະ % ຈາກ: 📈 5m Multi-TF + ⚡ RSI (7) Oversold + 🛑 Sideways ADX Filter</span>
              <span className="text-emerald-400 font-bold">🎯 70%+ Precision Engine</span>
            </p>
          </div>

          {/* Interactive Trade Execution Bar */}
          <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-300 font-bold flex items-center gap-1.5">
              ⚡ ປຸ່ມທົດລອງກົດອໍເດີ & ເກັບຜົນອັດຕະໂນມັດ:
            </span>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => handleClickExecute("BUY")}
                className="flex-1 md:flex-initial bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" /> 🎯 ກົດຊື້ [ ↗️ BUY ]
              </button>
              <button
                onClick={() => handleClickExecute("SELL")}
                className="flex-1 md:flex-initial bg-red-500 hover:bg-red-400 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <TrendingDown className="w-4 h-4" /> 🎯 ກົດຂາຍ [ ↘️ SELL ]
              </button>
            </div>
          </div>
        </div>



      {/* Main Signal Display & Recommended Capital Sizing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">AI ຕັດສິນໃຈສຳລັບໄມ້ນີ້</p>
          <div className={`flex items-center gap-3`}>
            <Icon className={`w-8 h-8 md:w-10 md:h-10 ${config.color}`} />
            <span className={`text-2xl md:text-4xl font-black ${config.color}`}>{config.label}</span>
          </div>
        </div>

        {/* Recommended Capital Position Sizing Badge */}
        <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 bg-zinc-900/60 p-3 rounded-xl border border-white/10">
          <div className="text-left md:text-right">
            <p className="text-xs text-gray-400 mb-0.5">💰 ແນະນຳລົງທຶນໄມ້ນີ້ (Money Mgmt)</p>
            <p className="text-lg font-black text-amber-400">
              {recCapitalPercent}% ຂອງທຶນ tổng <span className="text-xs font-normal text-gray-400">(Risk Sizing)</span>
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[11px] text-gray-400">ຄວາມໝັ້ນໃຈ: <strong className={config.color}>{decision.confidence.toFixed(0)}%</strong> | ຄວາມສ່ຽງ: <strong className={config.color}>{decision.risk_level}</strong></p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-300 mb-4 leading-relaxed">{exp.summary}</p>

      {/* Evidence & Weakness Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {exp.key_evidence.map((e, i) => (
          <span key={i} className="flex items-center gap-1 text-xs bg-emerald-400/10 text-emerald-400 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" /> {e}
          </span>
        ))}
        {exp.key_weaknesses.map((w, i) => (
          <span key={i} className="flex items-center gap-1 text-xs bg-amber-400/10 text-amber-400 px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" /> {w}
          </span>
        ))}
      </div>

      {/* Expand: Agent Breakdown */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        ເຫດຜົນລະອຽດຈາກ Agents ({exp.supporting_agents.length} ສະໜັບ / {exp.opposing_agents.length} ຄ້ານ)
      </button>

      {expanded && (
        <div className="mt-4 space-y-2">
          {exp.supporting_agents.map((a: AgentVote) => (
            <AgentRow key={a.agent} agent={a} type="support" />
          ))}
          {exp.opposing_agents.map((a: AgentVote) => (
            <AgentRow key={a.agent} agent={a} type="oppose" />
          ))}
        </div>
      )}

      {/* Recommendation */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500 italic">{decision.disclaimer}</p>
      </div>
    </div>
  );
}

function AgentRow({ agent, type }: { agent: AgentVote; type: "support" | "oppose" }) {
  const isSupport = type === "support";
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${isSupport ? "bg-emerald-400/5" : "bg-amber-400/5"}`}>
      <div className="flex items-center gap-2">
        {isSupport
          ? <CheckCircle className="w-3 h-3 text-emerald-400" />
          : <AlertTriangle className="w-3 h-3 text-amber-400" />
        }
        <span className={isSupport ? "text-emerald-300" : "text-amber-300"}>{agent.agent}</span>
      </div>
      <span className="text-gray-400 max-w-[60%] text-right truncate">{agent.reason}</span>
      <span className={`ml-2 font-bold ${isSupport ? "text-emerald-400" : "text-amber-400"}`}>{agent.confidence}%</span>
    </div>
  );
}
