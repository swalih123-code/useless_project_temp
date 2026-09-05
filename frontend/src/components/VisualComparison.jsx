import React, { useState } from 'react';
import { Eye, Layers, Activity, Flame, Sliders, Columns } from 'lucide-react';

export default function VisualComparison({ originalImage, result }) {
  const [activeTab, setActiveTab] = useState('slider'); // 'slider', 'side-by-side', 'annotated', 'edge', 'heatmap', 'original'
  const [sliderPosition, setSliderPosition] = useState(50);

  if (!result) return null;

  const annotatedUrl = result.annotated_image || originalImage;
  const edgeUrl = result.edge_image || originalImage;
  const heatmapUrl = result.heatmap_image || originalImage;

  // Selected overlay based on tab
  const getDisplayImage = () => {
    switch (activeTab) {
      case 'edge':
        return edgeUrl;
      case 'heatmap':
        return heatmapUrl;
      case 'original':
        return originalImage;
      case 'annotated':
      default:
        return annotatedUrl;
    }
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#DEC29B]/70 rounded-3xl p-6 sm:p-8 shadow-warm-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F4EBDA]">
        <div>
          <h3 className="text-xl font-bold text-[#2A1708] font-display flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#D97706]" />
            Computer Vision Layer Inspection
          </h3>
          <p className="text-xs text-[#8F6335]">
            Compare original photograph with algorithmic layer boundary and texture extraction
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF5ED] rounded-xl border border-[#DEC29B]/60 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('slider')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'slider'
                ? 'bg-[#E5A93C] text-white shadow-sm'
                : 'text-[#6E4924] hover:bg-[#F4EBDA]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Interactive Split Slider
          </button>
          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'side-by-side'
                ? 'bg-[#E5A93C] text-white shadow-sm'
                : 'text-[#6E4924] hover:bg-[#F4EBDA]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveTab('annotated')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'annotated'
                ? 'bg-[#E5A93C] text-white shadow-sm'
                : 'text-[#6E4924] hover:bg-[#F4EBDA]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Detected Layers
          </button>
          <button
            onClick={() => setActiveTab('edge')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'edge'
                ? 'bg-[#E5A93C] text-white shadow-sm'
                : 'text-[#6E4924] hover:bg-[#F4EBDA]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Edge Map
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'heatmap'
                ? 'bg-[#E5A93C] text-white shadow-sm'
                : 'text-[#6E4924] hover:bg-[#F4EBDA]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Flakiness Heatmap
          </button>
        </div>
      </div>

      {/* Main Visualization Display */}
      {activeTab === 'slider' ? (
        // Split Slider Comparison View
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] max-h-[480px] select-none shadow-inner border border-[#DEC29B]/50 bg-black/10">
            {/* Background: Annotated Image */}
            <img
              src={annotatedUrl}
              alt="Analyzed Layers"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Foreground: Original Image clipped by slider position */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalImage}
                alt="Original Parotta"
                className="w-full h-full object-contain max-w-none"
                style={{
                  width: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Divider line */}
            <div
              className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#E5A93C] text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">
                ↔
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white z-10">
              Original Photo
            </div>
            <div className="absolute top-3 right-3 bg-[#E5A93C]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white z-10">
              Analyzed Layers
            </div>
          </div>

          {/* Slider input control */}
          <div className="flex items-center gap-4 px-2">
            <span className="text-xs font-semibold text-[#8F6335]">Original</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="w-full h-2 bg-[#F4EBDA] rounded-lg appearance-none cursor-ew-resize accent-[#E5A93C]"
            />
            <span className="text-xs font-semibold text-[#D97706]">Analyzed</span>
          </div>
        </div>
      ) : activeTab === 'side-by-side' ? (
        // Side-by-side layout
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#8F6335]">Original Photo</span>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-black/5 border border-[#DEC29B]/40 shadow-sm">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#D97706]">Analyzed Overlay (Detected Layers)</span>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-black/5 border border-[#DEC29B]/40 shadow-sm">
              <img
                src={annotatedUrl}
                alt="Annotated"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : (
        // Single view for tabs (annotated, edge, heatmap, original)
        <div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] max-h-[480px] bg-black/5 border border-[#DEC29B]/50 shadow-inner">
            <img
              src={getDisplayImage()}
              alt="Visual Inspection"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
              {activeTab === 'annotated' && 'Detected Layer Contour Map'}
              {activeTab === 'edge' && 'Canny / Sobel Gradient Boundaries'}
              {activeTab === 'heatmap' && 'Laplacian Texture & Flakiness Heatmap'}
              {activeTab === 'original' && 'Raw Camera Capture'}
            </div>
          </div>
        </div>
      )}

      {/* Legend & Algorithm Explanation */}
      <div className="mt-6 pt-4 border-t border-[#F4EBDA] flex flex-wrap items-center justify-between gap-3 text-xs text-[#8F6335]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            Outer Contour Perimeter
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            Radial Ridge Extremum
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
            Concentric Spiral Folds
          </span>
        </div>

        <span className="text-[11px] italic">
          * Experimental CV approximation based on radial gradient intensity profiling
        </span>
      </div>
    </div>
  );
}
