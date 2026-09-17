"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Radio, 
  X,
  Volume2
} from "lucide-react";

export default function AlertsPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [conditionType, setConditionType] = useState("PRICE_ABOVE");
  const [targetValue, setTargetValue] = useState("68000");

  const fetchRules = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/alerts/rules");
      const data = await res.json();
      setRules(data);
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/alerts/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          conditionType,
          targetValue: parseFloat(targetValue) || 0
        })
      });
      const newRule = await res.json();
      setRules([newRule, ...rules]);
      setIsModalOpen(false);
    } catch (e) {
      // fallback local
      setRules([
        {
          id: `alt-${Date.now()}`,
          symbol,
          conditionType,
          conditionText: `${symbol} ${conditionType} ${targetValue}`,
          targetValue: parseFloat(targetValue),
          status: "ACTIVE",
          createdAt: "ຕອນນີ້"
        },
        ...rules
      ]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-amber-400" />
            <span>Notification & Alert Center — ສູນແຈ້ງເຕືອນອັດສະລິຍະ</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ສ້າງເງື່ອນໄຂແຈ້ງເຕືອນສະເພາະຕົວເອງ: ລາຄາທະລຸແນວຕ້ານ, RSI Oversold/Overbought ແລະ Whale Transactions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>ສ້າງການແຈ້ງເຕືອນໃໝ່</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">ລາຍການແຈ້ງເຕືອນທີ່ກຳລັງເຝົ້າລະວັງ ({rules.length} ລາຍການ)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">ຫຼຽນ</th>
                <th className="py-3.5 px-4">ເງື່ອນໄຂການແຈ້ງເຕືອນ</th>
                <th className="py-3.5 px-4">ຄ່າເປົ້າໝາຍ</th>
                <th className="py-3.5 px-4">ສະຖານະ</th>
                <th className="py-3.5 px-4">ເວລາສ້າງ</th>
                <th className="py-3.5 px-4 text-center">ລຶບ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">{rule.symbol}</td>
                  <td className="py-3.5 px-4 font-sans text-gray-200">{rule.conditionText}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">${rule.targetValue?.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      rule.status === "ACTIVE" 
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {rule.status === "ACTIVE" ? "ກຳລັງເຝົ້າລະວັງ (ACTIVE)" : "ເຕືອນແລ້ວ (TRIGGERED)"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 font-sans text-[11px]">{rule.createdAt}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setRules(rules.filter((r) => r.id !== rule.id))}
                      className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                      aria-label="Delete rule"
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

      {/* Add Alert Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 max-w-md w-full border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white">ສ້າງເງື່ອນໄຂແຈ້ງເຕືອນໃໝ່</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
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
                <label className="text-gray-400 mb-1 block">ປະເພດເງື່ອນໄຂ (Condition)</label>
                <select
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white"
                >
                  <option value="PRICE_ABOVE">ລາຄາທະລຸເໜືອ (Price Above)</option>
                  <option value="PRICE_BELOW">ລາຄາຫຼຸດຕ່ຳກວ່າ (Price Below)</option>
                  <option value="RSI_OVERSOLD">RSI ຫຼຸດຕ່ຳກວ່າ (Oversold)</option>
                  <option value="RSI_OVERBOUGHT">RSI ສູງເກີນໄປ (Overbought)</option>
                  <option value="WHALE_TRANSACTION">ລາຍການໂອນປາວານໃຫຍ່ກວ່າ (Whale $)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 mb-1 block">ຄ່າເປົ້າໝາຍ (Target Value)</label>
                <input
                  type="number"
                  step="any"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all mt-2"
              >
                ບັນທຶກເງື່ອນໄຂແຈ້ງເຕືອນ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
