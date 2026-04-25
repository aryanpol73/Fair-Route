"use client";

import { Activity, ShieldCheck, MapPin, Map as MapIcon, Zap, Navigation } from 'lucide-react';

interface WorkerProps {
  gap?: number;
  bias?: number;
  bestZone?: string;
  bestYield?: number;
}

export default function WorkerSimulator({ gap, bias, bestZone, bestYield }: WorkerProps) {
  // If the backend data isn't loaded yet, default to Baner/Kothrud
  const targetZone = bestZone || "Baner";
  const currentZone = "Kothrud";

  return (
    <div className="relative mx-auto w-[320px] h-[650px] bg-black rounded-[3rem] border-[8px] border-[#1a1a24] shadow-2xl overflow-hidden flex flex-col font-sans">
      
      {/* Mobile Header (Fixed) */}
      <div className="bg-[#12121a] pt-10 pb-4 px-6 border-b border-white/5 flex justify-between items-center z-10 shrink-0">
        <div>
          <h4 className="text-[14px] font-black tracking-tight text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#00ff88]" />
            FairRoute<span className="text-white/40 font-normal">Driver</span>
          </h4>
          <p className="text-[9px] text-[#00ff88] uppercase tracking-widest font-bold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">ID: 89964</p>
          <div className="flex items-center gap-1 text-[10px] text-white/60 justify-end mt-1">
             <Activity size={10} className="text-blue-400" />
             L13 Grid Sync
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0f] p-5 space-y-4 pb-28 scrollbar-hide">
        
        {/* Weekly Earnings Card */}
        <div className="bg-[#12121a] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-[40px]"></div>
           <p className="text-[10px] uppercase text-white/50 font-bold tracking-widest mb-1">Weekly Earnings</p>
           <h2 className="text-3xl font-black text-white mb-3">₹3,240</h2>
           
           <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <div>
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">Est. Causal Loss</p>
                <p className="text-[12px] font-black text-red-500">-₹{gap || "488"}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">Bias Divergence</p>
                <p className="text-[12px] font-black text-red-500/80">{bias || 65}%</p>
              </div>
           </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-[#12121a] border border-white/10 hover:bg-white/5 text-white text-[11px] font-black uppercase py-4 rounded-xl transition-all tracking-widest shadow-lg active:scale-95">
          CASHOUT BALANCE
        </button>

        {/* WORKER SUGGESTION & FAKE MAP */}
        <div className="animate-in slide-in-from-bottom-4 duration-700 mt-2">
            
            {/* Suggestion Header */}
            <div className="flex items-center justify-between mb-2 px-1 mt-2">
              <div className="flex items-center gap-2 text-[#00ff88]">
                <MapIcon size={12} className="text-[#00ff88]" />
                <span className="text-[9px] font-black uppercase tracking-widest">Smart Route Suggestion</span>
              </div>
            </div>

            <div className="bg-[#12121a] border border-[#00ff88]/30 rounded-2xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(0,255,136,0.05)]">
              
              {/* Fake Radar Map Display */}
              <div className="relative h-28 w-full bg-[#0a0a0f] rounded-xl border border-[#00ff88]/20 overflow-hidden mb-3">
                {/* Grid Lines Overlay */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                
                {/* Current Zone Pin (Red) */}
                <div className="absolute bottom-3 left-4 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute opacity-75"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 relative z-10 border-2 border-[#0a0a0f]"></div>
                  <span className="text-[7px] font-bold text-red-400 mt-1 uppercase bg-black/80 px-1 rounded">{currentZone}</span>
                </div>

                {/* Animated Route Line */}
                <svg className="absolute inset-0 w-full h-full z-0">
                  <path d="M 25 80 Q 70 60 120 25" fill="transparent" stroke="#00ff88" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite] opacity-60" />
                </svg>

                {/* Target Zone Pin (Green) */}
                <div className="absolute top-3 right-5 flex flex-col items-center z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#00ff88] animate-ping absolute opacity-60 shadow-[0_0_10px_#00ff88]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#00ff88] relative z-10 border-2 border-[#0a0a0f] flex items-center justify-center">
                      <Zap size={6} fill="black" className="text-black" />
                  </div>
                  <span className="text-[8px] font-black text-[#00ff88] mt-1 uppercase bg-black/90 px-1.5 py-0.5 rounded shadow-lg border border-[#00ff88]/20">{targetZone}</span>
                </div>
              </div>

              {/* Earnings Info Comparison */}
              <div className="flex justify-between items-center mb-3 bg-black/40 p-2 rounded-lg border border-white/5">
                  <div>
                    <p className="text-[8px] text-white/50 uppercase font-bold tracking-widest mb-0.5">Move To</p>
                    <p className="text-[12px] font-black text-[#00ff88] leading-none">{targetZone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-white/50 uppercase font-bold tracking-widest mb-0.5">Earn More</p>
                    <p className="text-[12px] font-bold text-white">+₹{bestYield || "14.50"}/task</p>
                  </div>
              </div>

              {/* CTA Navigation Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-[#00ff88] hover:bg-[#00ff88]/90 text-black text-[9px] font-black uppercase py-3 rounded-lg transition-all shadow-[0_5px_15px_rgba(0,255,136,0.2)] active:scale-95">
                <Navigation size={10} fill="black" />
                Navigate Now
              </button>
            </div>
        </div>
      </div>

      {/* Mobile Footer/Nav (Fixed) */}
      <div className="absolute bottom-0 w-full bg-[#12121a] border-t border-white/5 p-4 flex justify-between items-center px-8 pb-6 z-20 shrink-0">
        <div className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-90">
           <Activity size={18} className="text-white/40 hover:text-white" />
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer bg-[#00ff88]/10 p-2 rounded-xl border border-[#00ff88]/20 transition-transform active:scale-90">
           <MapPin size={18} className="text-[#00ff88]" />
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-90">
           <ShieldCheck size={18} className="text-white/40 hover:text-white" />
        </div>
      </div>

      {/* Custom Styles for Map Line Animation & Hiding Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -8; }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}