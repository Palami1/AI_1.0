"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: "dark" | "light";
  height?: number | string;
}

function TradingViewWidgetComponent({ symbol = "BINANCE:BTCUSDT", theme = "dark", height = 450 }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    
    // Clear container
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Normalize symbol for TradingView
    let cleanSymbol = symbol.replace("/", "");
    if (!cleanSymbol.includes(":")) {
      cleanSymbol = `BINANCE:${cleanSymbol}`;
    }

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: cleanSymbol,
      interval: "D",
      timezone: "Asia/Bangkok",
      theme: theme,
      style: "1",
      locale: "en",
      enable_publishing: false,
      backgroundColor: "rgba(11, 16, 29, 0.8)",
      gridColor: "rgba(255, 255, 255, 0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      studies: [
        "STD;EMA",
        "STD;RSI",
        "STD;MACD",
        "STD;Bollinger_Bands"
      ],
      support_host: "https://www.tradingview.com"
    });

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    container.current.appendChild(widgetContainer);
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol, theme]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-card-border bg-[#0b101d]/90 shadow-xl" style={{ height }}>
      <div className="tradingview-widget-container h-full w-full" ref={container} />
    </div>
  );
}

export const TradingViewWidget = memo(TradingViewWidgetComponent);
