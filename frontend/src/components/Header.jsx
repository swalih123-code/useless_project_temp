import React from 'react';
import { Sparkles, Award, UtensilsCrossed, Layers } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-[#F4EBDA] bg-[#FFFDF9]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E5A93C] to-[#B87B1D] flex items-center justify-center text-2xl shadow-warm-md text-white select-none ring-2 ring-[#FAF5ED]">
            🫓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#2A1708] font-display">
                PAROTTA LAYER COUNTER
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF5ED] text-[#8F6335] border border-[#DEC29B]/50">
                v1.0-crispy
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8F6335] font-medium">
              Advanced AI technology for a problem nobody asked us to solve.
            </p>
          </div>
        </div>

        {/* Humorous Tag Badges */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#6E4924]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EBDA]/60 border border-[#DEC29B]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            CV Vision Core
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4EBDA]/60 border border-[#DEC29B]/40">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#B45309]" />
            Salna Certified
          </span>
        </div>
      </div>
    </header>
  );
}
