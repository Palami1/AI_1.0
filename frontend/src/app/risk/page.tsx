"use client";

import React, { useState } from "react";
import { 
  Scale, 
  Calculator, 
  ShieldAlert, 
  ShieldCheck, 
  DollarSign, 
  Percent, 
  AlertTriangle,
  Lock,
  ArrowRight
} from "lucide-react";

export default function RiskCenterPage() {
  // Position Sizing Calculator Inputs
  const [accountBalance, setAccountBalance] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("2");
  const [entryPrice, setEntryPrice] = useState("66850");
  const [stopLossPrice, setStopLossPrice] = useState("63500");

  // Kelly Criterion Inputs
  const [winRate, setWinRate] = useState("65");
  const [rewardToRisk, setRewardToRisk] = useState("2.5");

  // Position Size Calculation
  const balance = parseFloat(accountBalance) || 0;
  const riskPct = parseFloat(riskPercent) || 0;
  const entry = parseFloat(entryPrice) || 1;
  const stopLoss = parseFloat(stopLossPrice) || 1;

  const maxRiskAmount = (balance * riskPct) / 100;
  const priceDistance = Math.abs(entry - stopLoss);
  const positionUnits = priceDistance > 0 ? maxRiskAmount / priceDistance : 0;
  const positionValueUsd = positionUnits * entry;

  // Kelly Criterion Calculation: K% = W - [(1 - W) / R]
  const w = (parseFloat(winRate) || 0) / 100;
  const r = parseFloat(rewardToRisk) || 1;
  const rawKelly = r > 0 ? w - ((1 - w) / r) : 0;
  const kellyPct = Math.max(0, rawKelly * 100);
  const halfKelly = kellyPct / 2;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-emerald-400" />
            <span>Risk Center — ສູນຄຸ້ມຄອງຄວາມສ່ຽງລະດັບມືອາຊີບ</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ຄຳນວນ Position Sizing, ສູດ Kelly Criterion, ຕິດຕາມ Max Drawdown ແລະ ລະບົບປ້ອງກັນ Daily Loss Limit
          </p>
        </div>
      </div>

      {/* Account Safety Monitors Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-slate-900/60">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
            <span>Daily Max Loss Limit</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">-3.0% ($300)</div>
          <p className="text-[11px] text-gray-400 mt-1">ລະບົບຈະແຈ້ງເຕືອນລັອກການເທຣດຖ້າຂາດທຶນເກີນ 3% ຕໍ່ວັນ</p>
        </div>

        <div className="glass-panel p-5 border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-slate-900/60">
          <div className="flex items-center justify-between text-xs text-blue-300 font-semibold">
            <span>Max Drawdown (MDD) ປະຈຸບັນ</span>
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">-4.8%</div>
          <p className="text-[11px] text-gray-400 mt-1">ຢູ່ໃນເກນປອດໄພສູງ (Safe Zone ຕ່ຳກວ່າ 10%)</p>
        </div>

        <div className="glass-panel p-5 border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-slate-900/60">
          <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
            <span>Capital Protection Rule</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white mt-2">NO ALL-IN RULE</div>
          <p className="text-[11px] text-gray-400 mt-1">ຫ້າມລົງທຶນເກີນ 5% ຂອງພອດຕໍ່ 1 ຄູ່ຫຼຽນ</p>
        </div>
      </div>

      {/* 2 Big Calculators: Position Sizing & Kelly Criterion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator 1: Position Size Calculator */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Position Size Calculator (ຄຳນວນຂະໜາດໄມ້)</h2>
              <p className="text-xs text-gray-400">ຄຳນວນຈຳນວນຫຼຽນທີ່ຄວນຊື້ຕາມເງິນທຶນ ແລະ Stop Loss</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-gray-400 mb-1 block">ຍອດເງິນໃນພອດ ($ USD)</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-gray-400 mb-1 block">ຄວາມສ່ຽງທີ່ຍອມຮັບໄດ້ (% ຕໍ່ເທຣດ)</label>
              <input
                type="number"
                step="0.5"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 mb-1 block">ລາຄາເຂົ້າຊື້ (Entry $)</label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">ລາຄາຕັດຂາດທຶນ (Stop Loss $)</label>
                <input
                  type="number"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-mono"
                />
              </div>
            </div>

            {/* Position Size Results Box */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 font-mono text-xs mt-4">
              <div className="flex justify-between">
                <span className="text-gray-300 font-sans">ຈຳນວນເງິນສ່ຽງສູງສຸດ (Max Loss):</span>
                <span className="font-bold text-rose-400">${maxRiskAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 font-sans">ຈຳນວນຫຼຽນທີ່ຄວນຊື້ (Units):</span>
                <span className="font-bold text-emerald-400 text-sm">{positionUnits.toFixed(4)} Units</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-gray-300 font-sans">ມູນຄ່າໄມ້ລວມ (Total Position Value):</span>
                <span className="font-bold text-white text-sm">${positionValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator 2: Kelly Criterion */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Percent className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-bold text-white">Kelly Criterion Calculator (ສັດສ່ວນການລົງທຶນ)</h2>
              <p className="text-xs text-gray-400">ຄຳນວນສັດສ່ວນການລົງທຶນທີ່ດີທີ່ສຸດຕາມອັດຕາຊະນະ ແລະ Risk:Reward</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-gray-400 mb-1 block">ອັດຕາຊະນະທີ່ຄາດຫວັງ (Win Rate %)</label>
              <input
                type="number"
                value={winRate}
                onChange={(e) => setWinRate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-gray-400 mb-1 block">ອັດຕາຜົນຕອບແທນຕໍ່ຄວາມສ່ຽງ (Risk : Reward Ratio)</label>
              <input
                type="number"
                step="0.1"
                value={rewardToRisk}
                onChange={(e) => setRewardToRisk(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white font-mono"
              />
            </div>

            {/* Kelly Results Box */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3 font-mono text-xs mt-4">
              <div className="flex justify-between">
                <span className="text-gray-300 font-sans">Full Kelly %:</span>
                <span className="font-bold text-purple-300 text-sm">{kellyPct.toFixed(1)}% ຂອງພອດ</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-gray-300 font-sans">Half Kelly % (ແນະນຳເພື່ອຄວາມປອດໄພ):</span>
                <span className="font-bold text-emerald-400 text-base">{halfKelly.toFixed(1)}% ຂອງພອດ</span>
              </div>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed pt-1">
                💡 ນັກເທຣດມືອາຊີບນິຍົມໃຊ້ **Half Kelly** ເພື່ອຫຼຸດ Drawdown ໃນຊ່ວງຕະຫຼາດຜັນຜວນ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
