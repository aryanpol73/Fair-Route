"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface BiasData {
  structural_bias_score: number;
  causal_wage_gap: number;
  poverty_trap_week: number;
  worst_subgroup: { zone: string; shift_type: string };
}

interface GeminiNarrativeProps {
  biasData: BiasData | null;
}

const GeminiNarrative: React.FC<GeminiNarrativeProps> = ({ biasData }) => {
  const [narrative, setNarrative] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchNarrative = async () => {
    if (!biasData) return;
    
    setIsLoading(true);
    setIsError(false);
    setNarrative("");

    // Abort previous request if it exists
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(biasData),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Gemini API Error");

      // Streaming logic
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setNarrative((prev) => prev + chunk);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (biasData) fetchNarrative();
  }, [biasData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(narrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to highlight numbers in neon green
  const renderHighlightedText = (text: string) => {
    const parts = text.split(/(\d+%?|\$\d+(?:\.\d{2})?)/g);
    return parts.map((part, i) => (
      <span key={i} className={/(\d+%?|\$\d+)/.test(part) ? "text-[#00ff88] font-mono font-bold" : ""}>
        {part}
      </span>
    ));
  };

  return (
    <div className="bg-[#12121a] border-l-4 border-[#00ff88] rounded-r-xl p-5 relative overflow-hidden shadow-2xl">
      <header className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold bg-gradient-to-r from-[#00ff88] to-[#3b82f6] bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles size={16} className="text-[#00ff88]" />
          ✦ GEMINI AI ANALYSIS
        </h3>
        {narrative && !isLoading && (
          <button onClick={handleCopy} className="text-slate-500 hover:text-white transition-colors">
            {copied ? <CheckCircle size={14} className="text-[#00ff88]" /> : <Copy size={14} />}
          </button>
        )}
      </header>

      <div className="min-h-[100px] text-xs leading-relaxed text-slate-300">
        <AnimatePresence mode="wait">
          {!biasData ? (
            <motion.p key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 italic">
              Run audit to generate AI analysis...
            </motion.p>
          ) : isError ? (
            <motion.div key="error" className="flex flex-col items-center gap-3 py-4">
              <div className="flex items-center gap-2 text-[#ff3366]">
                <AlertCircle size={16} /> <span className="font-bold">Failed to connect to Gemini</span>
              </div>
              <button onClick={fetchNarrative} className="text-[10px] uppercase font-black tracking-widest text-slate-400 border border-slate-700 px-3 py-1 rounded hover:bg-white/5 transition-all">
                Retry Connection
              </button>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="whitespace-pre-wrap">
                {renderHighlightedText(narrative)}
                {isLoading && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-1 h-4 bg-[#00ff88] ml-1 align-middle"
                  />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="text-[9px] font-bold text-slate-600 tracking-tighter uppercase flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
          Powered by Gemini 1.5 Pro
        </div>
      </div>
    </div>
  );
};

export default GeminiNarrative;