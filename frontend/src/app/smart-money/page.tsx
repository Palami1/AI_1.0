"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity, 
  ShieldCheck, 
  Landmark, 
  Wallet,
  Sparkles,
  TrendingUp,
  RefreshCw
} from "lucide-react";

export default function SmartMoneyPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/smart-money/overview");
      const json = await res.json();
      setData(json);
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-blue-400" />
            <span>Smart Money & Institutional Flow Dashboard</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ຕິດຕາມກະແສເງິນທຶນສະຖາບັນ, Bitcoin/Ethereum Spot ETF, ສະພາບຄ່ອງ Stablecoin ແລະ Smart Wallets
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-semibold border border-white/10 transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
          <span>ອັບເດດສົດ</span>
        </button>
      </div>

      {/* Top 3 Institutional Macro Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. ETF Net Inflow */}
        <div className="glass-panel p-5 space-y-3 border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
              <Landmark className="w-4 h-4" />
              <span>Spot ETF Flow (24h)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              ສະຖາບັນຊື້ແຮງ
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {data?.etfFlows?.btcSpotEtfNetFlow24h || "+$382.4M"}
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Bitcoin ETF Net Inflow (BlackRock, Fidelity)
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Ethereum ETF Flow:</span>
            <span className="text-emerald-400 font-bold">{data?.etfFlows?.ethSpotEtfNetFlow24h || "+$64.8M"}</span>
          </div>
        </div>

        {/* 2. Stablecoin Supply Liquidity */}
        <div className="glass-panel p-5 space-y-3 border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <DollarSign className="w-4 h-4" />
              <span>ສະພາບຄ່ອງ Stablecoin (USDT/USDC)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Net Minting
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {data?.stablecoinLiquidity?.totalStableSupply || "$168.4B"}
            </div>
            <p className="text-xs text-emerald-300 mt-1 font-semibold">
              {data?.stablecoinLiquidity?.netMint24h || "+$420M"} ໃນ 24h
            </p>
          </div>

          <p className="text-[11px] text-gray-400 leading-tight pt-1">
            {data?.stablecoinLiquidity?.impactLao || "ສະພາບຄ່ອງເງິນໂດລາໄຫຼເຂົ້າຕະຫຼາດຄຣິບໂຕ ເພີ່ມກຳລັງຊື້ໃຫ້ຕະຫຼາດ"}
          </p>
        </div>

        {/* 3. Exchange Flow Reserves */}
        <div className="glass-panel p-5 space-y-3 border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
              <Activity className="w-4 h-4" />
              <span>Exchange Flow & Reserves</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
              Outflow
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold font-mono text-purple-300">
              {data?.exchangeFlows?.netFlow24h || "-$245.8M"}
            </div>
            <p className="text-xs text-gray-300 mt-1 font-mono">
              {data?.exchangeFlows?.btcExchangeReserves || "2,140,500 BTC (-0.4%)"}
            </p>
          </div>

          <p className="text-[11px] text-gray-400 leading-tight pt-1">
            {data?.exchangeFlows?.interpretationLao || "ມີການຖອນຫຼຽນອອກຈາກກະດານເທຣດໄປເກັບໄວ້ Cold Storage ຫຼຸດແຮງເທຂາຍລົງ"}
          </p>
        </div>
      </div>

      {/* Smart Money Profitable Wallets Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">Smart Money Wallets (ກະເປົາທີ່ມີ Win Rate ສູງ)</h2>
              <p className="text-xs text-gray-400">ຕິດຕາມການເຄື່ອນໄຫວຂອງນັກລົງທຶນລາຍໃຫຍ່ທີ່ເຮັດກຳໄລໄດ້ຕໍ່ເນື່ອງ</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">ກະເປົາ Smart Money</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">ຫຼຽນ</th>
                <th className="py-3.5 px-4 text-right">ມູນຄ່າ ($)</th>
                <th className="py-3.5 px-4 text-right">ລາຄາສະເລ່ຍ</th>
                <th className="py-3.5 px-4 text-right">ເວລາ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {data?.smartMoneyWallets?.map((w: any, index: number) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white text-xs">{w.label}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{w.wallet}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                      {w.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">{w.coin}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">{w.amount}</td>
                  <td className="py-3.5 px-4 text-right text-gray-300">{w.avgPrice}</td>
                  <td className="py-3.5 px-4 text-right text-gray-500 font-sans text-[11px]">{w.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
