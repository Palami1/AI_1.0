"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Activity, ArrowUpRight, ArrowDownLeft, ShieldAlert, Sparkles, RefreshCw, Filter } from "lucide-react";
import { WhaleActivityFeed } from "@/components/WhaleActivityFeed";

export default function WhalePage() {
  const { whaleEvents, addWhaleEvent } = useAppStore();
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/market/whales")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          data.forEach((w) => addWhaleEvent(w));
        }
      })
      .catch(() => {});
  }, [addWhaleEvent]);

  const filteredEvents = filterType === "ALL" 
    ? whaleEvents 
    : whaleEvents.filter((w) => w.type === filterType);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-blue-400" />
            <span>ຕິດຕາມການເຄື່ອນໄຫວປາວານ (Whale Tracker)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ກວດຈັບທຸລະກຳໃຫຍ່ໃນຕະຫຼາດ: Whale Buy, Whale Sell, Exchange Inflow & Outflow
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-white/10">
          {[
            { id: "ALL", label: "ທັງໝົດ" },
            { id: "BUY", label: "ຊື້ໃຫຍ່ (Buy)" },
            { id: "SELL", label: "ຂາຍໃຫຍ່ (Sell)" },
            { id: "OUTFLOW", label: "ຖອນອອກ (Outflow)" },
            { id: "INFLOW", label: "ໂອນເຂົ້າ (Inflow)" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === f.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Whale Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">ມູນຄ່າທຸລະກຳປາວານ 24h</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">$482.5M</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+14.2% ທຽບກັບມື້ວານ</span>
        </div>

        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">Net Outflow (ຖອນອອກກະດານ)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">+$124.8M</div>
          <span className="text-[10px] text-emerald-300 font-semibold">ສັນຍານບວກ (Bullish)</span>
        </div>

        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">Whale Buys ສູງສຸດ</span>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">BTC & SOL</div>
          <span className="text-[10px] text-gray-400">ມີການສະສົມຕໍ່ເນື່ອງ</span>
        </div>

        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">ຄວາມຖີ່ການໂອນ</span>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">ສູງປົກກະຕິ</div>
          <span className="text-[10px] text-gray-400">ອັບເດດສົດທຸກວິນາທີ</span>
        </div>
      </div>

      {/* Main Feed */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">ລາຍການທຸລະກຳປາວານຫຼ້າສຸດ (Live Feed)</h2>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Real-time WebSocket Active</span>
        </div>

        <WhaleActivityFeed events={filteredEvents} />
      </div>
    </div>
  );
}
