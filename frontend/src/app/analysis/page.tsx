"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Layers, 
  HelpCircle,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  Loader2,
  Sliders,
  Scale,
  Vote,
  Ban,
  ShieldAlert
} from "lucide-react";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get("symbol") || "BTC/USDT";

  const [symbol, setSymbol] = useState(initialSymbol);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const popularCoins = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "NEAR/USDT", "TAO/USDT", "RNDR/USDT", "DOGE/USDT"];

  const runAnalysis = async (targetSymbol: string) => {
    setLoading(true);
    try {
      const cleanSym = targetSymbol.replace("/", "%2F");
      const res = await fetch(`http://localhost:8000/api/v1/ai/analyze/${cleanSym}`, {
        method: "POST"
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (e) {
      // Fallback
      setAnalysisResult({
        symbol: targetSymbol,
        currentPrice: 66850,
        tripleScore: {
          opportunityScore: 91.0,
          opportunityMeaning: "ຄວາມສອດຄ່ອງຂອງສັນຍານ 10 Agents",
          confidenceScore: 76.0,
          confidenceMeaning: "ຄວາມໝັ້ນໃຈຕົວແບບ (Brier Calibrated)",
          riskScore: 38.0,
          riskMeaning: "ລະດັບຄວາມສ່ຽງຕະຫຼາດ (Safe Zone)"
        },
        action: "ຊື້",
        actionEn: "BUY",
        actionColor: "emerald",
        noTradeReasons: [],
        consensus: {
          ratio: "8/10",
          summary: "ຊື້ (8/10 ສຽງ)",
          strengthPercent: 80.0,
          totalAgents: 10,
          buyVotes: 8,
          sellVotes: 0,
          waitVotes: 2
        },
        riskLevel: "ຕ່ຳ (LOW)",
        agentsBreakdown: [
          { name: "Trend Agent (18%)", weight: "18%", score: 94, vote: "BUY", detail: "ລາຄາຢືນເໜືອ EMA20/50/200 ໂຄງສ້າງແນວໂນ້ມຂາຂຶ້ນແຂງແກ່ນ." },
          { name: "Momentum Agent (14%)", weight: "14%", score: 88, vote: "BUY", detail: "RSI ຢູ່ໃນເກນສຸຂະພາບດີ ບໍ່ມີ Overbought ແລະ MACD ຕັດຂຶ້ນ." },
          { name: "Volume Agent (12%)", weight: "12%", score: 90, vote: "BUY", detail: "Volume ເພີ່ມຂຶ້ນ 42% ເໜືອຄ່າສະເລ່ຍ ພ້ອມເສັ້ນ OBV ຍົກຕົວ." },
          { name: "Whale Agent (10%)", weight: "10%", score: 92, vote: "BUY", detail: "ພົບປາວານຖອນຫຼຽນອອກຈາກກະດານເທຣດເຂົ້າ Cold Storage." },
          { name: "News Agent (10%)", weight: "10%", score: 85, vote: "BUY", detail: "ຂ່າວສານຫຼ້າສຸດເປັນບວກ ມີການເປີດຮັບຈາກສະຖາບັນ." },
          { name: "Liquidity Agent (8%)", weight: "8%", score: 86, vote: "BUY", detail: "Orderbook ມີ Bid Wall ຝັ່ງຊື້ໜາແໜ້ນ ແຮງດູດສະພາບຄ່ອງແຂງແກ່ນ." },
          { name: "Funding Agent (8%)", weight: "8%", score: 90, vote: "BUY", detail: "Funding Rate ຢູ່ໃນລະດັບປົກກະຕິ (0.011%) ບໍ່ມີ Overleveraged Longs." },
          { name: "OI Agent (8%)", weight: "8%", score: 88, vote: "BUY", detail: "Open Interest (OI) ເພີ່ມຂຶ້ນ +8.4% ພ້ອມລາຄາທີ່ຍົກສູງ." },
          { name: "ETF Agent (7%)", weight: "7%", score: 94, vote: "BUY", detail: "Spot ETF ມີ Net Inflow ຕໍ່ເນື່ອງ +$382M/ວັນ." },
          { name: "Sentiment Agent (5%)", weight: "5%", score: 74, vote: "WAIT", detail: "Fear & Greed ຢູ່ທີ່ 74 (ໂລບມາກ) ຕະຫຼາດມີຄວາມໝັ້ນໃຈສູງ." }
        ],
        evidence: [
          "ໂຄງສ້າງລາຄາເປັນຂາຂຶ້ນແຂງແກ່ນ (Bullish Market Structure) ບໍ່ມີສັນຍານຫຼຸດເສັ້ນແນວຮັບ.",
          "ແຮງຊື້ Momentum ສະໝ່ຳສະເໝີ ແລະ ບໍ່ເກີດ Bearish Divergence.",
          "ປະລິມານ Volume ແລະ ກະແສເງິນ Spot ETF ສະໜັບສະໜູນການທະລຸແນວຕ້ານ.",
          "ຂໍ້ມູນ On-chain ສະແດງເຖິງການສະສົມຂອງປາວານລາຍໃຫຍ່."
        ],
        weakness: [
          "Opportunity Score ໝາຍເຖິງຄວາມສອດຄ່ອງຂອງສັນຍານ 10 Agents ເທົ່ານັ້ນ ບໍ່ແມ່ນການຮັບປະກັນກຳໄລ 100%.",
          "ຖ້າລາຄາຫຼຸດເສັ້ນ Stop Loss ແນະນຳ ຄວນຕັດຂາດທຶນຕາມລະບົບທັນທີ.",
          "ຫ້າມ Overtrade ຄວນໃຊ້ສູດ Half Kelly ຫຼື ບໍ່ເກີນ 5% ຂອງພອດລວມ."
        ],
        scenarios: [
          { label: "1 ຊົ່ວໂມງ (1H)", bull: 67650, base: 66980, bear: 66250 },
          { label: "4 ຊົ່ວໂມງ (4H)", bull: 69180, base: 67380, bear: 65380 },
          { label: "1 ວັນ (1D)", bull: 71400, base: 67850, bear: 63650 },
          { label: "1 ອາທິດ (1W)", bull: 76500, base: 69650, bear: 61150 },
          { label: "1 ເດືອນ (1M)", bull: 85500, base: 73200, bear: 56800 },
          { label: "3 ເດືອນ (3M)", bull: 103600, base: 81500, bear: 52100 },
          { label: "6 ເດືອນ (6M)", bull: 130350, base: 96900, bear: 48100 },
          { label: "1 ປີ (1Y)", bull: 177150, base: 123650, bear: 43450 }
        ],
        riskStrategy: {
          recommendedEntry: 66850,
          stopLoss: 63170,
          takeProfit1: 72500,
          takeProfit2: 78800,
          riskRewardRatio: "1 : 2.5",
          maxPositionSizePercent: "5% ຂອງພອດລວມ (Half Kelly)"
        },
        disclaimerLao: "ລະບົບ AI ເປັນເຄື່ອງມືຊ່ວຍວິເຄາະ ແລະ ສະໜັບສະໜູນການຕັດສິນໃຈເທົ່ານັ້ນ ບໍ່ແມ່ນການຮັບປະກັນຜົນຕອບແທນ ຫຼື ການທຳນາຍອະນາຄົດ 100%. ຜູ້ລົງທຶນຄວນບໍລິຫານຄວາມສ່ຽງສະເໝີ."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis(symbol);
  }, []);

  const getActionBadge = (act: string) => {
    switch (act) {
      case "ຊື້":
        return "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]";
      case "ຕິດຕາມ":
        return "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]";
      case "ລໍຖ້າ":
        return "bg-amber-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)]";
      case "ຫຼີກລ້ຽງ":
        return "bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)]";
      case "ບໍ່ຄວນເທຣດ":
        return "bg-rose-950 text-rose-300 border-2 border-rose-500 font-extrabold shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse";
      default:
        return "bg-slate-800 text-white";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header & Coin Picker Bar */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <BrainCircuit className="w-8 h-8 text-purple-400" />
              <span>10-Agent AI Quant Consensus V5.1</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              ແຍກ 3 Scores (Opportunity, Confidence, Risk) ພ້ອມລະບົບ Gatekeeper ຕັດສິນ Action ຢ່າງເຂັ້ມງວດ
            </p>
          </div>

          {/* Quick Coin Select */}
          <div className="flex flex-wrap items-center gap-2">
            {popularCoins.map((coin) => (
              <button
                key={coin}
                onClick={() => {
                  setSymbol(coin);
                  runAnalysis(coin);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  symbol === coin
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                    : "bg-slate-800 text-gray-300 hover:text-white"
                }`}
              >
                {coin.split("/")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Analyze Trigger */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="ປ້ອນສັນຍະລັກຫຼຽນ (ຕົວຢ່າງ: BTC/USDT, ETH/USDT, SOL/USDT)..."
            className="w-full sm:flex-1 bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
          />
          <button
            onClick={() => runAnalysis(symbol)}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI ກຳລັງປະມວນຜົນ 10 Agents...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>ກົດປຸ່ມວິເຄາະ AI Consensus</span>
              </>
            )}
          </button>
        </div>
      </div>

      {analysisResult && (
        <>
          {/* 2. TRIPLE-SCORE ARCHITECTURE BANNER */}
          <div className="glass-panel p-6 border-purple-500/30 bg-gradient-to-br from-[#0c1322] via-[#090d16] to-[#170f2d] relative overflow-hidden space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-bold font-mono text-white">{analysisResult.symbol}</span>
                  <span className="text-xs text-gray-400 font-mono">
                    ${analysisResult.currentPrice?.toLocaleString()}
                  </span>
                </div>

                {/* Final Action Display */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium">ຄຳຕັດສິນສຸດທ້າຍ (Action):</span>
                  <span className={`px-4 py-1.5 rounded-xl text-base font-extrabold font-sans flex items-center gap-2 ${getActionBadge(analysisResult.action)}`}>
                    {analysisResult.action === "ບໍ່ຄວນເທຣດ" && <Ban className="w-5 h-5" />}
                    <span>{analysisResult.action} ({analysisResult.actionEn})</span>
                  </span>
                  <span className="text-xs text-purple-300 font-mono font-semibold">
                    Consensus: {analysisResult.consensus?.ratio} ສຽງ
                  </span>
                </div>

                {/* NO TRADE Reasons Warning */}
                {analysisResult.action === "ບໍ່ຄວນເທຣດ" && analysisResult.noTradeReasons?.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 font-sans">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>ສາເຫດທີ່ລະບົບຫ້າມເທຣດ: {analysisResult.noTradeReasons.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* 10-Agent Vote Meter */}
              <div className="w-full lg:w-80 bg-slate-900/90 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span className="font-semibold">ຄວາມເປັນເອກະສັນ (Consensus):</span>
                  <span className="font-mono font-bold text-purple-300">{analysisResult.consensus?.strengthPercent || 80}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10 flex">
                  <div
                    className="h-full bg-emerald-500 rounded-l-full"
                    style={{ width: `${((analysisResult.consensus?.buyVotes || 8) / 10) * 100}%` }}
                    title="BUY Votes"
                  />
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${((analysisResult.consensus?.waitVotes || 2) / 10) * 100}%` }}
                    title="WAIT Votes"
                  />
                  <div
                    className="h-full bg-rose-500 rounded-r-full"
                    style={{ width: `${((analysisResult.consensus?.sellVotes || 0) / 10) * 100}%` }}
                    title="SELL Votes"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono pt-1">
                  <span className="text-emerald-400 font-bold">BUY: {analysisResult.consensus?.buyVotes || 8}</span>
                  <span className="text-amber-400 font-bold">WAIT: {analysisResult.consensus?.waitVotes || 2}</span>
                  <span className="text-rose-400 font-bold">SELL: {analysisResult.consensus?.sellVotes || 0}</span>
                </div>
              </div>
            </div>

            {/* 3 DISTINCT SCORE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              {/* Score 1: Opportunity Score */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold text-purple-300">1. OPPORTUNITY SCORE</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-white mt-1">
                  {analysisResult.tripleScore?.opportunityScore || 91.0} <span className="text-xs text-gray-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-sans">
                  {analysisResult.tripleScore?.opportunityMeaning || "ຄວາມສອດຄ່ອງຂອງສັນຍານ 10 Agents"}
                </p>
              </div>

              {/* Score 2: Confidence Score */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold text-blue-300">2. CONFIDENCE SCORE</span>
                  <Sliders className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-blue-300 mt-1">
                  {analysisResult.tripleScore?.confidenceScore || 76.0} <span className="text-xs text-gray-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-sans">
                  {analysisResult.tripleScore?.confidenceMeaning || "ຄວາມໝັ້ນໃຈຕົວແບບ (Brier Calibrated)"}
                </p>
              </div>

              {/* Score 3: Risk Score */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold text-amber-300">3. RISK SCORE</span>
                  <Scale className="w-4 h-4 text-amber-400" />
                </div>
                <div className={`text-3xl font-bold font-mono mt-1 ${
                  (analysisResult.tripleScore?.riskScore || 38) >= 70 ? "text-rose-400" : "text-emerald-400"
                }`}>
                  {analysisResult.tripleScore?.riskScore || 38.0} <span className="text-xs text-gray-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 font-sans">
                  {analysisResult.tripleScore?.riskMeaning || "ລະດັບຄວາມສ່ຽງຕະຫຼາດ (Safe Zone)"}
                </p>
              </div>
            </div>
          </div>

          {/* 3. 10 Specialized AI Agents Breakdown */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>ລາຍລະອຽດສຽງໂຫວດຈາກ 10 AI Agents (Signal Confluence)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisResult.agentsBreakdown?.map((agent: any, idx: number) => (
                <div key={idx} className="glass-card p-4.5 flex flex-col justify-between border-white/5">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">{agent.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        agent.vote === "BUY" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {agent.vote}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-gray-400">ຄະແນນ:</span>
                      <span className="font-bold font-mono text-sm text-white">{agent.score}/100</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">
                      {agent.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Multi-timeframe Forecast Scenarios */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <h2 className="text-base font-bold text-white">ການຄາດຄະເນສະຖານະການຫຼາຍໄລຍະເວລາ (Multi-Timeframe Scenarios)</h2>
                  <p className="text-xs text-gray-400">ສະແດງເປົ້າໝາຍ Bull, Base, Bear ໂດຍບໍ່ແມ່ນການທຳນາຍຕາຍຕົວ</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">ໄລຍະເວລາ (Timeframe)</th>
                    <th className="py-3 px-4 text-emerald-400">ກໍລະນີດີເລີດ (Bull Target)</th>
                    <th className="py-3 px-4 text-blue-400">ກໍລະນີພື້ນຖານ (Base Target)</th>
                    <th className="py-3 px-4 text-rose-400">ກໍລະນີແຍ່ສຸດ (Bear Target)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {analysisResult.scenarios?.map((sc: any, index: number) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{sc.label}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">${sc.bull.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-blue-300">${sc.base.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-rose-400">${sc.bear.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Risk Strategy & Explainability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Target className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">ແຜນຄວບຄຸມຄວາມສ່ຽງ (Risk Strategy)</h2>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-gray-400 font-sans">ລາຄາເຂົ້າຊື້ແນະນຳ (Entry):</span>
                  <span className="font-bold text-white">${analysisResult.riskStrategy?.recommendedEntry?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
                  <span className="text-rose-300 font-sans">ຈຸດຕັດຂາດທຶນ (Stop Loss):</span>
                  <span className="font-bold text-rose-400">${analysisResult.riskStrategy?.stopLoss?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-emerald-300 font-sans">ເປົ້າໝາຍກຳໄລ 1 (TP 1):</span>
                  <span className="font-bold text-emerald-400">${analysisResult.riskStrategy?.takeProfit1?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-emerald-300 font-sans">ເປົ້າໝາຍກຳໄລ 2 (TP 2):</span>
                  <span className="font-bold text-emerald-400">${analysisResult.riskStrategy?.takeProfit2?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-gray-400 font-sans">ອັດຕາ Risk : Reward:</span>
                  <span className="font-bold text-blue-400">{analysisResult.riskStrategy?.riskRewardRatio}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <span className="text-gray-400 font-sans">ຂະໜາດໄມ້ສູງສຸດຕໍ່ເທຣດ:</span>
                  <span className="font-bold text-amber-300">{analysisResult.riskStrategy?.maxPositionSizePercent}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">ເຫດຜົນ ແລະ ຂໍ້ຄວນລະວັງ (Why & Why Not)</h2>
              </div>

              <div>
                <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> ເຫດຜົນທີ່ສະໜັບສະໜູນ (Why):
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {analysisResult.evidence?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/5">
                <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                  <XCircle className="w-4 h-4" /> ຄວາມສ່ຽງ ແລະ ຂໍ້ຄວນລະວັງ (Why Not):
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {analysisResult.weakness?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
