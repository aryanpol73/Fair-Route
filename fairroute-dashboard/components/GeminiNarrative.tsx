"use client";
import React from 'react';

export default function GeminiNarrative({ text, loading }: { text: string; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
      </div>
    );
  }

  if (!text) {
    return (
      <p className="text-white/30 italic text-sm">
        Awaiting audit data... Click "RUN FULL AUDIT" to generate insights.
      </p>
    );
  }

  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm">
        {text}
      </div>
    </div>
  );
}