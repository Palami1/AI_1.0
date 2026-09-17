"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore, CryptoCoin } from "@/store/useAppStore";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  Sparkles, 
  ArrowUpDown, 
  Filter,
  BarChart2,
  Layers
} from "lucide-react";

export default function MarketPage() {
  const { coins, watchlist, toggleWatchlist, setCoins } = useAppStore();
  const [category, setCategory] = useState("all");
  const [rankLimit, setRankLimit] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/market/coins")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCoins(data);
        }
      })
      .catch(() => {});
  }, [setCoins]);

  const categories = [
    { id: "all", name: "ທັງໝົດ" },
    { id: "ai", name: "AI Tokens" },
    { id: "layer1", name: "Layer 1" },
    { id: "defi", name: "DeFi" },
    { id: "meme", name: "Meme Coins" },
    { id: "gaming", name: "Gaming" },
  ];

  const rankLimits = [
    { label: "Top 10", value: 10 },
    { label: "Top 50", value: 50 },
    { label: "Top 100", value: 100 },
    { label: "Top 500", value: 500 },
  ];

  // Filtering
  const filteredCoins = coins.filter((coin) => {
    // Category filter
    if (category !== "all" && coin.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const match = coin.name.toLowerCase().includes(q) || coin.code.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Favorite filter
    if (filterFavoriteOnly && !watchlist.includes(coin.symbol)) {
      return false;
    }
    // Rank limit
    return coin.rank <= rankLimit;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-blue-400" />
            <span>ຕະຫຼາດຄຣິບໂຕສົດ (Live Crypto Market)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ອັບເດດລາຄາ ແລະ ສັນຍານຕະຫຼາດທຸກວິນາທີຜ່ານ WebSocket
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ຄົ້ນຫາຊື່ຫຼຽນ ຫຼື ສັນຍະລັກ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Filter Bar: Categories & Rank limits */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3.5">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> ໝວດໝູ່:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat.id
                  ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20"
                  : "bg-slate-800/80 text-gray-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Rank Limits & Watchlist toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterFavoriteOnly(!filterFavoriteOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterFavoriteOnly 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                : "bg-slate-800/80 text-gray-300 hover:text-white"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterFavoriteOnly ? "fill-amber-400 text-amber-400" : ""}`} />
            <span>ທີ່ຖືກໃຈ ({watchlist.length})</span>
          </button>

          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-white/5">
            {rankLimits.map((limit) => (
              <button
                key={limit.value}
                onClick={() => setRankLimit(limit.value)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                  rankLimit === limit.value
                    ? "bg-blue-600 text-white font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {limit.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Crypto Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">ຫຼຽນ</th>
                <th className="py-3.5 px-4">ໝວດໝູ່</th>
                <th className="py-3.5 px-4 text-right">ລາຄາປັດຈຸບັນ</th>
                <th className="py-3.5 px-4 text-right">24H ປ່ຽນແປງ</th>
                <th className="py-3.5 px-4 text-right hidden md:table-cell">24H ສູງສຸດ / ຕ່ຳສຸດ</th>
                <th className="py-3.5 px-4 text-right hidden lg:table-cell">ມູນຄ່າຕະຫຼາດ</th>
                <th className="py-3.5 px-4 text-right hidden sm:table-cell">Volume 24H</th>
                <th className="py-3.5 px-4 text-center">AI ວິເຄາະ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCoins.map((coin) => {
                const isFavorite = watchlist.includes(coin.symbol);
                return (
                  <tr 
                    key={coin.symbol} 
                    className="hover:bg-blue-500/5 transition-colors group"
                  >
                    {/* Rank & Favorite */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 font-mono text-gray-400">
                        <button
                          onClick={() => toggleWatchlist(coin.symbol)}
                          className="hover:scale-110 transition-transform"
                          aria-label="Toggle Watchlist"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-amber-400 text-amber-400" : "text-gray-600 hover:text-gray-400"}`} />
                        </button>
                        <span>{coin.rank}</span>
                      </div>
                    </td>

                    {/* Coin Name & Code */}
                    <td className="py-4 px-4">
                      <Link href={`/coin/${coin.code}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold font-mono text-white text-xs">
                          {coin.code}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                            {coin.name}
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono">
                            {coin.symbol}
                          </div>
                        </div>
                      </Link>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-gray-300 font-mono border border-white/5">
                        {coin.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 text-right font-mono font-bold text-white text-sm">
                      ${coin.currentPrice < 0.01 ? coin.currentPrice.toFixed(6) : coin.currentPrice.toLocaleString()}
                    </td>

                    {/* 24h Change */}
                    <td className="py-4 px-4 text-right font-mono font-bold">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                        coin.change24h >= 0 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {coin.change24h >= 0 ? "+" : ""}{coin.change24h}%
                      </span>
                    </td>

                    {/* 24h High/Low */}
                    <td className="py-4 px-4 text-right font-mono text-[11px] text-gray-400 hidden md:table-cell">
                      <div>${coin.high24h.toLocaleString()}</div>
                      <div className="text-gray-500">${coin.low24h.toLocaleString()}</div>
                    </td>

                    {/* Market Cap */}
                    <td className="py-4 px-4 text-right font-mono text-gray-300 text-xs hidden lg:table-cell">
                      ${(coin.marketCap / 1000000000).toFixed(2)}B
                    </td>

                    {/* Volume 24H */}
                    <td className="py-4 px-4 text-right font-mono text-gray-300 text-xs hidden sm:table-cell">
                      ${(coin.volume24h / 1000000).toFixed(1)}M
                    </td>

                    {/* AI Action Button */}
                    <td className="py-4 px-4 text-center">
                      <Link
                        href={`/analysis?symbol=${encodeURIComponent(coin.symbol)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all font-semibold text-xs shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:text-white" />
                        <span>ວິເຄາະ AI</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
