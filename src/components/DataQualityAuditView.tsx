import React, { useState } from 'react';
import { DQIssue } from '../types/retail';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle, Search, Filter, Wrench } from 'lucide-react';

interface DataQualityAuditViewProps {
  dqIssues: DQIssue[];
}

export const DataQualityAuditView: React.FC<DataQualityAuditViewProps> = ({ dqIssues }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const filteredIssues = dqIssues.filter(i => {
    const matchSearch =
      searchTerm === '' ||
      i.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.currentValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.recommendedAction.toLowerCase().includes(searchTerm.toLowerCase());

    const matchSev = selectedSeverity === 'ALL' || i.severity === selectedSeverity;
    const matchType = selectedType === 'ALL' || i.issueType === selectedType;

    return matchSearch && matchSev && matchType;
  });

  const highCount = dqIssues.filter(i => i.severity === 'HIGH').length;
  const medCount = dqIssues.filter(i => i.severity === 'MEDIUM').length;
  const lowCount = dqIssues.filter(i => i.severity === 'LOW').length;

  const issueTypes = Array.from(new Set(dqIssues.map(i => i.issueType))).sort();

  return (
    <div className="space-y-4 pb-12">
      {/* Header and KPI summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>5. Data Quality Audit Engine</span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                {dqIssues.length} Quality Flags Active
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated anomaly detection across German receipts and online feeds: flags missing brands, duplicate scans, price outliers, and unit non-conformities.
            </p>
          </div>
        </div>

        {/* Audit Metrics Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-950 border border-rose-900/40 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Critical Errors (High Severity)</span>
              <span className="text-xl font-bold text-rose-400 block mt-0.5">{highCount} Issues</span>
              <span className="text-[10px] text-slate-500">Missing Brand, Corrupted Price (€0 / &gt;€150)</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 border border-amber-900/40 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Warnings (Medium Severity)</span>
              <span className="text-xl font-bold text-amber-400 block mt-0.5">{medCount} Issues</span>
              <span className="text-[10px] text-slate-500">Duplicate Scans, Non-Standard Units</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 border border-blue-900/40 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Review Flags (Low Severity)</span>
              <span className="text-xl font-bold text-blue-400 block mt-0.5">{lowCount} Issues</span>
              <span className="text-[10px] text-slate-500">Confidence Score 50-84% (Review Queue)</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Record ID, anomaly, action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 w-64 focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Severities</option>
            <option value="HIGH">High Severity (Critical)</option>
            <option value="MEDIUM">Medium Severity (Warning)</option>
            <option value="LOW">Low Severity (Info)</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Anomaly Types</option>
            {issueTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Filtered: <span className="font-semibold text-white">{filteredIssues.length}</span> Anomaly Records
        </div>
      </div>

      {/* Data Quality Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-20">Record ID</th>
                <th className="py-3 px-3">Anomaly Type</th>
                <th className="py-3 px-3 text-center">Severity</th>
                <th className="py-3 px-3">Issue Description</th>
                <th className="py-3 px-3">Current Raw Value</th>
                <th className="py-3 px-3">Expected Target</th>
                <th className="py-3 px-3">Recommended Corrective Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredIssues.map((issue, idx) => (
                <tr key={`${issue.recordId}-${issue.issueType}-${idx}`} className={`hover:bg-slate-800/40 transition ${idx % 2 === 1 ? 'bg-slate-900/40' : ''}`}>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-300">{issue.recordId}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-slate-200 font-semibold">{issue.issueType}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      issue.severity === 'HIGH'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : issue.severity === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200 font-medium">{issue.description}</td>
                  <td className="py-2.5 px-3 font-mono text-rose-300 bg-rose-950/20 rounded px-1.5">
                    {issue.currentValue}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{issue.expectedFormatOrValue}</td>
                  <td className="py-2.5 px-3 text-teal-300 text-[11px] font-medium">
                    {issue.recommendedAction}
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
