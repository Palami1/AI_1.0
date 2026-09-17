"use client";

import React, { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string;
  timeframe?: string;
}

export function TradingViewChart({ symbol, timeframe = "60" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map symbols to TradingView ticker formats matching Exness / Forex / Crypto market standards
  const getTradingViewTicker = (sym: string) => {
    switch (sym.toUpperCase()) {
      case "XAUUSD":
      case "GOLD":
        return "OANDA:XAUUSD";
      case "EURUSD":
        return "OANDA:EURUSD";
      case "GBPUSD":
        return "OANDA:GBPUSD";
      case "USDJPY":
        return "OANDA:USDJPY";
      case "BTC":
      case "BTCUSD":
      case "BTC/USDT":
        return "BINANCE:BTCUSDT";
      case "ETH":
      case "ETHUSD":
      case "ETH/USDT":
        return "BINANCE:ETHUSDT";
      case "AAPL":
        return "NASDAQ:AAPL";
      default:
        return `FX:${sym}`;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: getTradingViewTicker(symbol),
      interval: timeframe === "30s" ? "1" : timeframe,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      calendar: false,
      support_host: "https://www.tradingview.com"
    });

    containerRef.current.appendChild(script);
  }, [symbol, timeframe]);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col h-[520px] w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-md font-bold text-white">Live Market Chart — {symbol}</h3>
          <p className="text-xs text-gray-400">Interactive technical analysis powered by TradingView</p>
        </div>
      </div>
      <div className="w-full flex-1 rounded-xl overflow-hidden bg-[#131722]" ref={containerRef} />
    </div>
  );
}
