"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  BrainCircuit, 
  Activity, 
  ShieldCheck, 
  X, 
  Sparkles,
  Search,
  Building2,
  Rewind,
  GraduationCap,
  Scale,
  MessageSquareCode,
  Bell,
  Cpu,
  Radar,
  Flame,
  BookOpenCheck
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const coreNav = [
    { name: "Terminal ຫຼັກ", href: "/", icon: LayoutDashboard, badge: "Bloomberg" },
    { name: "Global Market Brain", href: "/brain", icon: Cpu, highlight: true },
    { name: "Opportunity Radar", href: "/radar", icon: Radar, badge: "1,000 ຫຼຽນ" },
    { name: "Liquidity Heatmap", href: "/liquidity", icon: Flame },
    { name: "ຕະຫຼາດສົດ", href: "/market", icon: TrendingUp },
  ];

  const quantSuite = [
    { name: "AI Consensus V2", href: "/analysis", icon: BrainCircuit, badge: "10 Agents" },
    { name: "Smart Money", href: "/smart-money", icon: Building2 },
    { name: "Whale Intelligence", href: "/whale", icon: Activity },
    { name: "Replay Lab", href: "/replay", icon: Rewind },
    { name: "AI Learning Log", href: "/learning", icon: GraduationCap },
    { name: "AI Journal (Error Log)", href: "/journal", icon: BookOpenCheck, badge: "Self-Check" },
    { name: "Risk Center", href: "/risk", icon: Scale },
    { name: "AI Chat Analyst", href: "/chat", icon: MessageSquareCode, badge: "Pro Bot" },
    { name: "Notification Pro", href: "/alerts", icon: Bell },
    { name: "ພອດການລົງທຶນ", href: "/portfolio", icon: Briefcase },
  ];

  return (
    <div className="w-64 h-screen border-r border-card-border bg-[#070b14]/95 md:bg-[#070b14]/90 backdrop-blur-xl flex flex-col relative select-none">
      {/* Mobile Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Brand Header */}
      <div className="p-4 border-b border-card-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gradient-gold tracking-wide">LAO AI OS</h1>
            <p className="text-[9px] text-purple-400 font-bold tracking-wider uppercase">V5.0 Institutional</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Sections */}
      <nav className="flex-1 px-2.5 space-y-3.5 mt-3 overflow-y-auto">
        {/* Section 1: Market Brain & Radar */}
        <div>
          <div className="px-3 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
            ສະໝອງຕະຫຼາດ & Radar (Institutional)
          </div>
          <div className="space-y-1 mt-0.5">
            {coreNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-blue-600/25 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)] font-semibold" 
                      : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-blue-400" : "text-gray-400 group-hover:text-blue-400"}`} />
                    <span className="text-xs">{item.name}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                      1s Live
                    </span>
                  )}
                  {item.badge && !item.highlight && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-gray-300 border border-white/5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Section 2: Quant & AI Suite */}
        <div>
          <div className="px-3 py-1 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
            Quant Suite & AI Tools
          </div>
          <div className="space-y-1 mt-0.5">
            {quantSuite.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-purple-600/25 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)] font-semibold" 
                      : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"}`} />
                    <span className="text-xs">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Institutional Security Badge */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-1.5 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400">Institutional Edition</span>
        </div>
        <p className="text-[9px] text-gray-400 leading-tight">
          Brier Score Calibrated • Single-User High Precision
        </p>
      </div>
    </div>
  );
}
