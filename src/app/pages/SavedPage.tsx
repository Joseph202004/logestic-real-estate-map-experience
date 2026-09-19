import { useState } from 'react';
import { ArrowLeft, Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyDetailModal } from '../components/detail';
import { useApp } from '../context/AppContext';
import { properties } from '../data/properties';

const FONT = 'Montserrat, sans-serif';

export function SavedPage() {
  const { savedProperties } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const saved = properties.filter(property => savedProperties.includes(property.id));

  return (
    <div className="min-h-screen bg-[#F4F3F3]" style={{ fontFamily: FONT }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-10">
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-[#303234]/45 hover:text-[#0C447C] transition-colors mb-4"
          style={{ fontSize: 11.5, fontWeight: 600 }}
        >
          <ArrowLeft size={13} /> Back to search
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1B4D4A] text-white flex items-center justify-center shadow-sm">
                <Bookmark size={17} fill="currentColor" />
              </div>
              <div>
                <h1 className="text-[#0C447C]" style={{ fontSize: 24, fontWeight: 800 }}>Saved properties</h1>
                <p className="text-[#303234]/50 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
                  {saved.length === 1 ? '1 property saved for later.' : `${saved.length} properties saved for later.`}
                </p>
              </div>
            </div>
          </div>

          {saved.length > 0 && (
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-xl text-[#1B4D4A] shadow-sm ring-1 ring-black/5 hover:ring-[#00C2B2]/50 transition-all"
              style={{ fontSize: 11.5, fontWeight: 700 }}
            >
              <Search size={14} /> Find more properties
            </Link>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 px-6 py-16 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#1B4D4A]/10 text-[#1B4D4A] flex items-center justify-center">
              <Bookmark size={21} />
            </div>
            <h2 className="text-[#0C447C]" style={{ fontSize: 18, fontWeight: 800 }}>No saved properties yet</h2>
            <p className="max-w-sm mx-auto mt-2 text-[#303234]/50" style={{ fontSize: 12, fontWeight: 500 }}>
              Save properties while searching to keep your shortlist together here.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 mt-6 px-4 py-2.5 bg-[#1B4D4A] text-white rounded-xl hover:bg-[#187770] transition-colors"
              style={{ fontSize: 11.5, fontWeight: 700 }}
            >
              <Search size={14} /> Browse properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {saved.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                isSelected={selectedId === property.id}
                onSelect={setSelectedId}
                onViewDetails={setDetailId}
              />
            ))}
          </div>
        )}
      </div>

      {detailId && (
        <PropertyDetailModal
          property={properties.find(property => property.id === detailId)!}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
