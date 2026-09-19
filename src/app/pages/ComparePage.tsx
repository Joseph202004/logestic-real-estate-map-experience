import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Bookmark, Download, Share2 } from 'lucide-react';
import { properties } from '../data/properties';
import { useApp } from '../context/AppContext';
import { PropertyDetailModal } from '../components/detail';
import {
  COMPARE_FONT, CompareEmptyState, CompareGroupPanel, PropertyColumnHead,
} from '../components/compare/sections';
import { compareGroups } from '../components/compare/rows';

export function ComparePage() {
  const { compareList, toggleCompare } = useApp();
  const compared = properties.filter(p => compareList.includes(p.id));
  const [detailId, setDetailId] = useState<string | null>(null);

  const columns = `minmax(130px, 170px) repeat(${compared.length}, minmax(0, 1fr))`;

  return (
    <div className="min-h-screen bg-[#F4F3F3]" style={{ fontFamily: COMPARE_FONT }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8">

        {/* Breadcrumb */}
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-[#303234]/45 hover:text-[#0C447C] transition-colors mb-4"
          style={{ fontSize: 11.5, fontWeight: 600 }}
        >
          <ArrowLeft size={13} /> Back to search
        </Link>

        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[#0C447C]" style={{ fontSize: 24, fontWeight: 800 }}>
              Compare properties
              <span className="text-[#303234]/30 ml-2.5" style={{ fontSize: 14, fontWeight: 500 }}>
                {compared.length} of 4
              </span>
            </h1>
            <p className="text-[#303234]/50 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
              Specification, location, cost and capability lined up side by side.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#303234]/50 hover:bg-white hover:text-[#1B4D4A] transition-all"
              style={{ fontSize: 11.5, fontWeight: 600 }}
            >
              <Download size={13} /> Export
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#303234]/50 hover:bg-white hover:text-[#1B4D4A] transition-all"
              style={{ fontSize: 11.5, fontWeight: 600 }}
            >
              <Share2 size={13} /> Share
            </button>
            <button
              className="ml-2 flex items-center gap-1.5 px-4 py-2.5 bg-[#1B4D4A] text-white rounded-xl hover:bg-[#187770] transition-colors"
              style={{ fontSize: 11.5, fontWeight: 700 }}
            >
              <Bookmark size={13} /> Save shortlist
            </button>
          </div>
        </div>

        {compared.length === 0 ? (
          <CompareEmptyState />
        ) : (
          <>
            {/* One card per shortlisted property */}
            <div className="grid gap-5 mb-6 items-stretch" style={{ gridTemplateColumns: columns }}>
              <div className="hidden md:block" />
              {compared.map(p => (
                <PropertyColumnHead
                  key={p.id}
                  property={p}
                  onRemove={() => toggleCompare(p.id)}
                  onOpen={() => setDetailId(p.id)}
                />
              ))}
            </div>

            {compareGroups.map(group => (
              <CompareGroupPanel key={group.id} group={group} properties={compared} />
            ))}
          </>
        )}
      </div>

      {detailId && (
        <PropertyDetailModal
          property={properties.find(p => p.id === detailId)!}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
