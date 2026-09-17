"use client";

import React from "react";
import { Activity, ArrowUpRight, ArrowDownLeft, RefreshCw, ShieldAlert } from "lucide-react";
import { WhaleEvent } from "@/store/useAppStore";

interface WhaleActivityFeedProps {
  events?: WhaleEvent[];
}

const DEFAULT_WHALES: WhaleEvent[] = [
  { id: "w-1", action: "ຊື້ໃຫຍ່ (Whale Buy)", type: "BUY", coin: "BTC", amount: 350, valueUsd: 23400000, route: "Coinbase Pro -> 0x8f2a...c4", timestamp: "17:52:10" },
  { id: "w-2", action: "ຖອນອອກກະດານ (Outflow)", type: "OUTFLOW", coin: "SOL", amount: 140000, valueUsd: 25550000, route: "Kraken -> Cold Storage", timestamp: "17:48:32" },
  { id: "w-3", action: "ຊື້ສະສົມ (Whale Accumulate)", type: "BUY", coin: "TAO", amount: 15000, valueUsd: 8025000, route: "Binance -> 0x44bb...11", timestamp: "17:41:05" },
  { id: "w-4", action: "ໂອນເຂົ້າກະດານ (Inflow)", type: "INFLOW", coin: "ETH", amount: 8500, valueUsd: 29580000, route: "0x3e1d...9a -> Binance", timestamp: "17:35:18" },
  { id: "w-5", action: "ຂາຍໃຫຍ່ (Whale Sell)", type: "SELL", coin: "NEAR", amount: 2500000, valueUsd: 17125000, route: "0x11ab...ff -> Binance", timestamp: "17:28:44" }
];

export function WhaleActivityFeed({ events = DEFAULT_WHALES }: WhaleActivityFeedProps) {
  const displayEvents = events.length > 0 ? events : DEFAULT_WHALES;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "BUY":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "SELL":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "OUTFLOW":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    }
  };

  return (
    <div className="space-y-3">
      {displayEvents.map((event) => (
        <div 
          key={event.id}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
              event.type === "BUY" || event.type === "OUTFLOW" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}>
              {event.coin}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{event.action}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${getTypeBadge(event.type)}`}>
                  {event.type}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{event.route}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold font-mono text-white">
              ${(event.valueUsd / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">
              {event.timestamp}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
