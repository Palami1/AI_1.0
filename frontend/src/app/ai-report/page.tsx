"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Info, AlertTriangle } from "lucide-react";

export default function AiReportPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">ລາຍງານ AI (AI Report)</h1>
        <p className="text-gray-400 mt-1">Explainable AI Decisions & Logic</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-panel p-6 border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Latest Decision: WAIT (Hold Capital)</h2>
              <p className="text-sm text-gray-400">Confidence Score: 85% | Asset: BTC/USDT</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-background/50 rounded-lg text-sm border border-card-border font-mono">
            {new Date().toISOString().split('T')[0]}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center text-success">
              <Info className="w-4 h-4 mr-2" /> ຫຼັກຖານ (EVIDENCE: WHY)
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
              <li>Momentum indicator shows divergence.</li>
              <li>Macro agent flags upcoming interest rate news.</li>
              <li>Volume profile indicates weak buying pressure.</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center text-danger">
              <AlertTriangle className="w-4 h-4 mr-2" /> ຈຸດອ່ອນ (WEAKNESS: WHY_NOT)
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
              <li>Long-term trend is still technically bullish.</li>
              <li>Sentiment agent shows extreme fear (potential reversal).</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-background/40 rounded-xl border border-card-border">
          <h4 className="text-sm font-semibold mb-2">FINAL VERDICT</h4>
          <p className="text-sm text-gray-400">
            ລະບົບເລືອກທີ່ຈະປົກປ້ອງເງິນທຶນ (PROTECT_CAPITAL) ເນື່ອງຈາກຄວາມສ່ຽງຈາກຂ່າວເສດຖະກິດມະຫາພາກ. 
            ລໍຖ້າຈົນກວ່າຄວາມຜັນຜວນຈະຫຼຸດລົງຈຶ່ງພິຈາລະນາເຂົ້າຊື້ໃໝ່.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
