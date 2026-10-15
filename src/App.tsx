/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  INITIAL_RAW_PRODUCTS,
  GROUND_TRUTH_DATASET
} from './data/retailDatabase';
import {
  executeProductMatching,
  runDataQualityAudit,
  generateInitialReviewQueue
} from './utils/matchingEngine';
import { generateAndDownloadExcel } from './utils/excelExporter';
import { Navbar, ActiveTab } from './components/Navbar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { RawProductDataView } from './components/RawProductDataView';
import { ProductMatchingView } from './components/ProductMatchingView';
import { BrandCategoryReferenceView } from './components/BrandCategoryReferenceView';
import { DataQualityAuditView } from './components/DataQualityAuditView';
import { ManualReviewQueueView } from './components/ManualReviewQueueView';
import { ReviewLogView } from './components/ReviewLogView';
import { AnalysisReportingView } from './components/AnalysisReportingView';
import { GermanEnglishReferenceView } from './components/GermanEnglishReferenceView';
import { GroundTruthBenchmarkView } from './components/GroundTruthBenchmarkView';
import { ReceiptMatcherTool } from './components/ReceiptMatcherTool';
import { RawProduct, MatchedProduct, ReviewLogEntry, ReviewQueueItem } from './types/retail';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [rawProducts, setRawProducts] = useState<RawProduct[]>(INITIAL_RAW_PRODUCTS);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  // Initial computed matched products and audit issues
  const initialMatched = useMemo(() => executeProductMatching(rawProducts), [rawProducts]);
  const [matchedProducts, setMatchedProducts] = useState<MatchedProduct[]>(initialMatched);

  const initialDq = useMemo(() => runDataQualityAudit(rawProducts, matchedProducts), [rawProducts, matchedProducts]);
  const [dqIssues, setDqIssues] = useState(initialDq);

  const initialQueue = useMemo(() => generateInitialReviewQueue(matchedProducts), [matchedProducts]);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>(initialQueue);

  // Initial Review Log entries showing pre-existing audit history
  const [reviewLog, setReviewLog] = useState<ReviewLogEntry[]>([
    {
      logId: 'LOG-1001',
      recordId: 'REC-1003',
      timestamp: '2026-10-15 09:14:22',
      originalValue: 'Brand: CC / CC ZERO 0,33L DOSE',
      correctedValue: 'Coca-Cola (Soft Drinks & Carbonates)',
      decision: 'VERIFIED',
      reviewer: 'Bilingual Analyst (DE/EN)',
      reasonCode: 'OCR_ALIAS_CONFIRMED',
      evidenceUrl: 'https://shop.rewe.de/p/coca-cola-zero-sugar-dose/1003'
    },
    {
      logId: 'LOG-1002',
      recordId: 'REC-1009',
      timestamp: '2026-10-15 09:30:45',
      originalValue: 'Subcategory: Flavored Water',
      correctedValue: 'Soft Drinks & Carbonates (Volvic Tee Pfirsich)',
      decision: 'RE-MAPPED',
      reviewer: 'Bilingual Analyst (DE/EN)',
      reasonCode: 'SUBCAT_RECLASSIFICATION',
      evidenceUrl: 'https://volvic.de/produkte/tee'
    },
    {
      logId: 'LOG-1003',
      recordId: 'REC-1012',
      timestamp: '2026-10-15 10:02:11',
      originalValue: 'H4RIB0 GOLDBAEREN 200G',
      correctedValue: 'Haribo Goldbären 200g',
      decision: 'VERIFIED',
      reviewer: 'Bilingual Analyst (DE/EN)',
      reasonCode: 'OCR_GLITCH_TYPO_RESOLVED',
      evidenceUrl: 'https://haribo.com/de-de/produkte/goldbaeren'
    }
  ]);

  // Handler to resolve a manual review item
  const handleResolveQueueItem = (
    queueId: string,
    decision: 'VERIFIED' | 'RE-MAPPED' | 'REJECTED',
    correctedBrand?: string,
    correctedCategory?: string,
    notes?: string,
    evidenceUrl?: string
  ) => {
    const queueItem = reviewQueue.find(i => i.id === queueId);
    if (!queueItem) return;

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const logId = `LOG-${String(reviewLog.length + 1001)}`;

    // Update queue item
    setReviewQueue(prev => prev.map(item => {
      if (item.id === queueId) {
        return {
          ...item,
          verificationStatus: decision,
          reviewerDecision: decision,
          correctionNotes: notes,
          evidenceSource: evidenceUrl,
          reviewedBy: 'Bilingual Data Analyst',
          reviewedAt: timestamp
        };
      }
      return item;
    }));

    // Append to review log
    const newLogEntry: ReviewLogEntry = {
      logId,
      recordId: queueItem.recordId,
      timestamp,
      originalValue: `${queueItem.suggestedBrand} (${queueItem.suggestedCategory})`,
      correctedValue: `${correctedBrand || queueItem.suggestedBrand} (${correctedCategory || queueItem.suggestedCategory})`,
      decision,
      reviewer: 'Bilingual Data Analyst',
      reasonCode: decision === 'RE-MAPPED' ? 'MANUAL_RECLASSIFICATION' : 'MANUAL_GROUND_TRUTH_VERIFIED',
      evidenceUrl: evidenceUrl || 'https://shop.rewe.de'
    };

    setReviewLog(prev => [newLogEntry, ...prev]);

    // Update matchedProducts array to reflect the approved resolution
    setMatchedProducts(prev => prev.map(m => {
      if (m.recordId === queueItem.recordId) {
        return {
          ...m,
          matchedBrand: correctedBrand || m.matchedBrand,
          productCategory: correctedCategory || m.productCategory,
          matchDecision: decision === 'REJECTED' ? 'REJECTED' : 'AUTO-CONFIRMED',
          reviewerComments: `[Verified by Analyst]: ${notes || 'Ground truth confirmed'}`
        };
      }
      return m;
    }));
  };

  // Download real .xlsx workbook
  const handleDownloadExcel = async () => {
    try {
      setIsDownloading(true);
      await generateAndDownloadExcel(
        rawProducts,
        matchedProducts,
        dqIssues,
        reviewQueue,
        reviewLog
      );
    } catch (err) {
      console.error('Error generating Excel file:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const pendingReviewCount = reviewQueue.filter(i => i.verificationStatus === 'PENDING_REVIEW').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar & Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDownloadExcel={handleDownloadExcel}
        isDownloading={isDownloading}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        pendingReviewCount={pendingReviewCount}
        anomalyCount={dqIssues.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            rawProducts={rawProducts}
            matchedProducts={matchedProducts}
            dqIssues={dqIssues}
            reviewQueue={reviewQueue}
            onNavigateTab={setActiveTab}
            onDownloadExcel={handleDownloadExcel}
          />
        )}

        {activeTab === 'raw_data' && (
          <RawProductDataView rawProducts={rawProducts} />
        )}

        {activeTab === 'matching' && (
          <ProductMatchingView matchedProducts={matchedProducts} />
        )}

        {activeTab === 'reference' && (
          <BrandCategoryReferenceView />
        )}

        {activeTab === 'dq_audit' && (
          <DataQualityAuditView dqIssues={dqIssues} />
        )}

        {activeTab === 'review_queue' && (
          <ManualReviewQueueView
            reviewQueue={reviewQueue}
            matchedProducts={matchedProducts}
            onResolveItem={handleResolveQueueItem}
          />
        )}

        {activeTab === 'review_log' && (
          <ReviewLogView reviewLog={reviewLog} />
        )}

        {activeTab === 'analysis' && (
          <AnalysisReportingView
            rawProducts={rawProducts}
            matchedProducts={matchedProducts}
            dqIssues={dqIssues}
            onDownloadExcel={handleDownloadExcel}
          />
        )}

        {activeTab === 'dictionary' && (
          <GermanEnglishReferenceView />
        )}

        {activeTab === 'ground_truth' && (
          <GroundTruthBenchmarkView matchedProducts={matchedProducts} />
        )}
      </main>

      {/* Modals & Drawers */}
      <ReceiptMatcherTool
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
      />
    </div>
  );
}
