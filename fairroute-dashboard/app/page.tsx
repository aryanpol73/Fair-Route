"use client";

import React, { useState, useEffect } from 'react';
import { Space_Mono, Inter } from 'next/font/google';
import * as Recharts from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'] });

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [recalibrationActive, setRecalibrationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className={`min-h-screen bg-[#0a0a0f] text-slate-300 p-8 ${inter.className}`}>
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-6 space-y-6">
          <header className="flex justify-between items-center border-b border-[#1e1e2e] pb-4">
            <h1 className="text-xl font-bold tracking-tighter text-white">FAIRROUTE AUDIT SYSTEM</h1>
            <button 
              onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 2000); }}
              className="px-6 py-2 bg-[#00ff88] text-black font-bold text-xs rounded flex items-center gap-2"
            >
              {isLoading ? <Icons.Loader2 className="animate-spin" size={14} /> : <Icons.Zap size={14} />}
              RUN AUDIT
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#12121a] border border-[#1e1e2e] p-6 rounded-xl h-48 flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-500 font-bold mb-4 uppercase">Bias Score</span>
              <div className={`text-5xl font-bold ${spaceMono.className}`}>84.2</div>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] p-6 rounded-xl h-48 flex flex-col justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2"><Icons.ShieldCheck className="text-[#00ff88]" size={16}/> RECALIBRATION</h3>
              <button 
                onClick={() => setRecalibrationActive(!recalibrationActive)}
                className={`w-12 h-6 rounded-full relative transition-colors ${recalibrationActive ? 'bg-[#00ff88]' : 'bg-slate-700'}`}
              >
                <motion.div animate={{ x: recalibrationActive ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (Mobile Frame) */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-[320px] h-[640px] bg-black rounded-[3rem] border-[8px] border-[#1e1e2e] relative overflow-hidden flex flex-col">
            <div className="flex-1 bg-[#0a0a0f] p-6 pt-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"><Icons.User size={20} /></div>
                <div><h2 className="text-sm font-bold">Zara K.</h2><p className="text-[10px] text-slate-500 uppercase">Zone C • Night</p></div>
              </div>
              <div className="p-4 bg-[#12121a] rounded-xl border border-[#1e1e2e] mb-6">
                <span className="text-[9px] text-slate-500 uppercase">Current Pay</span>
                <div className={`text-2xl font-bold ${spaceMono.className} ${recalibrationActive ? 'text-[#00ff88]' : 'text-[#ff3366]'}`}>
                  ${recalibrationActive ? "448.20" : "304.50"}
                </div>
              </div>
              <div className="h-32 w-full mb-4">
                <Recharts.ResponsiveContainer width="100%" height="100%">
                  <Recharts.AreaChart data={[{w:1,v:100},{w:2,v:120},{w:3,v:80}]}>
                    <Recharts.Area type="monotone" dataKey="v" stroke="#00ff88" fill="#00ff88" fillOpacity={0.1} />
                  </Recharts.AreaChart>
                </Recharts.ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}