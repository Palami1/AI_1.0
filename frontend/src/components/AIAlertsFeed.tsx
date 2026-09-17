"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export interface AIAlertItem {
  id: string;
  symbol: string;
  title: string;
  message: string;
  action: string;
  confidence: number;
  time: string;
}

const DEFAULT_ALERTS: AIAlertItem[] = [
  {
    id: "alt-1",
    symbol: "BTC/USDT",
    title: "ສັນຍານຊື້ແຮງ (Bullish Pattern)",
    message: "BTC ມີຄວາມໜ້າເຊື່ອຖື 91% ພ້ອມແຮງຊື້ສະສົມຈາກ Whale ຕໍ່ເນື່ອງ",
    action: "ຊື້ (BUY)",
    confidence: 91,
    time: "3 ນາທີກ່ອນ"
  },
  {
    id: "alt-2",
    symbol: "SOL/USDT",
    title: "ປະລິມານການຊື້ເພີ່ມຂຶ້ນ 45%",
    message: "SOL ທະລຸແນວຕ້ານ $180 ພ້ອມ Volume Spike ສະໜັບສະໜູນ",
    action: "ຊື້ (BUY)",
    confidence: 85,
    time: "10 ນາທີກ່ອນ"
  },
  {
    id: "alt-3",
    symbol: "NEAR/USDT",
    title: "ກຸ່ມ AI ເຂົ້າສູ່ Momentum ຮອບໃໝ່",
    message: "NEAR RSI ຢູ່ 68 ພ້ອມແຮງຊື້ On-chain ເຂົ້າ Cold Wallet",
    action: "ຊື້ (BUY)",
    confidence: 88,
    time: "22 ນາທີກ່ອນ"
  }
];

export function AIAlertsFeed({ alerts = DEFAULT_ALERTS }: { alerts?: AIAlertItem[] }) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-indigo-950/20 border border-blue-500/20 hover:border-blue-500/40 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                {alert.symbol}
              </span>
              <span className="text-xs font-bold text-white">{alert.title}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {alert.confidence}% ໝັ້ນໃຈ
            </div>
          </div>

          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            {alert.message}
          </p>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[11px]">
            <span className="text-gray-500">{alert.time}</span>
            <Link
              href={`/analysis?symbol=${encodeURIComponent(alert.symbol)}`}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
            >
              <span>ເບິ່ງບົດວິເຄາະ AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
