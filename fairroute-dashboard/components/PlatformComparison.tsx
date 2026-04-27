"use client";

import { EyeOff, Eye, AlertTriangle, ShieldCheck, Scale, FileQuestion } from 'lucide-react';

interface ComparisonProps {
  baseValue?: number; // The legacy platform's base task value
  causalLift?: number; // The extra money they SHOULD be making (the gap)
}

export default function PlatformComparison({ baseValue, causalLift }: ComparisonProps) {
  // Safe fallbacks if data isn't loaded yet
  const legacyPrice = baseValue ? Number(baseValue).toFixed(2) : "40.00";
  // The FairRoute price is the base value + the money they were being unfairly denied
  const fairPrice = (baseValue && causalLift) ? (Number(baseValue) + Number(causalLift)).toFixed(2) : "85.00";

  return (
    <div className="bg-[#12121a] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      
      <div className="flex items-center gap-3 mb-8">
        <Scale size={18} className="text-blue-400" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">Core Demo: System Comparison</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        {/* VS Badge in the center */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#0a0a0f] border border-white/10 rounded-full items-center justify-center z-10">
          <span className="text-[10px] font-black text-white/40 italic">VS</span>
        </div>

        {/* LEFT: STANDARD PLATFORM (The Problem) */}
        <div className="bg-black/50 border border-red-500/10 rounded-3xl p-6 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-transparent"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest mb-1">Legacy Platform</p>
              <p className="text-lg font-black text-white/60">Base Yield</p>
            </div>
            <div className="bg-red-500/10 p-2 rounded-lg">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0a0a0f] border border-white/5 p-4 rounded-xl">
              <p className="text-[8px] text-white/40 uppercase font-bold mb-1">Algorithmic Order Value</p>
              <p className="text-2xl font-black text-red-400">₹{legacyPrice}</p>
            </div>
            
            <div className="bg-[#0a0a0f] border border-white/5 p-4 rounded-xl flex items-center gap-3 opacity-60">
              <EyeOff size={16} className="text-white/40" />
              <div>
                <p className="text-[10px] font-bold text-white">Hidden Logic</p>
                <p className="text-[8px] text-white/40 uppercase mt-0.5">Black-box Algorithm</p>
              </div>
            </div>

            <div className="bg-[#0a0a0f] border border-white/5 p-4 rounded-xl flex items-center gap-3 opacity-60">
              <FileQuestion size={16} className="text-white/40" />
              <div>
                <p className="text-[10px] font-bold text-white">No Explanation</p>
                <p className="text-[8px] text-white/40 uppercase mt-0.5">Driver lacks context</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FAIRROUTE (The Solution) */}
        <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.05)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ff88] to-transparent"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[9px] text-[#00ff88]/60 uppercase font-bold tracking-widest mb-1">Proposed System</p>
              <p className="text-lg font-black text-[#00ff88]">FairRoute</p>
            </div>
            <div className="bg-[#00ff88]/20 p-2 rounded-lg">
              <ShieldCheck size={16} className="text-[#00ff88]" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-black/40 border border-[#00ff88]/20 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                 <ShieldCheck size={40} className="text-[#00ff88]" />
              </div>
              <p className="text-[8px] text-[#00ff88]/50 uppercase font-bold mb-1">Causal Fair Value</p>
              <p className="text-2xl font-black text-[#00ff88]">₹{fairPrice}</p>
              <p className="text-[8px] text-[#00ff88]/70 font-bold mt-1 tracking-widest">INCLUDES +₹{causalLift ? Number(causalLift).toFixed(2) : "45.00"} LIFT</p>
            </div>
            
            <div className="bg-black/40 border border-[#00ff88]/10 p-4 rounded-xl flex items-center gap-3">
              <Eye size={16} className="text-[#00ff88]" />
              <div>
                <p className="text-[10px] font-bold text-white">Transparent Protocol</p>
                <p className="text-[8px] text-[#00ff88]/60 uppercase mt-0.5">Open-source weightings</p>
              </div>
            </div>

            <div className="bg-black/40 border border-[#00ff88]/10 p-4 rounded-xl flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white">Causal Explanation</p>
                <p className="text-[8px] text-[#00ff88]/60 uppercase mt-0.5">Adjusted for zone saturation</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}