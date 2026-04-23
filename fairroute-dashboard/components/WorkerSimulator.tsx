"use client";

import React, { useState } from 'react';
import { Battery, Wifi, Signal, Info, DollarSign, ArrowRight } from 'lucide-react';

export default function WorkerSimulator() {
  const [balance, setBalance] = useState(240);
  const [showDetails, setShowDetails] = useState(false);

  const handleCashOut = () => {
    if (balance > 0) {
      alert("Cashing out ₹" + balance + "... (System Fee: ₹10 applied)");
      setBalance(0);
    }
  };

  return (
    <div className="relative mx-auto border-[8px] border-[#1e1e26] rounded-[2.5rem] h-[600px] w-[280px] bg-black shadow-2xl overflow-hidden">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 pt-4 text-[10px] text-white/60">
        <span>9:41</span>
        <div className="flex gap-1 items-center">
          <Signal size={10} />
          <Wifi size={10} />
          <Battery size={10} />
        </div>
      </div>

      {/* App Content */}
      <div className="p-4 mt-4">
        <div className="bg-[#12121a] rounded-2xl p-4 border border-white/5 text-center mb-4">
          <p className="text-[10px] text-white/40 uppercase font-bold">Today's Earnings</p>
          <h2 className="text-3xl font-black text-[#00ff88]">₹{balance}</h2>
          <p className="text-[9px] text-red-400 mt-1">Status: Low Activity Zone</p>
        </div>

        <button 
          onClick={handleCashOut}
          className="w-full bg-[#00ff88] text-black py-3 rounded-xl font-bold text-xs mb-3 hover:scale-[1.02] transition-transform active:scale-95"
        >
          Instant Cash Out
        </button>

        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full bg-white/5 text-white/60 py-3 rounded-xl font-bold text-xs border border-white/10"
        >
          {showDetails ? "Hide Task Log" : "View Task Details"}
        </button>

        {showDetails && (
          <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-white font-bold">Midnight Delivery</p>
                <p className="text-[8px] text-white/40">Zone C • 12.4km</p>
              </div>
              <span className="text-[#00ff88] text-[10px] font-bold">₹110</span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center opacity-50">
              <div>
                <p className="text-[10px] text-white font-bold">Package Pickup</p>
                <p className="text-[8px] text-white/40">Zone C • 4.2km</p>
              </div>
              <span className="text-[#00ff88] text-[10px] font-bold">₹130</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Interface */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
         <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3">
            <Info size={14} className="text-red-400 shrink-0" />
            <p className="text-[9px] text-red-200 leading-tight">
              High bias detected in your current zone. Earnings are 33% below platform average.
            </p>
         </div>
      </div>
    </div>
  );
}