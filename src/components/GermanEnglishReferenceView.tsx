import React, { useState } from 'react';
import { GERMAN_ENGLISH_GLOSSARY } from '../data/retailDatabase';
import { Languages, Search, CheckCircle2, AlertCircle, BookMarked, ShieldCheck } from 'lucide-react';

export const GermanEnglishReferenceView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = Array.from(new Set(GERMAN_ENGLISH_GLOSSARY.map(g => g.category))).sort();

  const filteredGlossary = GERMAN_ENGLISH_GLOSSARY.filter(item => {
    const matchSearch =
      searchTerm === '' ||
      item.germanTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.germanDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.englishTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.abbreviationMeaning && item.abbreviationMeaning.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || item.verificationStatus === statusFilter;
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchSearch && matchStatus && matchCat;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Languages className="w-5 h-5 text-teal-400" />
              <span>9. German–English Product Reference & OCR Glossary</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold">
                Bilingual Data Analyst Domain Asset
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Decodes German supermarket abbreviations (Rewe, Edeka, Aldi, Lidl), regional grocery taxonomy, deposit laws (Pfand), and bilingual classifications.
            </p>
          </div>
        </div>

        {/* Governance Banner: Verification rigor requirement */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">Bilingual Data Governance Rule:</strong> Original German descriptions are preserved verbatim in raw receipts.
            Machine translations are explicitly distinguished from entries certified by a bilingual analyst to prevent semantic errors (e.g. translating "H-Milch" simply as "milk" without UHT distinction, or losing "Waschladungen" unit semantics).
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search German term, translation, OCR code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 w-72 focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="Verified by Bilingual Analyst">Verified by Bilingual Analyst</option>
            <option value="Unverified / Machine Translated">Unverified / Machine Translated</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="text-xs text-slate-400 font-mono ml-auto">
            Showing <span className="font-semibold text-white">{filteredGlossary.length}</span> Glossary Entries
          </div>
        </div>
      </div>

      {/* Dictionary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">German Grocery Term / Receipt OCR</th>
                <th className="py-3 px-3">OCR Abbreviation Decoded</th>
                <th className="py-3 px-3">Standard English Translation</th>
                <th className="py-3 px-3">Category & Subcategory</th>
                <th className="py-3 px-3">Typical German Brands</th>
                <th className="py-3 px-3 text-center">Verification Status</th>
                <th className="py-3 px-3">Market Research Context & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredGlossary.map((g, idx) => (
                <tr key={g.germanTerm} className={`hover:bg-slate-800/40 transition ${idx % 2 === 1 ? 'bg-slate-900/40' : ''}`}>
                  <td className="py-2.5 px-3 font-bold text-teal-300 font-mono">
                    {g.germanTerm}
                  </td>
                  <td className="py-2.5 px-3">
                    {g.abbreviationMeaning ? (
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-[11px] border border-slate-800">
                        {g.abbreviationMeaning}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic text-[11px]">Standard spelling</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    {g.englishTranslation}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-300">{g.category}</div>
                    <div className="text-slate-500 text-[10px]">{g.subcategory}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px]">{g.brand}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      g.verificationStatus === 'Verified by Bilingual Analyst'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {g.verificationStatus === 'Verified by Bilingual Analyst' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {g.verificationStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-xs leading-snug">
                    {g.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
