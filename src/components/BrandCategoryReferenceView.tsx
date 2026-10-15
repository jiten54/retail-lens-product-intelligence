import React, { useState } from 'react';
import { REFERENCE_BRANDS } from '../data/retailDatabase';
import { Search, Tags, Building2, Check, ShieldCheck } from 'lucide-react';

export const BrandCategoryReferenceView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = Array.from(new Set(REFERENCE_BRANDS.map(b => b.category))).sort();

  const filteredBrands = REFERENCE_BRANDS.filter(b => {
    const matchSearch =
      searchTerm === '' ||
      b.brandId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.approvedBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.parentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.aliases.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCat = selectedCategory === 'ALL' || b.category === selectedCategory;

    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Tags className="w-5 h-5 text-teal-400" />
              <span>4. Brand & Category Reference Master Table (Taxonomy)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-teal-800/40">
                {REFERENCE_BRANDS.length} Approved Master Brands
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Source of truth for XLOOKUP lookups, parent corporation hierarchy, canonical package units, and German receipt OCR alias resolution.
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search brand, parent company, OCR alias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-1.5 w-72 focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-mono ml-auto">
            Showing <span className="font-semibold text-white">{filteredBrands.length}</span> Master Brands
          </span>
        </div>
      </div>

      {/* Reference Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-20">Brand ID</th>
                <th className="py-3 px-3">Approved Brand Name</th>
                <th className="py-3 px-3">Parent Corporation</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Subcategory</th>
                <th className="py-3 px-3">Standard Naming Convention</th>
                <th className="py-3 px-3">Valid Units</th>
                <th className="py-3 px-3">Known OCR Aliases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredBrands.map((b, idx) => (
                <tr key={b.brandId} className={`hover:bg-slate-800/40 transition ${idx % 2 === 1 ? 'bg-slate-900/40' : ''}`}>
                  <td className="py-2.5 px-3 font-mono text-slate-400 font-medium">{b.brandId}</td>
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>{b.approvedBrand}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-medium">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      {b.parentCompany}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{b.subcategory}</td>
                  <td className="py-2.5 px-3 font-mono text-teal-300 text-[11px]">{b.namingConvention}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {b.validUnits.map(u => (
                        <span key={u} className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                          {u}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {b.aliases.map(a => (
                        <span key={a} className="px-1.5 py-0.2 rounded bg-slate-950 text-amber-300/90 font-mono text-[10px] border border-slate-800">
                          {a}
                        </span>
                      ))}
                    </div>
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
