import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';
import SamplePicker from '../components/SamplePicker';
import AnalysisLoading from '../components/AnalysisLoading';
import ResultsDashboard from '../components/ResultsDashboard';
import NonParottaAlert from '../components/NonParottaAlert';
import { analyzeImage, fetchSamples, fetchSampleBlob } from '../services/api';
import { Sparkles, HelpCircle, Utensils } from 'lucide-react';

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [samples, setSamples] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load sample test subjects on mount
  useEffect(() => {
    fetchSamples().then(setSamples).catch(() => {});
  }, []);

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample) => {
    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setAnalysisResult(null);
      
      // Set preview immediately
      setPreviewUrl(sample.full_image_url);

      // Download sample file blob
      const file = await fetchSampleBlob(sample.full_image_url);
      setSelectedFile(file);

      // Analyze
      const result = await analyzeImage(file);
      setAnalysisResult(result);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to analyze sample parotta');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setAnalysisResult(null);

      const result = await analyzeImage(selectedFile);
      setAnalysisResult(result);
    } catch (err) {
      setErrorMessage(err.message || 'Could not complete computer vision analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section if not showing results */}
        {!analysisResult && !isAnalyzing && (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5ED] border border-[#DEC29B]/60 text-xs font-bold text-[#8F6335] mb-4">
              <span>🫓</span>
              <span>Kerala Culinary Vision Project</span>
              <span className="w-1 h-1 rounded-full bg-[#C9A371]" />
              <span>Humorous & Functional</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-[#2A1708] font-display tracking-tight leading-tight">
              How Many Layers is Your Parotta Really Hiding?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#8F6335] leading-relaxed">
              Upload any photo of a Kerala-style parotta. Our state-of-the-art, completely unnecessary
              computer vision algorithm counts the visible dough ridges, rates flakiness, and issues an
              official Council verdict.
            </p>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-red-100/90 border border-red-300 text-red-900 text-sm font-semibold flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs bg-white/70 px-2 py-1 rounded-lg hover:bg-white text-red-950 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic App State Display */}
        {isAnalyzing ? (
          <AnalysisLoading previewUrl={previewUrl} />
        ) : analysisResult ? (
          analysisResult.is_parotta ? (
            <ResultsDashboard
              result={analysisResult}
              originalImage={previewUrl}
              onReset={handleReset}
            />
          ) : (
            <NonParottaAlert
              result={analysisResult}
              onReset={handleReset}
            />
          )
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <ImageUploader
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              onSelectFile={handleSelectFile}
              onClear={handleReset}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />

            <SamplePicker
              samples={samples}
              onSelectSample={handleSelectSample}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#F4EBDA] bg-[#FFFDF9] py-8 text-center text-xs text-[#8F6335]">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-[#6E4924]">
            Parotta Layer Counter 🫓 — Crafted for TinkerHub Useless Projects 3.0
          </p>
          <p className="text-[11px] text-[#DEC29B] leading-relaxed max-w-xl mx-auto">
            * Disclaimer: This application provides an experimental computer-vision approximation.
            No parottas were harmed in the making of this algorithm, although several were enthusiastically
            consumed with Kerala Beef Fry during testing.
          </p>
        </div>
      </footer>
    </div>
  );
}
