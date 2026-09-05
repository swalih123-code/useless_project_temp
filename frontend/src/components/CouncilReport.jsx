import React from 'react';
import { Scroll, Award, Utensils, Zap, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export default function CouncilReport({ result }) {
  if (!result) return null;

  const {
    estimated_layers = 18,
    verdict = "",
    quality_score = 90,
    scientific_metrics = {},
    humorous_notes = [],
    suggested_accompaniment = "Kerala Beef Roast with coconut slivers"
  } = result;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5ED] to-[#F4EBDA]/60 border-2 border-[#DEC29B] rounded-3xl p-6 sm:p-10 shadow-warm-lg relative overflow-hidden">
      {/* Decorative seal watermark */}
      <div className="absolute -right-8 -bottom-8 opacity-5 text-9xl select-none pointer-events-none">
        🫓
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DEC29B]/70">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#DEC29B]/50 border border-[#C9A371] flex items-center justify-center text-2xl shadow-inner">
            📜
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B45309] block">
              Official Document // ID #KP-{(quality_score * 137).toString().padStart(6, '0')}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2A1708] font-display">
              Council Certificate of Dough Lamination
            </h3>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DEC29B] text-xs font-bold text-[#6E4924] hover:bg-[#FAF5ED] shadow-sm transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Certificate
        </button>
      </div>

      {/* Verdict Highlight */}
      <div className="my-6 p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5A93C]/60 shadow-sm flex items-center gap-4">
        <div className="text-3xl">🫓</div>
        <div>
          <span className="text-xs font-bold text-[#8F6335] uppercase">Council Consensus:</span>
          <p className="text-base sm:text-lg font-extrabold text-[#2A1708]">
            "{verdict}"
          </p>
        </div>
      </div>

      {/* Metrics & Pseudoscientific Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Left: Observations */}
        <div className="bg-white/70 rounded-2xl p-5 border border-[#DEC29B]/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F6335] flex items-center gap-1.5 mb-3">
            <Zap className="w-4 h-4 text-[#D97706]" />
            Analytical Observations:
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A2F15]">
            {humorous_notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>
                Spiral Coiling Index: {scientific_metrics.spiral_coiling_index || '1.82'} rad/px
              </span>
            </li>
          </ul>
        </div>

        {/* Right: Pairing & Gastronomic Directive */}
        <div className="bg-white/70 rounded-2xl p-5 border border-[#DEC29B]/50 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F6335] flex items-center gap-1.5 mb-3">
              <Utensils className="w-4 h-4 text-[#B45309]" />
              Prescribed Culinary Accompaniment:
            </h4>
            <div className="p-3.5 rounded-xl bg-[#FAF5ED] border border-[#DEC29B]/60 text-sm font-bold text-[#6E4924]">
              🍛 {suggested_accompaniment}
            </div>
            <p className="text-xs text-[#8F6335] mt-2.5 leading-relaxed">
              Consuming this parotta without the prescribed curry constitutes a violation of Section 4(a) of the Malabar Culinary Accord.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F4EBDA] flex items-center justify-between text-[11px] text-[#B0844F]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Audit Status: Verified Authentic
            </span>
            <span>Grade: A+ Maida</span>
          </div>
        </div>
      </div>

      {/* Sign-off Footer */}
      <div className="pt-4 border-t border-[#DEC29B]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8F6335]">
        <span>Issued by: The Autonomous Kerala Parotta Lamination Tribunal</span>
        <span className="font-mono text-[10px]">VERIFIED-HASH-2026-POROTTA-CV</span>
      </div>
    </div>
  );
}
