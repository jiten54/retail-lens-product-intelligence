import React, { useState } from 'react';
import { ReviewLogEntry } from '../types/retail';
import { History, Search, ExternalLink, ShieldCheck, Download } from 'lucide-react';

interface ReviewLogViewProps {
  reviewLog: ReviewLogEntry[];
}

export const ReviewLogView: React.FC<ReviewLogViewProps> = ({ reviewLog }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLog = reviewLog.filter(log => {
    return (
      searchTerm === '' ||
      log.logId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.originalValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.correctedValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reasonCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-teal-400" />
              <span>7. Review Log (Immutable Audit Trail)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-teal-800/40">
                {reviewLog.length} Audit Entries
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracks every analyst intervention, evidence citation, and mapping correction for full governance and client compliance.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Log ID, Record ID, reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 w-72 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <span className="font-semibold text-white">{filteredLog.length}</span> audit transactions
          </div>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-20">Log ID</th>
                <th className="py-3 px-3 w-20">Record ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Original Raw Value</th>
                <th className="py-3 px-3">Corrected / Verified Value</th>
                <th className="py-3 px-3 text-center">Decision</th>
                <th className="py-3 px-3">Reviewer</th>
                <th className="py-3 px-3">Reason Code</th>
                <th className="py-3 px-3">Evidence Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredLog.map((log, idx) => (
                <tr key={log.logId} className={`hover:bg-slate-800/40 transition ${idx % 2 === 1 ? 'bg-slate-900/40' : ''}`}>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-400">{log.logId}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-300">{log.recordId}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{log.originalValue}</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-300">{log.correctedValue}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.decision === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : log.decision === 'RE-MAPPED'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {log.decision}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{log.reviewer}</td>
                  <td className="py-2.5 px-3 font-mono text-amber-300/90 text-[11px]">{log.reasonCode}</td>
                  <td className="py-2.5 px-3">
                    {log.evidenceUrl ? (
                      <a
                        href={log.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-400 hover:text-teal-300 underline inline-flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Evidence Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-600 italic">None provided</span>
                    )}
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
