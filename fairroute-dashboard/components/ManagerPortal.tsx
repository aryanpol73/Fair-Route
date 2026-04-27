"use client";

import { useEffect, useState } from 'react';
import { subscribeToAudits } from '../lib/firebase';
import { Database, Clock, ChevronRight, Zap } from 'lucide-react';

// Adjusted interface to match our "audits" collection schema
interface AuditRecord {
  id: string;
  biasScore: number;
  bestZone: string;
  wageGap: number;
  timestamp: any;
  compliance?: string;
}

export default function ManagerPortal() {
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time subscription using your existing firebase.ts function
    const unsubscribe = subscribeToAudits((data: any) => {
      setHistory(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleExportCSV = () => {
    if (history.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Audit ID", "Timestamp", "Bias Score (%)", "Wage Gap (INR)", "Optimal Zone", "Compliance Status"];

    const csvRows = [];
    csvRows.push(headers.join(','));

    history.forEach(audit => {
      let formattedDate = 'N/A';
      if (audit.timestamp?.toDate) {
        const dateObj = audit.timestamp.toDate();
        formattedDate = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      }

      const values = [
        audit.id,
        formattedDate,
        audit.biasScore,
        audit.wageGap,
        audit.bestZone,
        audit.compliance || 'UNKNOWN'
      ];

      const escapedValues = values.map(val => `"${val}"`);
      csvRows.push(escapedValues.join(','));
    });

    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `fairroute_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#12121a] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col h-[450px] shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2 italic uppercase">
            <Database size={16} className="text-[#00ff88]" />
            Audit History
          </h3>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1 font-bold">Cloud Firestore Archive</p>
        </div>
        <div className="px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-full text-[#00ff88] text-[9px] font-black">
          {history.length} RECORDS
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
        {loading ? (
          <div className="p-10 text-center text-white/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
            Connecting to Grid...
          </div>
        ) : history.length === 0 ? (
          <div className="p-10 text-center text-white/20 text-[10px] font-bold italic">
            No audits synchronized yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {history.map((audit) => (
              <div 
                key={audit.id} 
                className="p-5 hover:bg-[#00ff88]/[0.02] transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-white/80 font-black text-[10px]">
                    <Clock size={12} className="text-[#00ff88]/40" />
                    {/* Safeguard for the timestamp while syncing */}
                    {audit.timestamp?.toDate 
                       ? audit.timestamp.toDate().toLocaleDateString() + " " + audit.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                       : 'Synchronizing...'}
                  </div>
                  <div className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                    audit.biasScore > 50 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20'
                  }`}>
                    {audit.biasScore}% BIAS
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                       <Zap size={10} className="text-blue-400" />
                       <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">Optimal Zone</p>
                    </div>
                    <p className="text-xs text-white font-bold group-hover:text-white transition-colors">
                        {audit.bestZone} <span className="text-white/20 mx-1">|</span> 
                        <span className="text-[#00ff88]"> ₹{audit.wageGap} Gap</span>
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-white/10 group-hover:text-[#00ff88] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-5 bg-black/40 border-t border-white/5">
        <button 
          onClick={handleExportCSV}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[9px] font-black text-white/60 hover:text-white transition-all uppercase tracking-[0.2em]"
        >
          Export Compliance Log (.CSV)
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}