"use client";

import { useState, useEffect } from 'react';
import { Zap, Activity, ShieldAlert, Fingerprint, Info } from 'lucide-react';
// Import your custom components
import BiasScoreGauge from '../components/BiasScoreGauge';
import WorkerSimulator from '../components/WorkerSimulator';
import GeminiNarrative from '../components/GeminiNarrative';
import FeedbackChart from '../components/FeedbackChart';
import ManagerPortal from '../components/ManagerPortal';
import { saveAuditResult } from '../lib/firebase';

export default function Page() {
  // --- State ---
  const [loading, setLoading] = useState(false);
  const [narrative, setNarrative] = useState("");
  const [auditData, setAuditData] = useState<any>(null);

  // --- The Core Logic (Handshake between Python & Gemini) ---
  const runAudit = async () => {
    setLoading(true);
    setNarrative(""); 
    
    try {
      // 1. Fetch live metrics from Python Backend (Port 8000)
      const pythonRes = await fetch('http://127.0.0.1:8000/audit-dashboard');
      if (!pythonRes.ok) throw new Error("Python Pipeline Offline");
      
      const biasData = await pythonRes.json();
      setAuditData(biasData);

      // 2. Fetch AI Explanation from your Gemini Route (/api/analyse)
      const geminiRes = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ biasData }),
      });
      
      const geminiData = await geminiRes.json();
      if (geminiData.error) throw new Error(geminiData.error);
      
      setNarrative(geminiData.narrative);

      // 3. Save to Firebase History
      await saveAuditResult({
        ...biasData,
        narrative: geminiData.narrative,
        timestamp: new Date()
      });

    } catch (err) {
      console.error("Audit failed:", err);
      setNarrative("CRITICAL CONNECTION ERROR: Ensure Python (Port 8000) is running and your Gemini API Key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-6 md:p-10 font-sans selection:bg-[#00ff88] selection:text-black">
      
      {/* 1. HEADER SECTION (Pure "FairRoute" Branding) */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <Activity className="text-[#00ff88]" size={28} />
             <h1 className="text-4xl font-black tracking-tighter uppercase italic">
               FairRoute
             </h1>
          </div>
          <p className="text-[10px] text-white/30 font-mono tracking-[0.4em] uppercase">
            Algorithmic Accountability Engine v1.4.0
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] text-[#00ff88] font-bold tracking-widest uppercase">System Status: Optimal</span>
            <span className="text-[9px] text-white/20">Last Sync: Just Now</span>
          </div>
          <button 
            onClick={runAudit}
            disabled={loading}
            className="group flex items-center gap-3 bg-[#00ff88] text-black px-10 py-5 rounded-xl font-black hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all active:scale-95 disabled:opacity-30"
          >
            <Zap size={18} fill="black" className={loading ? "animate-spin" : ""} />
            {loading ? "INITIALIZING PIPELINE..." : "RUN FULL SYSTEM AUDIT"}
          </button>
        </div>
      </header>

      {/* 2. THE PREMIUM 3-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT: GAUGES & HISTORY (3/12) --- */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[#12121a] p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md">
            <BiasScoreGauge score={auditData?.structural_bias_score || 0} />
          </div>

          <div className="h-[450px]">
             <ManagerPortal />
          </div>
        </div>

        {/* --- CENTER: AI NARRATIVE & CHART (6/12) --- */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Advocate Insights Box */}
          <section className="bg-[#12121a] border border-white/5 p-10 rounded-[2.5rem] min-h-[400px] relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
               <Fingerprint className="text-[#00ff88]/40" size={18} />
               <p className="text-[10px] font-black text-[#00ff88] tracking-[0.2em] uppercase">Advocate Insights (Powered by Gemini)</p>
            </div>
            
            <div className="relative z-10">
              <GeminiNarrative text={narrative} loading={loading} />
            </div>

            {/* In-box Data Mini-Stats */}
            {auditData && (
              <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">Causal Gap</p>
                  <p className="text-xl font-bold text-[#00ff88]">₹{auditData.causal_wage_gap}</p>
                </div>
                <div>
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">Poverty Trap</p>
                  <p className="text-xl font-bold text-blue-400">Week {auditData.poverty_trap_week}</p>
                </div>
                <div>
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-tighter">Risk Level</p>
                  <p className="text-xl font-bold text-red-500 italic">CRITICAL</p>
                </div>
              </div>
            )}
          </section>

          {/* Feedback Chart Section */}
          <div className="h-[400px] bg-[#12121a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl">
             <FeedbackChart />
          </div>
        </div>

        {/* --- RIGHT: MOBILE VIEW (3/12) --- */}
        <div className="lg:col-span-3 sticky top-10">
          <div className="mb-6 flex items-center justify-between px-2 opacity-30 uppercase font-black text-[10px] tracking-widest">
            <span>Live Worker View</span>
            <Info size={14} />
          </div>
          <WorkerSimulator />
        </div>

      </div>

      <footer className="mt-20 border-t border-white/5 pt-8 text-center opacity-20">
        <p className="text-[9px] uppercase tracking-[0.6em]">FairRoute AI Ethics Framework • 2026 Google Solution Challenge Submission</p>
      </footer>
    </main>
  );
}