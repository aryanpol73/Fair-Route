import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const stats = body.biasData || body;
    
    // 🔒 Securely load the API key from environment variables
    const apiKey = process.env.GROQ_API_KEY; 

    // Safety check in case the .env file is missing
    if (!apiKey) {
      console.error("ERROR: GROQ_API_KEY is missing from environment variables.");
      throw new Error("Missing API Key");
    }

    const groq = new Groq({ apiKey });

    const prompt = `
      You are the FairRoute Worker Advocate. 
      The worker is currently facing a ₹${stats.wage_gap} gap in Kothrud.
      The data shows that ${stats.best_zone} is the most profitable zone with a yield of ₹${stats.best_yield} per task.

      Write a 3-paragraph strategy for the delivery worker:
      1. Explain the spatial trap in Kothrud.
      2. Recommend migrating to ${stats.best_zone} immediately.
      3. Explain how this move will reclaim their fair earnings.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({ narrative: chatCompletion.choices[0]?.message?.content || "" });
  } catch (e: any) {
    console.error("Audit Generation Failed:", e);
    return NextResponse.json({ narrative: "System Alert: Spatial suppression detected. Recommendation: Relocate to high-yield clusters (Hinjewadi/Baner) to optimize per-task ROI." });
  }
}