"use client";

import { useAppStore } from "@/store/useAppStore";
import { Menu, LogOut, Shield, Wifi, WifiOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { fearAndGreed, wsConnected, logout, user } = useAppStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-card-border/60 bg-[#090d16]/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between z-30 select-none">
      {/* Left: Mobile Menu & Live Indicators */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Live System Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs text-gray-300 shadow-inner">
          <span className="flex items-center gap-1.5 font-medium">
            {wsConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-medium">ເຊື່ອມຕໍ່ສົດ (WebSocket Live)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-amber-400 font-medium">ກຳລັງດຶງຂໍ້ມູນ Real-time</span>
              </>
            )}
          </span>
        </div>

        {/* Fear & Greed Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs">
          <span className="text-gray-400 font-medium">ດັດຊະນີອາລົມ:</span>
          <span className="font-bold text-emerald-400 font-mono">{fearAndGreed.score}/100</span>
          <span className="text-emerald-300 font-medium">{fearAndGreed.status}</span>
        </div>
      </div>

      {/* Right: Quick Actions & Single User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Analyze Button */}
        <Link 
          href="/analysis" 
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ວິເຄາະດ້ວຍ AI</span>
        </Link>

        {/* Master User Badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/10">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] font-bold text-slate-950">
              VIP
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">ເຈົ້າຂອງລະບົບ</p>
              <p className="text-[10px] text-gray-400 leading-none">Single User</p>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            title="ອອກຈາກລະບົບ (Logout)"
            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
