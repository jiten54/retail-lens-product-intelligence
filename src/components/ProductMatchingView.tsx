import React, { useState, useMemo } from 'react';
import { MatchedProduct } from '../types/retail';
import { Search, Filter, CheckCircle2, AlertCircle, XCircle, Info, ChevronLeft, ChevronRight, Copy } from 'lucide-react';

interface ProductMatchingViewProps {
  matchedProducts: MatchedProduct[];
}

export const ProductMatchingView: React.FC<ProductMatchingViewProps> = ({ matchedProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filteredMatches = useMemo(() => {
    return matchedProducts.filter(m => {
      const matchSearch =
        searchTerm === '' ||
        m.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.originalDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.matchedBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.candidateProduct.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDec = selectedDecision === 'ALL' || m.matchDecision === selectedDecision;
      const matchCat = selectedCategory === 'ALL' || m.productCategory === selectedCategory;
      const matchDup = !onlyDuplicates || m.isDuplicate;

      return matchSearch && matchDec && matchCat && matchDup;
    });
  }, [matchedProducts, searchTerm, selectedDecision, selectedCategory, onlyDuplicates]);

  const totalPages = Math.ceil(filteredMatches.length / pageSize) || 1;
  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMatches.slice(start, start + pageSize);
  }, [filteredMatches, currentPage, pageSize]);

  const categories = Array.from(new Set(matchedProducts.map(m => m.productCategory))).sort();

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Formula Rule Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>3. Product Matching Engine</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-teal-800/40">
                Rule-Based Multi-Attribute Model
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict deterministic matching: combines brand normalization, candidate lookup, package-size parity, and transparent confidence thresholds.
            </p>
          </div>
        </div>

        {/* Excel Formula Documentation Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Info className="w-4 h-4 text-teal-400" />
            <span>Excel Formula Implementation & Logic Architecture:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px] font-mono text-slate-400">
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <span className="text-teal-400 font-semibold block mb-0.5">Confidence Weighting Formula:</span>
              <code>=ROUND((BrandScore * 0.45) + (NameSimilarity * 0.35) + (SizeParity * 20), 0)</code>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
              <span className="text-teal-400 font-semibold block mb-0.5">Match Decision Threshold Rule:</span>
              <code>=IF(Duplicate=TRUE, "MANUAL_REVIEW", IF(Score&gt;=0.85, "AUTO-CONFIRMED", IF(Score&gt;=0.50, "MANUAL_REVIEW", "UNMATCHED")))</code>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Record ID, brand, description..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 w-64 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Decision Filter */}
          <select
            value={selectedDecision}
            onChange={(e) => { setSelectedDecision(e.target.value); setCurrentPage(1); }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Decisions</option>
            <option value="AUTO-CONFIRMED">Auto-Confirmed (High Confidence)</option>
            <option value="MANUAL_REVIEW">Manual Review (Pending)</option>
            <option value="UNMATCHED">Unmatched</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Duplicate Toggle */}
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyDuplicates}
              onChange={(e) => { setOnlyDuplicates(e.target.checked); setCurrentPage(1); }}
              className="rounded bg-slate-950 border-slate-700 text-teal-500 focus:ring-0"
            />
            <span>Duplicates Only</span>
          </label>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Matching: <span className="font-semibold text-white">{filteredMatches.length}</span> SKUs
        </div>
      </div>

      {/* Main Matching Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-20">Record ID</th>
                <th className="py-3 px-3">Original Description</th>
                <th className="py-3 px-3">Candidate Master SKU</th>
                <th className="py-3 px-3">Matched Brand</th>
                <th className="py-3 px-3">Category & Subcategory</th>
                <th className="py-3 px-3 text-center">Size Parity</th>
                <th className="py-3 px-3 text-right">Confidence</th>
                <th className="py-3 px-3 text-center">Decision</th>
                <th className="py-3 px-3">Decision Rule & Reviewer Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {paginatedMatches.map((m, idx) => (
                <tr key={m.recordId} className={`hover:bg-slate-800/40 transition ${idx % 2 === 1 ? 'bg-slate-900/40' : ''}`}>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-300">{m.recordId}</td>
                  <td className="py-2.5 px-3 font-mono text-teal-300 font-medium">
                    {m.originalDescription}
                    {m.isDuplicate && (
                      <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px]">
                        <Copy className="w-3 h-3" /> Dup of {m.duplicateOfId}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 font-medium">{m.candidateProduct}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-medium">
                      {m.matchedBrand}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{m.productCategory}</div>
                    <div className="text-slate-500 text-[10px]">{m.subcategory}</div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      m.sizeParity ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {m.extractedSizeUnit}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className={`font-bold ${
                      m.overallConfidence >= 85 ? 'text-emerald-400' : m.overallConfidence >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {m.overallConfidence}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {m.matchDecision === 'AUTO-CONFIRMED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        AUTO-CONFIRMED
                      </span>
                    )}
                    {m.matchDecision === 'MANUAL_REVIEW' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <AlertCircle className="w-3 h-3" />
                        MANUAL_REVIEW
                      </span>
                    )}
                    {m.matchDecision === 'UNMATCHED' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        <XCircle className="w-3 h-3" />
                        UNMATCHED
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-[11px] font-medium text-slate-300">{m.decisionRule}</div>
                    <div className="text-[10px] text-slate-400 italic mt-0.5">{m.reviewerComments}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs bg-slate-950/50">
          <div className="text-slate-400">
            Showing <span className="font-semibold text-white">{filteredMatches.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-white">{Math.min(currentPage * pageSize, filteredMatches.length)}</span> of{' '}
            <span className="font-semibold text-white">{filteredMatches.length}</span> entries
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-mono text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
