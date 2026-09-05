import React from 'react';
import { PlayCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function SamplePicker({ samples, onSelectSample, isAnalyzing }) {
  if (!samples || samples.length === 0) return null;

  return (
    <div className="w-full mt-10">
      <div className="text-center mb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B0844F] bg-[#FAF5ED] px-3 py-1 rounded-full border border-[#DEC29B]/50">
          No Parotta on Hand?
        </span>
        <h3 className="text-lg font-bold text-[#2A1708] font-display mt-2">
          Try Pre-Calibrated Test Subjects
        </h3>
        <p className="text-xs text-[#8F6335]">
          Click any specimen below to immediately run computer vision analysis
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {samples.map((sample) => {
          const isNonParotta = sample.category === 'Non-Parotta';

          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              disabled={isAnalyzing}
              className={`group text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isNonParotta
                  ? 'bg-red-50/40 border-red-200/70 hover:border-red-400 hover:bg-red-50/70'
                  : 'bg-[#FFFDF9] border-[#DEC29B]/70 hover:border-[#D97706] hover:bg-[#FAF5ED] hover:shadow-warm-md hover:-translate-y-1'
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              <div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-[#2A1708]/5 border border-[#DEC29B]/40 relative">
                  <img
                    src={sample.full_image_url}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback icon placeholder if server static isn't up yet
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-sm bg-[#FFFDF9]/90 text-[#6E4924] border border-[#DEC29B]/40">
                    {sample.expected_layers}
                  </div>
                </div>

                <h4 className="font-bold text-[#2A1708] text-sm group-hover:text-[#B45309] transition-colors flex items-center gap-1.5">
                  {sample.name}
                </h4>

                <p className="text-xs text-[#8F6335] mt-1 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F4EBDA] flex items-center justify-between text-xs font-semibold">
                <span className={isNonParotta ? 'text-red-600' : 'text-[#D97706]'}>
                  {isNonParotta ? 'Trigger Error ❌' : 'Run CV Scan'}
                </span>
                <PlayCircle className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isNonParotta ? 'text-red-500' : 'text-[#D97706]'
                }`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
