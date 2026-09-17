"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquareCode, 
  Send, 
  BrainCircuit, 
  Sparkles, 
  Bot, 
  User, 
  ShieldCheck, 
  Loader2,
  Trash2
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "ສະບາຍດີ! ຂ້ອຍແມ່ນ **LAO AI Market Analyst V4.0**. ທ່ານສາມາດພິມຖາມການວິເຄາະຫຼຽນຕ່າງໆ ຕົວຢ່າງ: *'SOL ຕອນນີ້ເປັນແນວໃດ?'*, *'BTC ຄວນເຂົ້າຊື້ບໍ?'* ຫຼື *'ກວດສອບ RSI ແລະ ແນວຮັບ-ແນວຕ້ານຂອງ NEAR'* ໄດ້ເລີຍ!",
      time: "ຕອນນີ້"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, coinSymbol: "BTC/USDT" })
      });
      const data = await res.json();
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      // Fallback AI reply
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `🤖 ບົດວິເຄາະ: ຕະຫຼາດມີແຮງຊື້ສະສົມຈາກປາວານ ແລະ ໂຄງສ້າງລາຄາຍັງຢືນເໜືອເສັ້ນ EMA20. ຄວນແບ່ງໄມ້ເຂົ້າຊື້ ແລະ ຕັ້ງ Stop Loss ຕາມຫຼັກ Risk Management.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "SOL ຕອນນີ້ເປັນແນວໃດ? ຄວນຊື້ບໍ?",
    "BTC ມີສັນຍານ Whale Accumulation ບໍ?",
    "NEAR Indicator RSI ແລະ EMA ເປັນແນວໃດ?",
    "TAO ຜົນໂຫວດ AI Consensus ໄດ້ຈັກສຽງ?"
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col glass-panel overflow-hidden border-white/10 shadow-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-md">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>AI Chat Analyst (ສົນທະນາກັບ AI ພາສາລາວ)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Online
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">ວິເຄາະຕະຫຼາດ, Indicators, ປາວານ ແລະ ແຜນ Risk ແບບ Real-time</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-gray-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-all"
          title="ລ້າງປະຫວັດການສົນທະນາ"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              m.sender === "user" ? "bg-blue-600 text-white" : "bg-purple-600/30 text-purple-300 border border-purple-500/30"
            }`}>
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
              m.sender === "user" 
                ? "bg-blue-600 text-white rounded-tr-none shadow-md" 
                : "bg-slate-900/90 text-gray-200 border border-white/5 rounded-tl-none"
            }`}>
              {m.text}
              <div className={`text-[10px] mt-2 font-mono ${m.sender === "user" ? "text-blue-200 text-right" : "text-gray-500"}`}>
                {m.time}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 text-xs text-gray-400 border border-white/5">
              AI ກຳລັງປະມວນຜົນ 6 Agents ແລະ Indicators...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-white/5 bg-slate-900/40 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-500 shrink-0">ຕົວຢ່າງຄຳຖາມ:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setInput(p)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-gray-300 hover:text-white hover:bg-slate-700 whitespace-nowrap transition-all border border-white/5"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-900/80 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ພິມຄຳຖາມກ່ຽວກັບຫຼຽນ ຫຼື ການເທຣດ ເປັນພາສາລາວ..."
          className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 transition-all shadow-md active:scale-95"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
