"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { week: 'W1', earnings: 450, morale: 95 },
  { week: 'W2', earnings: 420, morale: 90 },
  { week: 'W3', earnings: 380, morale: 82 },
  { week: 'W4', earnings: 310, morale: 70 },
  { week: 'W5', earnings: 290, morale: 65 },
  { week: 'W6', earnings: 240, morale: 50 },
  { week: 'W7', earnings: 210, morale: 45 },
  { week: 'W8', earnings: 180, morale: 30 },
  { week: 'W9', earnings: 150, morale: 25 },
  { week: 'W10', earnings: 120, morale: 20 },
  { week: 'W11', earnings: 90, morale: 15 },
  { week: 'W12', earnings: 75, morale: 10 },
];

export default function FeedbackChart() {
  return (
    <div className="bg-[#12121a] p-6 rounded-2xl border border-white/5 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Poverty Trap Simulation</h3>
        <p className="text-[10px] text-white/40 mt-1">12-WEEK PROJECTION: BIASED ZONE C</p>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="week" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff40', fontSize: 10 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff40', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#12121a', border: '1px solid #ffffff10', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              dataKey="earnings" 
              stroke="#00ff88" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#00ff88' }} 
              activeDot={{ r: 6 }}
              name="Avg Earnings (₹)"
            />
            <Line 
              type="monotone" 
              dataKey="morale" 
              stroke="#ef4444" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
              name="Acceptance Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
        <p className="text-[10px] text-red-400 leading-tight">
          <strong>CRITICAL:</strong> Algorithmic bias detected as the primary driver for the 84% earnings collapse between Week 1 and Week 12.
        </p>
      </div>
    </div>
  );
}