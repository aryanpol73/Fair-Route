"use client";

import React, { useState, useEffect } from 'react';
import { Space_Mono } from 'next/font/google';

const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] });

interface BiasScoreGaugeProps {
  score: number;
}

const BiasScoreGauge: React.FC<BiasScoreGaugeProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Smoothly animate the number and gauge
    const timeout = setTimeout(() => setDisplayScore(score), 500);
    return () => clearTimeout(timeout);
  }, [score]);

  // 🔥 THE MATH FIX 🔥
  // Because the line (x2="-85") inherently points left, 
  // 0 score = 0 rotation (left). 
  // 50 score = 90 deg rotation (up). 
  // 100 score = 180 deg rotation (right).
  const rotation = (displayScore / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center bg-[#12121a] border border-[#1e1e2e] p-6 rounded-xl h-full w-full min-h-[220px]">
      <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.3em] mb-4">Structural Bias Score</span>
      
      <div className="relative">
        <svg width="220" height="120" viewBox="0 0 240 140" className="overflow-visible">
          {/* Background Arc */}
          <path d="M 20,120 A 100,100 0 0 1 220,120" fill="none" stroke="#1e1e2e" strokeWidth="12" strokeLinecap="round" />
          
          {/* Progress Arc */}
          <path 
            d="M 20,120 A 100,100 0 0 1 220,120" 
            fill="none" 
            stroke={displayScore > 70 ? "#ff3366" : "#00ff88"} 
            strokeWidth="12" 
            strokeDasharray="314" 
            strokeDashoffset={314 - (314 * displayScore) / 100} 
            strokeLinecap="round" 
            className="transition-all duration-1000 ease-out"
          />

          {/* 🔥 Needle 🔥 */}
          <g transform={`translate(120, 120) rotate(${rotation})`} className="transition-transform duration-1000 ease-out">
            <line x1="0" y1="0" x2="-85" y2="0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="0" r="5" fill="#fff" />
            <circle cx="0" cy="0" r="2" fill="#12121a" />
          </g>

          {/* Score Text */}
          <text 
            x="120" y="110" 
            textAnchor="middle" 
            fill="#fff" 
            className={`${spaceMono.className} text-4xl font-bold`}
            style={{ fontSize: '42px' }}
          >
            {Math.round(displayScore)}
          </text>
        </svg>
      </div>

      <div className={`mt-4 px-3 py-1 rounded border text-[10px] font-black tracking-widest transition-colors duration-500 ${
        displayScore > 70 ? 'bg-[#ff3366]/10 text-[#ff3366] border-[#ff3366]/30' : 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30'
      }`}>
        {displayScore > 70 ? 'CRITICAL ANOMALY' : 'SYSTEM NOMINAL'}
      </div>
    </div>
  );
};

export default BiasScoreGauge;