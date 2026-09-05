import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Award, CheckCircle2, Sparkles, Flame, ShieldAlert, Share2, Download, Copy, Check, FileText } from 'lucide-react';
import MetricsGrid from './MetricsGrid';
import VisualComparison from './VisualComparison';
import CouncilReport from './CouncilReport';

export default function ResultsDashboard({ result, originalImage, onReset }) {
  const [animatedLayers, setAnimatedLayers] = useState(0);
  const [copied, setCopied] = useState(false);
  const [receiptCopied, setReceiptCopied] = useState(false);

  const {
    estimated_layers = 18,
    confidence = 82,
    flakiness_score = 91,
    layer_density = "High",
    circularity = 87,
    quality_score = 94,
    verdict = "🏆 Legendary Parotta. This deserves respect."
  } = result || {};

  // Animate layer count from 0 to estimated_layers on mount
  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = Math.max(20, Math.floor(duration / Math.max(1, estimated_layers)));

    const timer = setInterval(() => {
      start += 1;
      setAnimatedLayers(start);
      if (start >= estimated_layers) {
        clearInterval(timer);
      }
    }, stepTime);

    // Fire confetti if Legendary Parotta (score >= 85)
    if (quality_score >= 85) {
      setTimeout(() => {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E5A93C', '#D97706', '#F8CE75', '#B87B1D']
        });
      }, 500);
    }

    return () => clearInterval(timer);
  }, [estimated_layers, quality_score]);

  // Verdict style based on quality score
  const getVerdictStyle = () => {
    if (quality_score >= 90) {
      return {
        bg: 'from-amber-500/15 to-yellow-500/10 border-amber-300 text-amber-950',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: '🏆'
      };
    }
    if (quality_score >= 75) {
      return {
        bg: 'from-orange-500/15 to-amber-500/10 border-orange-300 text-orange-950',
        badge: 'bg-orange-100 text-orange-900 border-orange-300',
        icon: '🔥'
      };
    }
    if (quality_score >= 50) {
      return {
        bg: 'from-yellow-500/15 to-stone-500/10 border-yellow-300 text-stone-900',
        badge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
        icon: '👍'
      };
    }
    if (quality_score >= 25) {
      return {
        bg: 'from-stone-500/15 to-stone-600/10 border-stone-300 text-stone-900',
        badge: 'bg-stone-100 text-stone-800 border-stone-300',
        icon: '😐'
      };
    }
    return {
      bg: 'from-red-500/15 to-red-600/10 border-red-300 text-red-950',
      badge: 'bg-red-100 text-red-900 border-red-300',
      icon: '💀'
    };
  };

  const verdictStyle = getVerdictStyle();

  // SVG Circular progress math
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  const handleShare = () => {
    const text = `My parotta was officially audited at ${estimated_layers} LAYERS (${verdict}) by the Parotta Layer Counter 🫓! Quality Score: ${quality_score}/100`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const receiptText = `PAROTTA ANALYSIS
─────────────────────
Estimated Layers: ${estimated_layers}
Confidence: ${confidence}%
Flakiness: ${flakiness_score}%
Layer Density: ${layer_density}
Circularity: ${circularity}%
Parotta Quality: ${quality_score}/100`;

  const handleCopyReceipt = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(receiptText);
      setReceiptCopied(true);
      setTimeout(() => setReceiptCopied(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Top Banner: Final Humorous Verdict */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 bg-gradient-to-r ${verdictStyle.bg} shadow-warm-md flex flex-col sm:flex-row items-center justify-between gap-6`}>
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/80 border border-white flex items-center justify-center text-4xl shadow-sm shrink-0">
            {verdictStyle.icon}
          </div>
          <div>
            <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border mb-1 ${verdictStyle.badge}`}>
              Official Council Verdict
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-[#2A1708]">
              {verdict}
            </h2>
            <p className="text-xs sm:text-sm text-[#8F6335] mt-1">
              Evaluated with high-precision radial gradient convolutions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#DEC29B] text-xs font-bold text-[#6E4924] hover:bg-[#FAF5ED] shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Copied Link!' : 'Share Audit'}
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#B87B1D] text-white text-xs font-bold shadow-warm-md hover:scale-105 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Analyze Another
          </button>
        </div>
      </div>

      {/* Hero Numbers: Giant Layer Count + Circular Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Giant Animated Layer Count */}
        <div className="md:col-span-2 bg-[#FFFDF9] border border-[#DEC29B]/70 rounded-3xl p-6 sm:p-8 shadow-warm-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8F6335]">
              Estimated Dough Laminations
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF5ED] text-[#D97706] border border-[#DEC29B]">
              {layer_density} Density
            </span>
          </div>

          <div className="my-6">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#2A1708] font-display tracking-tight flex items-baseline gap-3">
              <span>{animatedLayers}</span>
              <span className="text-2xl sm:text-3xl text-[#D97706] font-extrabold uppercase">
                Layers
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8F6335] mt-2">
              Detected across 24 radial profile rays from core to outer crispy perimeter.
            </p>
          </div>

          <div className="pt-4 border-t border-[#F4EBDA] flex items-center justify-between text-xs text-[#8F6335]">
            <span>Algorithm: Multi-Scale Gradient Profiling</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> CV Processed
            </span>
          </div>
        </div>

        {/* Circular Confidence Meter */}
        <div className="bg-[#FFFDF9] border border-[#DEC29B]/70 rounded-3xl p-6 sm:p-8 shadow-warm-md flex flex-col items-center justify-between text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F6335]">
            Algorithm Confidence
          </span>

          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[#F4EBDA]"
                strokeWidth="9"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[#E5A93C] transition-all duration-1000 ease-out"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-black text-[#2A1708] font-display">
                {confidence}%
              </span>
              <span className="text-[10px] font-bold text-[#8F6335] uppercase">
                Confidence
              </span>
            </div>
          </div>

          <p className="text-xs text-[#8F6335] max-w-[200px]">
            Calibrated on radial signal uniformity & contour convexity
          </p>
        </div>
      </div>

      {/* Official PAROTTA ANALYSIS ASCII Receipt & Scientific Disclaimer */}
      <div className="bg-[#FAF5ED] border-2 border-dashed border-[#DEC29B] rounded-3xl p-6 sm:p-7 shadow-warm-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8F6335]">
              Standardized Computer-Vision Receipt
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#DEC29B]/40 text-[#6E4924] font-bold">
              ASCII Specimen
            </span>
          </div>
          <pre className="font-mono text-xs sm:text-sm text-[#2A1708] bg-[#FFFDF9] p-4 sm:p-5 rounded-2xl border border-[#DEC29B]/80 shadow-inner leading-relaxed select-all overflow-x-auto whitespace-pre">
{receiptText}
          </pre>
        </div>

        <div className="flex flex-col items-center lg:items-end justify-between gap-4 w-full lg:w-auto shrink-0 text-center lg:text-right">
          <div className="max-w-xs bg-white/80 p-3.5 rounded-2xl border border-[#DEC29B]/60 text-xs text-[#8F6335] leading-relaxed">
            <p className="font-bold text-[#6E4924] mb-1">
              ⚠️ Experimental CV Estimation
            </p>
            <p className="text-[11px]">
              This layer count is an optical heuristic derived from radial intensity gradients. It is an estimation, not a scientifically certified laboratory measurement.
            </p>
          </div>

          <button
            onClick={handleCopyReceipt}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#DEC29B] text-xs font-bold text-[#6E4924] hover:bg-[#FAF5ED] shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            {receiptCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800">Receipt Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D97706]" />
                <span>Copy ASCII Receipt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Key Metrics Breakdown Grid */}
      <MetricsGrid result={result} />

      {/* Visual Analysis (Before / After Split & Layers) */}
      <VisualComparison originalImage={originalImage} result={result} />

      {/* Official Parotta Council Report & Certificate */}
      <CouncilReport result={result} />
    </div>
  );
}
