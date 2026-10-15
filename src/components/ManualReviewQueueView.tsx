import React, { useState } from 'react';
import { ReviewQueueItem, ReviewLogEntry, MatchedProduct } from '../types/retail';
import { REFERENCE_BRANDS } from '../data/retailDatabase';
import {
  CheckSquare,
  AlertCircle,
  Check,
  X,
  Edit3,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';

interface ManualReviewQueueViewProps {
  reviewQueue: ReviewQueueItem[];
  matchedProducts: MatchedProduct[];
  onResolveItem: (
    queueId: string,
    decision: 'VERIFIED' | 'RE-MAPPED' | 'REJECTED',
    correctedBrand?: string,
    correctedCategory?: string,
    notes?: string,
    evidenceUrl?: string
  ) => void;
}

export const ManualReviewQueueView: React.FC<ManualReviewQueueViewProps> = ({
  reviewQueue,
  matchedProducts,
  onResolveItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_REVIEW');
  const [activeModalItem, setActiveModalItem] = useState<ReviewQueueItem | null>(null);

  // Form states inside modal
  const [selectedBrand, setSelectedBrand] = useState('');
  const [decisionType, setDecisionType] = useState<'VERIFIED' | 'RE-MAPPED' | 'REJECTED'>('VERIFIED');
  const [notes, setNotes] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const filteredQueue = reviewQueue.filter(item => {
    const matchSearch =
      searchTerm === '' ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.suggestedBrand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || item.verificationStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const pendingCount = reviewQueue.filter(i => i.verificationStatus === 'PENDING_REVIEW').length;
  const verifiedCount = reviewQueue.filter(i => i.verificationStatus === 'VERIFIED' || i.verificationStatus === 'RE-MAPPED').length;

  const handleOpenTriage = (item: ReviewQueueItem) => {
    setActiveModalItem(item);
    setSelectedBrand(item.suggestedBrand);
    setDecisionType('VERIFIED');
    setNotes(`Verified German receipt abbreviation against manufacturer catalog.`);
    setEvidenceUrl(`https://shop.rewe.de/search?q=${encodeURIComponent(item.suggestedBrand)}`);
  };

  const handleConfirmTriage = () => {
    if (!activeModalItem) return;
    const ref = REFERENCE_BRANDS.find(b => b.approvedBrand === selectedBrand);
    const cat = ref ? ref.category : activeModalItem.suggestedCategory;

    onResolveItem(
      activeModalItem.id,
      decisionType,
      selectedBrand,
      cat,
      notes,
      evidenceUrl
    );
    setActiveModalItem(null);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-400" />
              <span>6. Manual Review Queue (Human-In-The-Loop Triage)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-semibold">
                {pendingCount} Pending Triage
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review uncertain matches (50-84%), resolve German OCR abbreviations, verify receipt duplicate flags, and log audit trail entries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total Resolved:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold text-xs">
              {verifiedCount} Verified
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Queue ID, receipt text, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 w-64 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">Pending Review ({pendingCount})</option>
              <option value="VERIFIED">Verified ({reviewQueue.filter(i => i.verificationStatus === 'VERIFIED').length})</option>
              <option value="RE-MAPPED">Re-Mapped ({reviewQueue.filter(i => i.verificationStatus === 'RE-MAPPED').length})</option>
              <option value="REJECTED">Rejected ({reviewQueue.filter(i => i.verificationStatus === 'REJECTED').length})</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Queue Workload: <span className="font-semibold text-white">{filteredQueue.length}</span> SKUs
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-20">Queue ID</th>
                <th className="py-3 px-3 w-20">Record ID</th>
                <th className="py-3 px-3">Original Description</th>
                <th className="py-3 px-3">Candidate Suggested</th>
                <th className="py-3 px-3 text-right">Confidence</th>
                <th className="py-3 px-3">Triage Reason / Flag</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredQueue.map((item, idx) => (
                <tr key={item.id} className={`hover:bg-slate-800/40 transition ${idx % 2 === 1 ? 'bg-slate-900/40' : ''}`}>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-400">{item.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300 font-bold">{item.recordId}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-teal-300">
                    {item.originalDescription}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-200">{item.suggestedBrand}</span>
                    <span className="text-[10px] text-slate-400 block">{item.suggestedCategory}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                    {item.confidenceScore}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px] font-medium">
                    {item.flagReason}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.verificationStatus === 'PENDING_REVIEW'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : item.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.verificationStatus === 'RE-MAPPED'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {item.verificationStatus === 'PENDING_REVIEW' && <Clock className="w-3 h-3" />}
                      {item.verificationStatus === 'VERIFIED' && <CheckCircle2 className="w-3 h-3" />}
                      {item.verificationStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.verificationStatus === 'PENDING_REVIEW' ? (
                      <button
                        onClick={() => handleOpenTriage(item)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-sm"
                      >
                        Triage Item
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenTriage(item)}
                        className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-slate-200 underline"
                      >
                        Edit Decision
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal Dialog */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  Bilingual Analyst Triage — {activeModalItem.recordId}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            {/* Original String Preview */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Raw Description:</span>
              <p className="font-mono text-teal-300 font-bold text-sm">{activeModalItem.originalDescription}</p>
              <p className="text-[11px] text-amber-400 mt-1">Reason: {activeModalItem.flagReason}</p>
            </div>

            {/* Decision Controls */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Select Action Decision:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionType('VERIFIED')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      decisionType === 'VERIFIED'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Confirm Match
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionType('RE-MAPPED')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      decisionType === 'RE-MAPPED'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Re-Map Brand
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionType('REJECTED')}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                      decisionType === 'REJECTED'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    Reject SKU
                  </button>
                </div>
              </div>

              {/* Target Brand Dropdown */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Approved Master Brand:</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500"
                >
                  {REFERENCE_BRANDS.map(b => (
                    <option key={b.brandId} value={b.approvedBrand}>
                      {b.approvedBrand} ({b.category} — {b.parentCompany})
                    </option>
                  ))}
                </select>
              </div>

              {/* Correction Notes */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Analyst Correction Notes:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Decoded OCR abbreviation CC ZERO -> Coca-Cola"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Evidence URL */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Evidence Source URL / Reference:</label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://shop.rewe.de/..."
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTriage}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Decision to Audit Log</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
