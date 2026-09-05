import React from 'react';
import { Layers, Flame, CircleDot, Award, Gauge, Sparkles } from 'lucide-react';

export default function MetricsGrid({ result }) {
  if (!result) return null;

  const {
    estimated_layers = 18,
    confidence = 82,
    flakiness_score = 91,
    layer_density = "High",
    circularity = 87,
    quality_score = 94
  } = result;

  const densityColors = {
    Low: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Medium: 'bg-amber-100 text-amber-800 border-amber-300',
    High: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Extreme: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. Flakiness Score */}
      <div className="bg-[#FFFDF9] border border-[#DEC29B]/70 rounded-2xl p-5 shadow-warm-sm hover:shadow-warm-md transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#8F6335] font-semibold mb-2">
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#D97706]" />
            Flakiness
          </span>
          <span className="text-[#2A1708] font-bold">{flakiness_score}%</span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#2A1708] font-display">
          {flakiness_score}
          <span className="text-sm font-medium text-[#8F6335]">/100</span>
        </div>
        <div className="w-full bg-[#F4EBDA] h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#D97706] to-[#E5A93C] h-full rounded-full transition-all duration-1000"
            style={{ width: `${flakiness_score}%` }}
          />
        </div>
        <p className="text-[11px] text-[#8F6335] mt-2">
          {flakiness_score > 80 ? 'Crispy micro-crust lamination' : 'Soft doughy folds'}
        </p>
      </div>

      {/* 2. Layer Density */}
      <div className="bg-[#FFFDF9] border border-[#DEC29B]/70 rounded-2xl p-5 shadow-warm-sm hover:shadow-warm-md transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#8F6335] font-semibold mb-2">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#B45309]" />
            Layer Density
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#2A1708] font-display flex items-baseline gap-2">
          {layer_density}
        </div>
        <div className="mt-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${densityColors[layer_density] || densityColors.High}`}>
            {layer_density} Concentration
          </span>
        </div>
        <p className="text-[11px] text-[#8F6335] mt-2">
          Measured via radial gradient ray-casting
        </p>
      </div>

      {/* 3. Circularity Score */}
      <div className="bg-[#FFFDF9] border border-[#DEC29B]/70 rounded-2xl p-5 shadow-warm-sm hover:shadow-warm-md transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#8F6335] font-semibold mb-2">
          <span className="flex items-center gap-1.5">
            <CircleDot className="w-4 h-4 text-[#C9A371]" />
            Circularity
          </span>
          <span className="text-[#2A1708] font-bold">{circularity}%</span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#2A1708] font-display">
          {circularity}
          <span className="text-sm font-medium text-[#8F6335]">%</span>
        </div>
        <div className="w-full bg-[#F4EBDA] h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#C9A371] to-[#8F6335] h-full rounded-full transition-all duration-1000"
            style={{ width: `${circularity}%` }}
          />
        </div>
        <p className="text-[11px] text-[#8F6335] mt-2">
          {circularity > 75 ? 'Optimal disc symmetry' : 'Artisanal organic shape'}
        </p>
      </div>

      {/* 4. Overall Parotta Quality Score */}
      <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FAF5ED] border-2 border-[#E5A93C] rounded-2xl p-5 shadow-warm-md hover:shadow-golden-glow transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#B45309] font-bold mb-2">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#D97706]" />
            Quality Score
          </span>
          <span className="text-xs bg-[#FAF5ED] px-2 py-0.5 rounded-full border border-[#DEC29B]">
            Index
          </span>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-[#2A1708] font-display flex items-baseline">
          {quality_score}
          <span className="text-sm font-medium text-[#8F6335]">/100</span>
        </div>
        <div className="w-full bg-[#F4EBDA] h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#E5A93C] via-[#D97706] to-[#78350F] h-full rounded-full transition-all duration-1000"
            style={{ width: `${quality_score}%` }}
          />
        </div>
        <p className="text-[11px] text-[#B45309] font-semibold mt-2">
          Composite Lamination Rating
        </p>
      </div>
    </div>
  );
}
