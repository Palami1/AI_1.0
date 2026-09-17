"use client";

import React, { useState, useEffect } from "react";
import { 
  Rewind, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Sparkles, 
  BrainCircuit, 
  Calendar, 
  TrendingUp, 
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { TradingViewWidget } from "@/components/TradingViewWidget";

export default function ReplayModePage() {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hideFuture, setHideFuture] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/replay/scenarios")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setScenarios(data);
          setSelectedScenario(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleNextStep = () => {
    if (selectedScenario && currentStepIndex < selectedScenario.candles.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (selectedScenario && prev < selectedScenario.candles.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, selectedScenario]);

  const currentCandle = selectedScenario?.candles[currentStepIndex];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Rewind className="w-7 h-7 text-purple-400" />
            <span>Replay Mode — ຍ້ອນເວລາທົດສອບ & Backtest</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ເລືອກວັນທີໃນອະດີດ, ປິດບັງກຣາຟອະນາຄົດ ແລະ ທົດລອງໃຫ້ AI ວິເຄາະແບບ Blind Test Candle-by-Candle
          </p>
        </div>

        {/* Toggle Hide Future Data */}
        <button
          onClick={() => setHideFuture(!hideFuture)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            hideFuture 
              ? "bg-purple-600/20 text-purple-300 border-purple-500/30" 
              : "bg-slate-800 text-gray-400 border-white/5"
          }`}
        >
          {hideFuture ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{hideFuture ? "ໂໝດປິດບັງອະນາຄົດ (Blind Active)" : "ສະແດງຂໍ້ມູນທັງໝົດ"}</span>
        </button>
      </div>

      {/* Scenario Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            onClick={() => {
              setSelectedScenario(sc);
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className={`glass-card p-4 cursor-pointer border transition-all ${
              selectedScenario?.id === sc.id
                ? "border-purple-500/80 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                : "border-white/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{sc.title}</span>
              <span className="text-xs font-mono text-purple-400 font-bold">{sc.symbol}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              {sc.historicalContextLao}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span>ວັນທີ: {sc.date}</span>
              <span>ເລີ່ມຕົ້ນ: ${sc.startPrice.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Replay Player Controls */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="text-xs text-gray-400">ສະຖານະ Replay:</span>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              ຂັ້ນຕອນທີ {currentStepIndex + 1} / {selectedScenario?.candles?.length || 0}
              <span className="text-xs text-purple-400 font-sans ml-2">
                ({currentCandle?.time || "---"})
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 text-gray-300 hover:text-white hover:bg-slate-700 transition-all"
              title="ເລີ່ມຕົ້ນໃໝ່"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? "ຢຸດຊົ່ວຄາວ" : "ຫຼິ້ນ Replay ອັດຕະໂນມັດ"}</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex >= (selectedScenario?.candles?.length || 1) - 1}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-slate-800 text-gray-200 hover:text-white disabled:opacity-40 transition-all text-xs font-semibold"
            >
              <span>ກ້າວໄປ 1 Candle</span>
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Indicator & AI Blind Analysis Output */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-xs text-gray-400 font-sans">ລາຄາໃນຈຸດນີ້</span>
            <div className="text-2xl font-bold text-white mt-1">
              ${currentCandle?.price?.toLocaleString() || "---"}
            </div>
            <span className="text-[10px] text-gray-500 font-sans">Historical Simulated Candle</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
            <span className="text-xs text-purple-300 font-sans">AI Consensus Action</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {currentCandle?.action || "---"}
            </div>
            <span className="text-[10px] text-emerald-300 font-sans">ຄະແນນ AI: {currentCandle?.score || 0}/100</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-xs text-gray-400 font-sans">ຜົນກຳໄລ-ຂາດທຶນ (Simulated P&L)</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              +{(
                (((currentCandle?.price || 1) - (selectedScenario?.startPrice || 1)) / (selectedScenario?.startPrice || 1)) * 100
              ).toFixed(1)}%
            </div>
            <span className="text-[10px] text-gray-500 font-sans">ທຽບກັບຈຸດເລີ່ມຕົ້ນ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
