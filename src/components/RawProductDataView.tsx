import React, { useState, useMemo } from 'react';
import { RawProduct } from '../types/retail';
import { Search, Filter, Receipt, ExternalLink, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface RawProductDataViewProps {
  rawProducts: RawProduct[];
}

export const RawProductDataView: React.FC<RawProductDataViewProps> = ({ rawProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState('ALL');
  const [selectedSourceType, setSelectedSourceType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedProductForPreview, setSelectedProductForPreview] = useState<RawProduct | null>(null);

  const filteredProducts = useMemo(() => {
    return rawProducts.filter(p => {
      const matchSearch =
        searchTerm === '' ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.rawDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.extractedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.extractedBrand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRet = selectedRetailer === 'ALL' || p.retailer === selectedRetailer;
      const matchSource = selectedSourceType === 'ALL' || p.sourceType === selectedSourceType;

      return matchSearch && matchRet && matchSource;
    });
  }, [rawProducts, searchTerm, selectedRetailer, selectedSourceType]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const retailers = Array.from(new Set(rawProducts.map(p => p.retailer))).sort();

  return (
    <div className="space-y-4 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>2. Raw Product Data</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-teal-800/40">
              {rawProducts.length} Total Records
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Original German shopping receipts and e-commerce listings with extracted attributes and research metadata.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, brand, description..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 w-64 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Retailer Filter */}
          <select
            value={selectedRetailer}
            onChange={(e) => { setSelectedRetailer(e.target.value); setCurrentPage(1); }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Retailers ({retailers.length})</option>
            {retailers.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Source Type Filter */}
          <select
            value={selectedSourceType}
            onChange={(e) => { setSelectedSourceType(e.target.value); setCurrentPage(1); }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Sources</option>
            <option value="Receipt OCR">Receipt OCR</option>
            <option value="E-Commerce Catalog">E-Commerce Catalog</option>
            <option value="Mobile Scan">Mobile Scan</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-24">Record ID</th>
                <th className="py-3 px-3">Original Description (Receipt / Web)</th>
                <th className="py-3 px-3">Extracted Name</th>
                <th className="py-3 px-3">Extracted Brand</th>
                <th className="py-3 px-3 text-right">Size & Unit</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3">Retailer</th>
                <th className="py-3 px-3">Source Type</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {paginatedProducts.map((p, idx) => (
                <tr key={p.id} className={`hover:bg-slate-800/40 transition ${idx % 2 === 1 ? 'bg-slate-900/40' : ''}`}>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-300">{p.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-200">
                    <span className="font-semibold text-teal-300">{p.rawDescription}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{p.extractedName}</td>
                  <td className="py-2.5 px-3">
                    {p.extractedBrand ? (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                        {p.extractedBrand}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-semibold text-[10px]">
                        MISSING BRAND
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                    {p.packageSize} {p.packageUnit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">
                    <span className={p.priceEur <= 0 || p.priceEur > 100 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      €{p.priceEur.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-medium">{p.retailer}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      p.sourceType === 'Receipt OCR'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : p.sourceType === 'E-Commerce Catalog'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-teal-950 text-teal-300 border border-teal-800'
                    }`}>
                      {p.sourceType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{p.researchDate}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedProductForPreview(p)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Inspect Receipt / Evidence"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs bg-slate-950/50">
          <div className="text-slate-400">
            Showing <span className="font-semibold text-white">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-white">{Math.min(currentPage * pageSize, filteredProducts.length)}</span> of{' '}
            <span className="font-semibold text-white">{filteredProducts.length}</span> entries
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
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-mono text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* German Receipt OCR Inspector Modal */}
      {selectedProductForPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">German Receipt OCR Evidence Inspector</h3>
              </div>
              <button
                onClick={() => setSelectedProductForPreview(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            {/* Receipt Paper Simulation */}
            <div className="bg-amber-50 text-slate-900 font-mono text-xs p-5 rounded-md shadow-inner border border-amber-200/60 space-y-2">
              <div className="text-center border-b border-dashed border-slate-400 pb-2">
                <p className="font-bold text-sm tracking-wider uppercase">{selectedProductForPreview.retailer} MARKT GMBH</p>
                <p className="text-[10px] text-slate-600">Filiale 4291 - Kassen-ID 04</p>
                <p className="text-[10px] text-slate-600">Datum: {selectedProductForPreview.researchDate} 14:32 Uhr</p>
              </div>

              <div className="py-2 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase">Artikelbeschreibung (Bon-Zeile):</p>
                <div className="flex justify-between font-bold bg-amber-200/70 p-1.5 rounded border border-amber-300">
                  <span>{selectedProductForPreview.rawDescription}</span>
                  <span>{selectedProductForPreview.priceEur.toFixed(2)} EUR</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>ZWISCHENSUMME</span>
                  <span>{selectedProductForPreview.priceEur.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[10px]">
                  <span>MwSt. A 7,0% / B 19%</span>
                  <span>{(selectedProductForPreview.priceEur * 0.19 / 1.19).toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-400">
                  <span>GESAMTBETRAG</span>
                  <span>{selectedProductForPreview.priceEur.toFixed(2)} EUR</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-500">
                Bon-Nr: {selectedProductForPreview.sourceReference}
              </div>
            </div>

            {/* Extracted Meta */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Extracted Brand:</span>
                <span className="font-semibold text-slate-200">{selectedProductForPreview.extractedBrand || '(Blank)'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Size & Unit:</span>
                <span className="font-semibold text-slate-200">{selectedProductForPreview.packageSize} {selectedProductForPreview.packageUnit}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
