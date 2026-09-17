"use client";

import React, { useState } from "react";
import { useAppStore, PortfolioPosition } from "@/store/useAppStore";
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Sparkles,
  ShieldCheck,
  X
} from "lucide-react";
import Link from "next/link";

export default function PortfolioPage() {
  const { portfolio, addPortfolioPosition, removePortfolioPosition } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [name, setName] = useState("Bitcoin");
  const [buyPrice, setBuyPrice] = useState("65000");
  const [currentPrice, setCurrentPrice] = useState("66850");
  const [amount, setAmount] = useState("0.5");

  // Summary stats
  const totalInvested = portfolio.reduce((acc, item) => acc + item.totalCost, 0);
  const totalValue = portfolio.reduce((acc, item) => acc + item.totalValue, 0);
  const totalPnlUsd = totalValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnlUsd / totalInvested) * 100 : 0;

  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    const bp = parseFloat(buyPrice) || 0;
    const cp = parseFloat(currentPrice) || bp;
    const amt = parseFloat(amount) || 0;

    if (amt > 0 && bp > 0) {
      addPortfolioPosition({
        symbol,
        name,
        buyPrice: bp,
        currentPrice: cp,
        amount: amt
      });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-blue-400" />
            <span>ພອດການລົງທຶນສ່ວນຕົວ (Personal Portfolio)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ຕິດຕາມກຳໄລ-ຂາດທຶນ (P&L) ແລະ ຄຸ້ມຄອງຄວາມສ່ຽງສ່ວນບຸກຄົນ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>ບັນທຶກການຊື້ຫຼຽນໃໝ່</span>
        </button>
      </div>

      {/* Portfolio Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <span className="text-xs text-gray-400">ມູນຄ່າພອດປັດຈຸບັນ</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Real-time Value</span>
        </div>

        <div className="glass-panel p-5">
          <span className="text-xs text-gray-400">ຕົ້ນທຶນລວມ</span>
          <div className="text-2xl font-bold font-mono text-gray-300 mt-1">
            ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Total Capital Invested</span>
        </div>

        <div className="glass-panel p-5">
          <span className="text-xs text-gray-400">ກຳໄລ / ຂາດທຶນລວມ ($)</span>
          <div className={`text-2xl font-bold font-mono mt-1 ${totalPnlUsd >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {totalPnlUsd >= 0 ? `+$${totalPnlUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `-$${Math.abs(totalPnlUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <span className={`text-[10px] font-semibold ${totalPnlUsd >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
            Net Unrealized P&L
          </span>
        </div>

        <div className="glass-panel p-5">
          <span className="text-xs text-gray-400">ຜົນຕອບແທນ (%)</span>
          <div className={`text-2xl font-bold font-mono mt-1 ${totalPnlPercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {totalPnlPercent >= 0 ? `+${totalPnlPercent.toFixed(2)}%` : `${totalPnlPercent.toFixed(2)}%`}
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">Total ROI</span>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">ລາຍການຫຼຽນທີ່ຖືຄອງ ({portfolio.length} ລາຍການ)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3 px-4">ຫຼຽນ</th>
                <th className="py-3 px-4 text-right">ຈຳນວນ</th>
                <th className="py-3 px-4 text-right">ລາຄາຊື້ສະເລ່ຍ</th>
                <th className="py-3 px-4 text-right">ລາຄາປັດຈຸບັນ</th>
                <th className="py-3 px-4 text-right">ຕົ້ນທຶນ</th>
                <th className="py-3 px-4 text-right">ມູນຄ່າປັດຈຸບັນ</th>
                <th className="py-3 px-4 text-right">ກຳໄລ/ຂາດທຶນ (P&L)</th>
                <th className="py-3 px-4 text-center">AI ວິເຄາະ</th>
                <th className="py-3 px-4 text-center">ລຶບ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {portfolio.map((pos) => (
                <tr key={pos.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-white">
                    <div>{pos.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{pos.symbol}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right text-gray-200">{pos.amount}</td>
                  <td className="py-3.5 px-4 text-right text-gray-400">${pos.buyPrice.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right text-white font-bold">${pos.currentPrice.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right text-gray-400">${pos.totalCost.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right text-white font-bold">${pos.totalValue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className={`font-bold ${pos.pnlUsd >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {pos.pnlUsd >= 0 ? "+" : ""}${pos.pnlUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] ${pos.pnlPercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      ({pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(2)}%)
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-sans">
                    <Link
                      href={`/analysis?symbol=${encodeURIComponent(pos.symbol)}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>ວິເຄາະ</span>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => removePortfolioPosition(pos.id)}
                      className="text-gray-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-all"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Position Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 max-w-md w-full border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">ບັນທຶກການຊື້ຫຼຽນເຂົ້າພອດ</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPosition} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-400 mb-1 block">ສັນຍະລັກຫຼຽນ (Symbol)</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">ຊື່ຫຼຽນ (Name)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 mb-1 block">ລາຄາທີ່ຊື້ ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-400 mb-1 block">ຈຳນວນທີ່ຊື້</label>
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all mt-2"
              >
                ຢືນຢັນບັນທຶກເຂົ້າພອດ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
