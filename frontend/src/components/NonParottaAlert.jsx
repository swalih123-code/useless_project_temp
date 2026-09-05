import React from 'react';
import { AlertOctagon, RotateCcw, HelpCircle, ShieldAlert } from 'lucide-react';

export default function NonParottaAlert({ result, onReset }) {
  const errorMessage = result?.error_message || "❌ This does not appear to be a parotta. Please upload a valid parotta.";
  const notes = result?.humorous_notes || [];

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-red-50/90 border-2 border-red-300 rounded-3xl p-6 sm:p-10 shadow-warm-lg">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-red-100 border border-red-200 flex items-center justify-center text-4xl shadow-sm animate-bounce">
          ❌
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-red-900 font-display">
          Parotta Verification Rejected!
        </h3>
        
        <p className="mt-3 text-lg font-bold text-red-700">
          {errorMessage}
        </p>
      </div>

      {/* Diagnostics */}
      <div className="bg-white/80 rounded-2xl p-5 border border-red-200/80 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5 mb-3">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          Council Forensics Report:
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-red-950 font-medium">
          {notes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>{note}</span>
            </li>
          ))}
          <li className="flex items-start gap-2 text-red-800 italic">
            <span className="text-red-500 font-bold">•</span>
            <span>Tip: Ensure your parotta is clearly visible, well-lit, and un-obscured by innocent cats or laptops.</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:scale-105 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Try Another Photo
        </button>
      </div>
    </div>
  );
}
