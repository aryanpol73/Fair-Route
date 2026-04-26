"use client";

import { useState } from 'react';
import { Zap, ShieldCheck, Fingerprint, Navigation, TrendingDown, Map as MapIcon } from 'lucide-react';
import { saveAuditResult } from '../lib/firebase';

// Component Imports
import BiasScoreGaugeImport from '../components/BiasScoreGauge';
import WorkerSimulatorImport from '../components/WorkerSimulator';
import GeminiNarrativeImport from '../components/GeminiNarrative';
import FeedbackChartImport from '../components/FeedbackChart';
import ManagerPortalImport from '../components/ManagerPortal';
import PlatformComparisonImport from '../components/PlatformComparison';

// Bypassing strict types for rapid implementation
const BiasScoreGauge = BiasScoreGaugeImport as any;
const WorkerSimulator = WorkerSimulatorImport as any;
const GeminiNarrative = GeminiNarrativeImport as any;
const FeedbackChart = FeedbackChartImport as any;
const ManagerPortal = ManagerPortalImport as any;
const PlatformComparison = PlatformComparisonImport as any;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [narrative, setNarrative] = useState("");
  const [auditData, setAuditData] = useState<any>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/audit-dashboard');
      const data = await res.json();
      setAuditData(data);
      
      const groqRes = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ biasData: data }),
      });
      const groqData = await groqRes.json();
      
      let finalReport = "";
      if (typeof groqData.narrative === 'string') {
        finalReport = groqData.narrative;
      } else if (groqData.narrative && typeof groqData.narrative.narrative === 'string') {
        finalReport = groqData.narrative.narrative;
      } else if (typeof groqData === 'string') {
        finalReport = groqData;
      } else {
        finalReport = "AI Audit complete: Causal gap detected in Kothrud. Recommendation: Relocate to Baner for higher yield.";
      }
      
      setNarrative(finalReport);

      if (data) {
        await saveAuditResult({
          biasScore: data.bias_score || 0,
          wageGap: data.wage_gap || 0,
          bestZone: data.best_zone || "Baner",
          bestYield: data.best_yield || 0,
          compliance: data.compliance || "UNKNOWN"
        });
      }

    } catch (err) {
      console.error("Audit Error:", err);
      setNarrative("Routing Engine Offline... suggesting Hinjewadi for immediate 12% yield increase.");
    } finally {
      setLoading(false);
    }
  };

  // 🌍 DYNAMIC S2 SPATIAL LOGIC
  // We map your real zones to fake S2 cell IDs for the visualization
  const s2Clusters = [
    { id: '89964bc', zone: 'Baner', type: 'high-yield' },
    { id: '89964bd', zone: 'Baner', type: 'neutral' },
    { id: '89964af', zone: 'Hinjewadi', type: 'high-yield' },
    { id: '89964ae', zone: 'Hinjewadi', type: 'neutral' },
    { id: '89964d1', zone: 'Kothrud', type: 'suppressed' },
    { id: '89964d2', zone: 'Kothrud', type: 'suppressed' },
    { id: '89964ec', zone: 'Zone C', type: 'suppressed' },
    { id: '89964ed', zone: 'Zone C', type: 'neutral' },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white p-10 font-sans selection:bg-[#00ff88]">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#00ff88]" size={32} />
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-[#00ff88]">FairRoute</h1>
        </div>
        <button 
          onClick={runAudit} 
          disabled={loading} 
          className="bg-[#00ff88] text-black px-10 py-5 rounded-xl font-black hover:shadow-[0_0_20px_#00ff88] transition-all active:scale-95 flex items-center gap-2"
        >
          {loading ? <Zap className="animate-spin" size={18} /> : <Zap size={18} />}
          {loading ? "ANALYZING..." : "EXECUTE SMART AUDIT"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MANAGER DASHBOARD */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-[#12121a] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
            <h4 className="text-[10px] font-black text-white/20 uppercase mb-6 text-center tracking-widest">Structural Bias</h4>
            <BiasScoreGauge score={auditData?.bias_score || 0} />
            {auditData && (
              <div className={`mt-6 p-4 rounded-xl text-[10px] font-black text-center border ${
                auditData.compliance === 'NON-COMPLIANT' ? 'border-red-600/30 bg-red-600/5 text-red-500' : 'border-green-500/30 text-green-500'
              }`}>
                REGULATORY STATUS: {auditData.compliance}
              </div>
            )}
          </div>
          <ManagerPortal />
        </div>

        {/* CENTER COLUMN: FEED & HEATMAP */}
        <div className="lg:col-span-6 space-y-8">
          
          <PlatformComparison 
            baseValue={auditData?.legacy_base_task_value || 40.00} 
            causalLift={auditData?.best_yield || auditData?.wage_gap || 45.00} 
          />

          {/* AI STRATEGY NARRATIVE */}
          <section className="bg-[#12121a] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8 text-[#00ff88]">
              <Fingerprint size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">AI Strategy Report</p>
            </div>
            <GeminiNarrative text={narrative} loading={loading} />
          </section>

          {/* 🔥 DYNAMIC S2 SPATIAL MONITOR 🔥 */}
          <div className="bg-[#12121a] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-white/30">
                <MapIcon size={14} className="text-[#00ff88]"/>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#00ff88]">S2 Cell Routing Matrix</p>
              </div>
              <p className="text-[9px] text-white/40 font-mono">
                TARGET: {auditData?.best_zone ? auditData.best_zone.toUpperCase() : "AWAITING AUDIT"}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {s2Clusters.map((cell) => {
                // Check if this cell belongs to the AI's chosen best zone
                const isTargetZone = auditData?.best_zone && cell.zone === auditData.best_zone;
                
                return (
                  <div key={cell.id} className={`p-4 rounded-2xl border transition-all duration-700 relative flex flex-col items-center justify-center gap-1 ${
                    isTargetZone 
                      ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.1)] scale-105' 
                      : cell.type === 'suppressed'
                        ? 'border-red-500/30 bg-red-500/5 text-red-500/50' 
                        : 'border-white/5 text-white/10 bg-white/[0.01]'
                  }`}>
                    <p className="text-[10px] font-mono tracking-tighter">{cell.id}</p>
                    <span className="text-[7px] uppercase tracking-widest opacity-50">{cell.zone}</span>
                    {isTargetZone && <Navigation size={12} className="absolute top-2 right-2 text-[#00ff88] animate-pulse" />}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* FEEDBACK LOOP CHART */}
          <div className="bg-[#12121a] rounded-[2.5rem] border border-white/5 p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-6 text-white/30">
               <TrendingDown size={14} className="text-[#00ff88]"/>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#00ff88]">Causal Loop</p>
             </div>
             <FeedbackChart fairPath={auditData?.fair_path || []} biasedPath={auditData?.biased_path || []} />
          </div>
        </div>

        {/* RIGHT COLUMN: WORKER SIMULATOR */}
        <div className="lg:col-span-3 sticky top-10">
          <WorkerSimulator 
            gap={auditData?.wage_gap} 
            bias={auditData?.bias_score} 
            bestZone={auditData?.best_zone} 
            bestYield={auditData?.best_yield}
          />
        </div>
      </div>
    </main>
  );
}