import React, { useState } from 'react';
import { matchBrand, standardizeUnit, calculateTokenSimilarity, normalizeString } from '../utils/matchingEngine';
import { REFERENCE_BRANDS } from '../data/retailDatabase';
import { Sparkles, X, CheckCircle2, AlertCircle, ArrowRight, Play } from 'lucide-react';

interface ReceiptMatcherToolProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptMatcherTool: React.FC<ReceiptMatcherToolProps> = ({ isOpen, onClose }) => {
  const [testString, setTestString] = useState('JA! H-MILCH 3,5% 1L');
  const [sizeInput, setSizeInput] = useState<number>(1.0);
  const [unitInput, setUnitInput] = useState<string>('l');

  if (!isOpen) return null;

  // Preset examples demonstrating German grocery nuances
  const presets = [
    { label: 'Rewe Private Label (Ja!)', text: 'JA! H-MILCH 3,5% 1L', size: 1.0, unit: 'l' },
    { label: 'Edeka Private Label (G&G)', text: 'G&G REINE BUTTERMILCH 500G', size: 500, unit: 'g' },
    { label: 'dm Drogerie Shampoo', text: 'BALEA CREMEDUSCHE MANDELBLÜTE 300ML', size: 300, unit: 'ml' },
    { label: 'Laundry WL Unit', text: 'PERSIL COLOR GEL 20WL', size: 20, unit: 'wl' },
    { label: 'OCR Abbreviation (CC Dose)', text: 'CC ZERO 0,33L DOSE', size: 0.33, unit: 'l' },
    { label: 'OCR Typos & Glitch', text: 'H4RIB0 GOLDBAEREN 200G', size: 200, unit: 'g' },
    { label: 'Plant-Based Beverage', text: 'ALPRO SOJA OHNE ZUCKER 1L', size: 1.0, unit: 'l' }
  ];

  // Run live match calculation
  const brandResult = matchBrand('', testString);
  const matchedRef = brandResult.matchedBrand;
  const brandScore = brandResult.score;

  const candidateProduct = matchedRef ? `${matchedRef.approvedBrand} Standard Item` : 'Unresolved Product';
  const nameScore = calculateTokenSimilarity(testString, candidateProduct);

  const std = standardizeUnit(sizeInput, unitInput);
  const sizeParity = sizeInput > 0 && std.isStandard;
  const sizeScore = sizeParity ? 20 : 0;

  const overallScore = Math.min(100, Math.round((brandScore * 0.45) + (nameScore * 0.35) + sizeScore));

  const isAutoConfirmed = brandScore >= 85 && sizeParity && overallScore >= 85;
  const isManualReview = !isAutoConfirmed && overallScore >= 50;
  const decision = isAutoConfirmed ? 'AUTO-CONFIRMED' : isManualReview ? 'MANUAL_REVIEW' : 'UNMATCHED';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Interactive Receipt OCR Matcher & Formula Simulator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Test raw German receipt strings or OCR descriptions live against RetailLens’s deterministic formula rules.
        </p>

        {/* Presets */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Quick Test Scenarios:</span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => {
                  setTestString(p.text);
                  setSizeInput(p.size);
                  setUnitInput(p.unit);
                }}
                className="px-2 py-1 text-[11px] rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-[11px] text-slate-300 font-semibold block mb-1">
              Raw Receipt Description:
            </label>
            <input
              type="text"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 font-mono text-teal-300 text-xs rounded-lg p-2.5 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Size:</label>
              <input
                type="number"
                value={sizeInput}
                onChange={(e) => setSizeInput(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 font-mono text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-semibold block mb-1">Unit:</label>
              <input
                type="text"
                value={unitInput}
                onChange={(e) => setUnitInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 font-mono text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Real-time Calculation Breakdown Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-400">Deterministic Score Calculation:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Total Score:</span>
              <span className={`text-base font-bold font-mono ${
                overallScore >= 85 ? 'text-emerald-400' : overallScore >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {overallScore}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Brand Match (45%)</span>
              <span className="font-bold text-white block mt-0.5">{brandScore}%</span>
              <span className="text-[10px] text-teal-400 truncate block">
                {matchedRef ? `${matchedRef.approvedBrand} (${brandResult.method})` : 'No brand matched'}
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Name Sim (35%)</span>
              <span className="font-bold text-white block mt-0.5">{nameScore}%</span>
              <span className="text-[10px] text-slate-400 truncate block">Jaccard token similarity</span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Size Parity (20%)</span>
              <span className="font-bold text-white block mt-0.5">{sizeScore} pts</span>
              <span className="text-[10px] text-slate-400 truncate block">
                {std.canonicalSize} {std.canonicalUnit} ({std.isStandard ? 'Standard' : 'Non-std'})
              </span>
            </div>
          </div>

          {/* Decision Outcome */}
          <div className="pt-2 flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Evaluated Match Decision:</span>
              <span className={`font-bold text-sm flex items-center gap-1.5 mt-0.5 ${
                decision === 'AUTO-CONFIRMED' ? 'text-emerald-400' : decision === 'MANUAL_REVIEW' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {decision === 'AUTO-CONFIRMED' && <CheckCircle2 className="w-4 h-4" />}
                {decision === 'MANUAL_REVIEW' && <AlertCircle className="w-4 h-4" />}
                {decision}
              </span>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[10px]">Assigned Category:</span>
              <span className="font-semibold text-slate-200">
                {matchedRef ? `${matchedRef.category} → ${matchedRef.subcategory}` : 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
