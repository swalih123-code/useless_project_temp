import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, X, ArrowRight } from 'lucide-react';

export default function ImageUploader({ selectedFile, previewUrl, onSelectFile, onClear, onAnalyze, isAnalyzing }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onSelectFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        // Dropzone Area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-[#D97706] bg-[#FAF5ED] scale-[1.01] shadow-golden-glow'
              : 'border-[#DEC29B] bg-[#FFFDF9] hover:border-[#C9A371] hover:bg-[#FAF5ED]/50 shadow-warm-md'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-20 h-20 mb-5 rounded-3xl bg-gradient-to-tr from-[#FAF5ED] to-[#F4EBDA] border border-[#DEC29B]/60 flex items-center justify-center text-4xl shadow-warm-sm group-hover:scale-110 transition-transform">
              🫓
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#2A1708] font-display mb-2">
              Upload Your Parotta
            </h3>
            <p className="text-sm text-[#8F6335] mb-6 leading-relaxed">
              Drag & drop your photograph here, or click to browse.
              Supports JPG, JPEG, and PNG.
            </p>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#E5A93C] to-[#B87B1D] text-white font-semibold text-sm shadow-warm-md hover:shadow-golden-glow hover:scale-105 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              Choose Parotta File
            </button>

            <div className="mt-6 flex items-center gap-4 text-xs text-[#B0844F]">
              <span>✓ Spiral lamination detection</span>
              <span>•</span>
              <span>✓ Flakiness quantification</span>
            </div>
          </div>
        </div>
      ) : (
        // Image Preview Area
        <div className="bg-[#FFFDF9] border border-[#DEC29B]/70 rounded-3xl p-6 sm:p-8 shadow-warm-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F4EBDA]">
            <div className="flex items-center gap-2">
              <span className="text-xl">📸</span>
              <div>
                <h4 className="font-bold text-[#2A1708] text-sm sm:text-base font-display">
                  {selectedFile ? selectedFile.name : 'Selected Parotta Image'}
                </h4>
                <p className="text-xs text-[#8F6335]">Ready for computer vision layer analysis</p>
              </div>
            </div>

            <button
              onClick={onClear}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F4EBDA] text-[#6E4924] hover:bg-[#DEC29B] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Change Image
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black/5 aspect-[4/3] max-h-[420px] mx-auto border border-[#DEC29B]/40 shadow-inner flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Uploaded Parotta Preview"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#8F6335] italic text-center sm:text-left">
              * The Parotta Council will inspect radial ridges, toast marks, and flakiness variance.
            </p>

            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D97706] via-[#E5A93C] to-[#B87B1D] text-white font-bold text-base shadow-warm-lg hover:shadow-golden-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className="w-5 h-5 text-[#FAF5ED]" />
              Analyze Parotta
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
