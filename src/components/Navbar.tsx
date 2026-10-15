import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Sparkles,
  BarChart3,
  Database,
  GitCompare,
  Tags,
  AlertTriangle,
  CheckSquare,
  History,
  Languages,
  Target
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'raw_data'
  | 'matching'
  | 'reference'
  | 'dq_audit'
  | 'review_queue'
  | 'review_log'
  | 'analysis'
  | 'dictionary'
  | 'ground_truth';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onDownloadExcel: () => void;
  isDownloading: boolean;
  onOpenSandbox: () => void;
  pendingReviewCount: number;
  anomalyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onDownloadExcel,
  isDownloading,
  onOpenSandbox,
  pendingReviewCount,
  anomalyCount
}) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Executive Dashboard', icon: BarChart3 },
    { id: 'raw_data' as ActiveTab, label: 'Raw Product Data', icon: Database, badge: '312' },
    { id: 'matching' as ActiveTab, label: 'Product Matching', icon: GitCompare },
    { id: 'reference' as ActiveTab, label: 'Brand & Category Ref', icon: Tags },
    { id: 'dq_audit' as ActiveTab, label: 'Data Quality Audit', icon: AlertTriangle, badgeCount: anomalyCount, badgeColor: 'bg-rose-500' },
    { id: 'review_queue' as ActiveTab, label: 'Manual Review Queue', icon: CheckSquare, badgeCount: pendingReviewCount, badgeColor: 'bg-amber-500' },
    { id: 'review_log' as ActiveTab, label: 'Review Log', icon: History },
    { id: 'analysis' as ActiveTab, label: 'Analysis & Reporting', icon: BarChart3 },
    { id: 'dictionary' as ActiveTab, label: 'German-English Ref', icon: Languages },
    { id: 'ground_truth' as ActiveTab, label: 'Ground Truth & Benchmark', icon: Target }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-xl">
      {/* Top Banner with Brand and Portfolio Info */}
      <div className="px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                RetailLens
                <span className="text-slate-500 text-xs font-normal">|</span>
                <span className="text-slate-300 text-xs font-medium">Retail Product Matching & Data Quality Analysis</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800">
                Numerator Data Analyst (Bilingual German) Portfolio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Rule-Based Engine</span>
              <span>•</span>
              <span>XLOOKUP & Structured Excel Formulas</span>
              <span>•</span>
              <span>Human-In-The-Loop Triage</span>
              <span>•</span>
              <span>Ground Truth Validation</span>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSandbox}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Interactive OCR String Matcher Sandbox"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Receipt Matcher</span>
          </button>

          <button
            onClick={onDownloadExcel}
            disabled={isDownloading}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/30 transition disabled:opacity-50"
            title="Download the real Microsoft Excel (.xlsx) file with all 10 sheets and formulas"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generating .xlsx...' : 'Download Excel (.xlsx)'}</span>
            <span className="bg-teal-700/60 text-[10px] px-1.5 py-0.5 rounded text-teal-100">
              10 Sheets
            </span>
          </button>
        </div>
      </div>

      {/* Sheet / Tab Navigation Bar */}
      <nav className="px-4 lg:px-6 overflow-x-auto scrollbar-none flex gap-1 pt-1.5 pb-0 bg-slate-900">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-teal-400 text-teal-300 bg-slate-800/60 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {tab.badge}
                </span>
              )}
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded text-white font-bold ${tab.badgeColor}`}>
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
