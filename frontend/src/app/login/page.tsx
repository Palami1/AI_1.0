"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { BrainCircuit, Lock, KeyRound, ShieldAlert, Sparkles, Delete } from "lucide-react";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginWithPin } = useAppStore();
  const router = useRouter();

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError("");
      if (newPin.length === 6) {
        submitPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  const submitPin = (code: string) => {
    setLoading(true);
    setTimeout(() => {
      const success = loginWithPin(code);
      if (success) {
        router.push("/");
      } else {
        setError("ລະຫັດ PIN ບໍ່ຖືກຕ້ອງ! ກະລຸນາລອງໃໝ່ (PIN ເລີ່ມຕົ້ນ: 888888)");
        setPin("");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-radial from-slate-900 via-[#090d16] to-[#04060a] relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="w-full max-w-md glass-panel p-8 border border-white/10 shadow-2xl relative z-10 flex flex-col items-center">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/30 mb-4 animate-bounce-subtle">
          <BrainCircuit className="w-9 h-9 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gradient text-center">LAO AI INVESTMENT OS</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">V3.0 Single User Security</p>
        
        <div className="my-6 text-center">
          <p className="text-sm text-gray-300 font-medium">ປ້ອນລະຫັດ PIN ເພື່ອເຂົ້າສູ່ລະບົບ</p>
          <p className="text-[11px] text-gray-500 mt-0.5">ລະບົບສ່ວນຕົວ ບໍ່ຕ້ອງສະໝັກສະມາຊິກ</p>
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex gap-4 mb-6">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > idx
                  ? "bg-blue-500 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-110"
                  : "border-white/20 bg-white/5"
              }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              disabled={loading}
              className="h-14 rounded-2xl glass-card text-xl font-bold text-white hover:bg-blue-600/30 active:scale-95 transition-all flex items-center justify-center border border-white/5 shadow-md"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => submitPin("888888")}
            className="h-14 rounded-2xl glass-card text-[11px] font-semibold text-blue-400 hover:bg-blue-600/20 active:scale-95 transition-all flex flex-col items-center justify-center border border-white/5"
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            PIN ດ່ວນ
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            disabled={loading}
            className="h-14 rounded-2xl glass-card text-xl font-bold text-white hover:bg-blue-600/30 active:scale-95 transition-all flex items-center justify-center border border-white/5 shadow-md"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl glass-card text-gray-400 hover:text-white hover:bg-rose-600/20 active:scale-95 transition-all flex items-center justify-center border border-white/5"
            aria-label="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Hint */}
        <div className="text-center text-[11px] text-gray-500">
          <span>ລະຫັດ PIN ເລີ່ມຕົ້ນ: </span>
          <span className="text-blue-400 font-mono font-bold">888888</span>
        </div>
      </div>
    </div>
  );
}
