import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, Sparkles } from 'lucide-react';

const LOADING_MESSAGES = [
  "Locating parotta…",
  "Counting layers…",
  "Inspecting flakiness…",
  "Consulting the Parotta Council…",
  "Performing highly unnecessary calculations…",
  "Segmenting golden-brown dough contours…",
  "Measuring acoustic clap reverberation…",
  "Calculating Salna absorption coefficient…",
  "Finalizing dough lamination theorem…"
];

export default function AnalysisLoading({ previewUrl }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6 text-center">
      {/* Scanner Visualizer */}
      <div className="relative w-64 h-64 mx-auto mb-8 rounded-3xl overflow-hidden border-2 border-[#E5A93C] shadow-golden-glow bg-[#2A1708]">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Analyzing Parotta"
            className="w-full h-full object-cover opacity-75 blur-[0.5px]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl select-none">
            🫓
          </div>
        )}

        {/* Laser Scanning Line */}
        <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#E5A93C] to-transparent shadow-[0_0_15px_#F59E0B] animate-scan-laser top-0" />

        {/* Reticle Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-36 h-36 border border-[#E5A93C]/50 rounded-full animate-pulse-glow flex items-center justify-center">
            <div className="w-20 h-20 border border-[#E5A93C]/70 rounded-full border-dashed animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Tech Badges */}
        <div className="absolute bottom-2 inset-x-2 bg-black/70 backdrop-blur-md rounded-lg py-1 px-2 text-[10px] font-mono text-[#F8CE75] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            CV SCANNING
          </span>
          <span>FPS: 60.0</span>
        </div>
      </div>

      {/* Rotating Humorous Status Message */}
      <div className="min-h-[56px] flex flex-col items-center justify-center">
        <h3 className="text-xl sm:text-2xl font-bold text-[#2A1708] font-display flex items-center gap-2 transition-all duration-300">
          <Sparkles className="w-5 h-5 text-[#D97706] animate-spin" />
          {LOADING_MESSAGES[msgIndex]}
        </h3>
        <p className="text-xs text-[#8F6335] mt-1">
          Deep learning models are currently arguing with street vendors in Calicut
        </p>
      </div>

      {/* Progress meter */}
      <div className="w-48 mx-auto mt-6 h-1.5 bg-[#F4EBDA] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#D97706] to-[#E5A93C] rounded-full animate-pulse" style={{ width: '85%' }} />
      </div>
    </div>
  );
}
