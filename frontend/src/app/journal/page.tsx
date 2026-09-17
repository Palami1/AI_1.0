"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpenCheck, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  X,
  BrainCircuit
} from "lucide-react";

export default function AIJournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [action, setAction] = useState("BUY");
  const [entryPrice, setEntryPrice] = useState("66850");
  const [reasonLao, setReasonLao] = useState("");

  const fetchJournal = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/journal/entries");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchJournal();
  }, []);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/journal/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          action,
          entryPrice: parseFloat(entryPrice) || 0,
          reasonLao
        })
      });
      const newEntry = await res.json();
      setEntries([newEntry, ...entries]);
      setIsModalOpen(false);
      setReasonLao("");
    } catch (e) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpenCheck className="w-7 h-7 text-emerald-400" />
            <span>AI Trading Journal & Self-Reflection (ບັນທຶກ & ວິເຄາະຄວາມຜິດພາດ)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ບັນທຶກປະຫວັດການເທຣດ ພ້ອມລະບົບ AI ຮຽນຮູ້ ແລະ ວິເຄາະຄວາມຜິດພາດຂອງຕົວເອງ (AI Self-Error Diagnostics)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>ບັນທຶກການເທຣດໃໝ່</span>
        </button>
      </div>

      {/* Journal Entries List */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="glass-panel p-5 border-white/10 space-y-3 hover:border-white/20 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold font-mono text-white">{entry.symbol}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-sans ${
                  entry.action === "BUY" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                }`}>
                  {entry.action}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  ຈຸດເຂົ້າ: ${entry.entryPrice?.toLocaleString()} → ອອກ: ${entry.exitPrice?.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold font-mono ${
                  entry.pnlPercent >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {entry.pnlPercent >= 0 ? `+${entry.pnlPercent}% (+$${entry.pnlUsd})` : `${entry.pnlPercent}% (-$${Math.abs(entry.pnlUsd)})`}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">{entry.date}</span>
              </div>
            </div>

            {/* User Trade Reason */}
            <div className="text-xs text-gray-300">
              <span className="text-gray-400 font-semibold">ເຫດຜົນການເຂົ້າ: </span>
              {entry.reasonLao}
            </div>

            {/* AI Self-Reflection Diagnostic Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs text-purple-200 leading-relaxed flex items-start gap-2.5">
              <BrainCircuit className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-purple-300 block mb-0.5">AI Self-Reflection (ບົດວິເຄາະ AI):</span>
                {entry.aiSelfReflectionLao}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Journal Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 max-w-md w-full border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">ບັນທຶກການເທຣດເຂົ້າ Journal</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3.5 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 mb-1 block">Action</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    <option value="BUY">ຊື້ (BUY)</option>
                    <option value="SELL">ຂາຍ (SELL)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 mb-1 block">ລາຄາເຂົ້າ ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">ເຫດຜົນການຕັດສິນໃຈເຂົ້າເທຣດ</label>
                <textarea
                  value={reasonLao}
                  onChange={(e) => setReasonLao(e.target.value)}
                  placeholder="ປ້ອນເຫດຜົນ ເຊັ່ນ: ເຂົ້າຕາມ Breakout 4H ພ້ອມ Volume Spike..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white h-20"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all mt-2"
              >
                ຢືນຢັນບັນທຶກ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
