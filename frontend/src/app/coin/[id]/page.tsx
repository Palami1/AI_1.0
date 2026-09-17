"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Activity, 
  ShieldAlert, 
  Zap, 
  BarChart3,
  Star
} from "lucide-react";
import { TradingViewWidget } from "@/components/TradingViewWidget";

export default function CoinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) || "BTC";
  const { watchlist, toggleWatchlist } = useAppStore();

  const [coinData, setCoinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/market/coins/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCoinData(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback
        setCoinData({
          symbol: `${id.toUpperCase()}/USDT`,
          name: id.toUpperCase(),
          code: id.toUpperCase(),
          category: "Layer1",
          currentPrice: id.toUpperCase() === "BTC" ? 66850 : 3480,
          change24h: 4.25,
          marketCap: 1320000000000,
          volume24h: 32000000000,
          indicators: {
            rsi14: 64.2,
            macd: { trend: "BULLISH", hist: 3.4 },
            ema20: 65200,
            ema50: 63800,
            ema200: 58500,
            bollinger: { upper: 69500, middle: 66850, lower: 64200 },
            support: 64500,
            resistance: 69000,
            atr: 1850
          }
        });
        setLoading(false);
      });
  }, [id]);

  const symbol = coinData ? coinData.symbol : `${id.toUpperCase()}/USDT`;
  const isFavorite = watchlist.includes(symbol);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ກັບຄືນ</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleWatchlist(symbol)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isFavorite 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30" 
                : "bg-slate-800 text-gray-400 border-white/5 hover:text-white"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
            <span>{isFavorite ? "ຖືກໃຈແລ້ວ" : "ເພີ່ມໃສ່ທີ່ຖືກໃຈ"}</span>
          </button>

          <Link
            href={`/analysis?symbol=${encodeURIComponent(symbol)}`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>ວິເຄາະດ້ວຍ AI 6 Agents</span>
          </Link>
        </div>
      </div>

      {/* Coin Title & Key Numbers Banner */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold font-mono text-white text-xl shadow-lg">
              {coinData?.code || id.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{coinData?.name || id}</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-gray-300 font-mono">
                  {coinData?.category || "Crypto"}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{symbol}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-gray-400">ລາຄາປັດຈຸບັນ</span>
              <div className="text-2xl md:text-3xl font-bold font-mono text-white">
                ${coinData?.currentPrice?.toLocaleString() || "---"}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400">24H ປ່ຽນແປງ</span>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold font-mono ${
                  (coinData?.change24h || 0) >= 0 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}>
                  {(coinData?.change24h || 0) >= 0 ? "+" : ""}{coinData?.change24h}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main TradingView Chart */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">ກຣາຟລາຄາແບບໂຕ້ຕອບ TradingView (EMA, RSI, MACD, Bollinger)</h2>
          </div>
        </div>
        <TradingViewWidget symbol={symbol} height={520} />
      </div>

      {/* Technical Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">RSI (14)</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {coinData?.indicators?.rsi14 || "64.2"}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">Momentum ດີ</span>
        </div>

        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">EMA 20</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            ${coinData?.indicators?.ema20?.toLocaleString() || "---"}
          </div>
          <span className="text-[10px] text-blue-400 font-semibold">ແນວຮັບໄລຍະສັ້ນ</span>
        </div>

        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">EMA 200</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            ${coinData?.indicators?.ema200?.toLocaleString() || "---"}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">ຂາຂຶ້ນໄລຍະຍາວ</span>
        </div>

        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">ແນວຮັບ (Support)</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            ${coinData?.indicators?.support?.toLocaleString() || "---"}
          </div>
          <span className="text-[10px] text-gray-400">ຈຸດປ້ອງກັນ</span>
        </div>

        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">ແນວຕ້ານ (Resistance)</span>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            ${coinData?.indicators?.resistance?.toLocaleString() || "---"}
          </div>
          <span className="text-[10px] text-gray-400">ເປົ້າໝາຍທະລຸ</span>
        </div>

        <div className="glass-panel p-4">
          <span className="text-xs text-gray-400">ATR ຄວາມຜັນຜວນ</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            ${coinData?.indicators?.atr?.toLocaleString() || "---"}
          </div>
          <span className="text-[10px] text-gray-400">ໄລຍະ Stop Loss</span>
        </div>
      </div>
    </div>
  );
}
