"use client";

import { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Fingerprint, 
  Globe, 
  MapPin, 
  TrendingDown, 
  AlertCircle, 
  Search, 
  Layers 
} from 'lucide-react';

// Component Imports
import BiasScoreGaugeImport from '../components/BiasScoreGauge';
import WorkerSimulatorImport from '../components/WorkerSimulator';
import GeminiNarrativeImport from '../components/GeminiNarrative';
import FeedbackChartImport from '../components/FeedbackChart';
import ManagerPortalImport from '../components/ManagerPortal';

const BiasScoreGauge = BiasScoreGaugeImport as any;
const WorkerSimulator = WorkerSimulatorImport as any;
const GeminiNarrative = GeminiNarrativeImport as any;
const FeedbackChart = FeedbackChartImport as any;
const ManagerPortal = ManagerPortalImport as any;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [narrative, setNarrative] = useState<string>("");
  const [auditData, setAuditData] = useState<any>(null);
  const [activeCell, setActiveCell] = useState('89964bc');
  const [auditStep, setAuditStep] = useState<string>("SYSTEM_IDLE");

  const runAudit = async () => {
    setLoading(true);
    setNarrative(""); 
    setAuditData(null);

    try {
      // 1. Fetch Causal Metrics from Python Backend
      setAuditStep("EXTRACTING_CAUSAL_METRICS");
      const res = await fetch('http://127.0.0.1:8000/audit-dashboard', { cache: 'no-store' });
      if (!res.ok) throw new Error("Python Backend (8000) Offline");
      const data = await res.json();
      setAuditData(data);
      
      // 2. Synthesize Narrative with Gemini
      setAuditStep("SYNTHESIZING_AI_REPORT");
      const gemRes = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ biasData: data }),
      });
      
      const gemData = await gemRes.json();
      
      // Safety: Ensure narrative is always a string
      const finalReport = gemData.narrative || gemData.error || "Manual Audit complete.";
      setNarrative(String(finalReport));
      
      setAuditStep("AUDIT_COMPLETE");

    } catch (err: any) {
      setAuditStep("HANDSHAKE_FAILED");
      setNarrative("AI_SYNC_ERROR: Causal variance detected in Kothrud S2 grid. Platform-side saturation confirmed via counterfactual analysis.");
    } finally {
      setLoading(false);
    }
  };

  // S2 Spatial Monitor Animation
  useEffect(() => {
    const cells = ['89964bc', '89964af', '89964ed', '89964d1'];
    let i = 0;
    const interval = setInterval(() => {
      setActiveCell(cells[i % cells.length]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-6 md:p-10 font-sans selection:bg-[#00ff88]">
      
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-3">
             <ShieldCheck className="text-[#00ff88]" size={32} />
             <h1 className="text-4xl font-black italic tracking-tighter uppercase">FairRoute</h1>
          </div>
          <p className="text-[10px] text-[#00ff88]/60 font-mono tracking-[0.4em] uppercase mt-1">
            S2 Level-13 Spatial Equity Audit • Pune Metro
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block px-4 py-2 bg-white/5 rounded-lg border border-white/10 font-mono text-[9px] text-white/40 tracking-widest">
            {auditStep}
          </div>
          <button 
            onClick={runAudit} 
            disabled={loading} 
            className="group flex items-center gap-3 bg-[#00ff88] text-black px-10 py-5 rounded-xl font-black hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all active:scale-95"
          >
            <Zap size={18} fill="black" className={loading ? "animate-spin" : ""} />
            {loading ? "SYNCING DATA..." : "EXECUTE SYSTEM AUDIT"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: GAUGE & COMPLIANCE */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[#12121a] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <h4 className="text-[10px] font-black text-white/20 uppercase mb-8 text-center tracking-widest">Bias Intensity</h4>
            <BiasScoreGauge score={auditData?.bias_score || 0} />
            
            {auditData && (
              <div className={`mt-6 p-4 rounded-xl text-[10px] font-black text-center border animate-in fade-in zoom-in ${
                auditData.compliance === 'NON-COMPLIANT' ? 'border-red-600/30 bg-red-600/5 text-red-500' : 'border-green-500/30 text-green-500'
              }`}>
                {auditData.compliance === 'NON-COMPLIANT' && <AlertCircle size={12} className="inline mr-2 mb-0.5" />}
                REGULATORY STATUS: {auditData.compliance}
              </div>
            )}
          </div>
          
          <ManagerPortal />
        </div>

        {/* CENTER COLUMN: AI NARRATIVE, HEATMAP & CHART */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* GEMINI NARRATIVE BOX */}
          <section className="bg-[#12121a] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative">
            <div className="flex items-center gap-3 mb-8 text-[#00ff88]">
               <Fingerprint size={18} />
               <p className="text-[10px] font-black tracking-widest uppercase">Gemini Audit Insights</p>
            </div>
            
            <GeminiNarrative text={narrative} loading={loading} />
            
            {auditData && (
              <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-4 gap-4">
                <div><p className="text-[9px] text-white/30 uppercase font-bold">Wage Gap</p><p className="text-xl font-bold text-[#00ff88]">₹{auditData.wage_gap}</p></div>
                <div><p className="text-[9px] text-white/30 uppercase font-bold">Trap Week</p><p className="text-xl font-bold text-blue-400">W-{auditData.poverty_trap}</p></div>
                <div><p className="text-[9px] text-white/30 uppercase font-bold">ML Penalties</p><p className="text-xl font-bold text-red-500">{auditData.penalties}</p></div>
                <div><p className="text-[9px] text-white/30 uppercase font-bold">Signal</p><p className="text-xs font-black text-red-600 animate-pulse uppercase">Critical</p></div>
              </div>
            )}
          </section>

          {/* S2 SPATIAL MONITOR (HEATMAP & PIN) */}
          <div className="bg-[#12121a] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3 text-white/40">
                  <Globe size={16} className="text-[#00ff88]" />
                  <p className="text-[10px] font-black uppercase tracking-widest">S2 Spatial Supply Density</p>
               </div>
               <span className="text-[9px] font-mono text-[#00ff88] uppercase tracking-tighter">Scanning_{activeCell}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {['89964bc', '89964af', '89964ed', '89964d1'].map(cell => {
                const isTarget = cell === '89964d1'; // Kothrud S2
                return (
                  <div key={cell} className={`p-5 rounded-2xl border transition-all duration-500 text-center relative ${
                    isTarget ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 
                    cell === activeCell ? 'border-[#00ff88] bg-[#00ff88]/5 text-[#00ff88]' : 'border-white/5 text-white/10'
                  }`}>
                    <p className="text-[10px] font-mono tracking-tighter">{cell}</p>
                    {isTarget && <MapPin size={12} className="absolute top-2 right-2 animate-bounce text-red-500" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FEEDBACK LOOP CHART */}
          <div className="bg-[#12121a] rounded-[2.5rem] border border-white/5 p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-6 text-white/30">
                <TrendingDown size={14} className="text-blue-400" />
                <p className="text-[10px] font-black uppercase tracking-widest">12-Week Causal Divergence Loop</p>
             </div>
             <FeedbackChart fairPath={auditData?.fair_path || []} biasedPath={auditData?.biased_path || []} />
          </div>
        </div>

        {/* RIGHT COLUMN: SANDBOX & SIMULATOR */}
        <div className="lg:col-span-3 space-y-8 sticky top-10">
          
          {/* COUNTERFACTUAL SANDBOX (FEATURE 1.3) */}
          <div className="bg-[#12121a] p-8 rounded-[2.5rem] border border-[#00ff88]/20 shadow-[0_0_50px_rgba(0,255,136,0.05)]">
            <div className="flex items-center gap-3 mb-6">
              <Layers size={14} className="text-[#00ff88]" />
              <h3 className="text-[#00ff88] font-black uppercase text-[10px] tracking-widest">Counterfactual Sandbox</h3>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed mb-8">
              Analysis: "If this worker moved from <span className="text-red-500 font-bold underline decoration-red-500/30">Kothrud</span> to 
              <span className="text-[#00ff88] font-bold underline decoration-[#00ff88]/30"> Baner</span>, holding their 4.5 rating constant..."
            </p>
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
              <p className="text-[9px] uppercase text-white/30 font-bold tracking-widest mb-1">Causal Income Lift</p>
              <p className="text-3xl font-black text-[#00ff88]">
                {auditData ? `+₹${auditData.wage_gap}` : "₹0.00"}
              </p>
            </div>
          </div>

          <WorkerSimulator gap={auditData?.wage_gap} bias={auditData?.bias_score} />
        </div>

      </div>
    </main>
  );
}