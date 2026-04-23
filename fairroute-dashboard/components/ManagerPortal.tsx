"use client";

import { useEffect, useState } from 'react';
import { subscribeToAudits } from '../lib/firebase';
import { Database, Clock, ChevronRight, AlertTriangle } from 'lucide-react';

interface AuditRecord {
  id: string;
  structural_bias_score: number;
  worst_subgroup: string;
  timestamp: any;
  overall_fairness_score?: number;
}

export default function ManagerPortal() {
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time subscription to Firebase
    const unsubscribe = subscribeToAudits((data: any) => {
      setHistory(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#12121a] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database size={16} className="text-[#00ff88]" />
            Audit History
          </h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Cloud Archive</p>
        </div>
        <div className="px-2 py-1 bg-[#00ff88]/10 rounded text-[#00ff88] text-[10px] font-bold">
          {history.length} RECORDS
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-10 text-center text-white/20 text-xs animate-pulse">
            Connecting to Firestore...
          </div>
        ) : history.length === 0 ? (
          <div className="p-10 text-center text-white/20 text-xs italic">
            No audits recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {history.map((audit) => (
              <div 
                key={audit.id} 
                className="p-4 hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-white/80 font-bold text-xs">
                    <Clock size={12} className="text-white/30" />
                    {audit.timestamp?.toDate().toLocaleDateString() || 'Recent'}
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    audit.structural_bias_score > 50 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {audit.structural_bias_score}% BIAS
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-tighter">Impacted Group</p>
                    <p className="text-xs text-white/60 truncate max-w-[150px]">{audit.worst_subgroup}</p>
                  </div>
                  <ChevronRight size={14} className="text-white/10 group-hover:text-[#00ff88] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/5">
        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white/60 transition-all uppercase tracking-widest">
          Export Compliance Log (.CSV)
        </button>
      </div>
    </div>
  );
}