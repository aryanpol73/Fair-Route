import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* If you use 'export', remember your /api/gemini/route.ts will NOT work.
     Remove the line below if you want to use Firebase App Hosting (Dynamic).
  */
  output: 'export', 
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;