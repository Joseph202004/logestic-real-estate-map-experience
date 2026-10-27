import { useState } from 'react';
import { ArrowLeft, Bookmark, Search } from 'lucide-react';
import { Link } from 'react-router';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyDetailModal } from '../components/detail';
import { useApp } from '../context/AppContext';
import { properties } from '../data/properties';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

export function SavedPage() {
  const { savedProperties } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const saved = properties.filter(property => savedProperties.includes(property.id));

  return (
    <div className="min-h-screen bg-[#FEF7FF]" style={{ fontFamily: FONT }}>
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-10">
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-[#1D1B20]/45 hover:text-[#21005D] transition-colors mb-4"
          style={{ fontSize: 11.5, fontWeight: 600 }}
        >
          <ArrowLeft size={13} /> Back to search
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#6750A4] text-white flex items-center justify-center shadow-sm">
                <Bookmark size={17} fill="currentColor" />
              </div>
              <div>
                <h1 className="text-[#21005D]" style={{ fontSize: 24, fontWeight: 800 }}>Saved properties</h1>
                <p className="text-[#1D1B20]/50 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
                  {saved.length === 1 ? '1 property saved for later.' : `${saved.length} properties saved for later.`}
                </p>
              </div>
            </div>
          </div>

          {saved.length > 0 && (
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-xl text-[#6750A4] shadow-sm ring-1 ring-black/5 hover:ring-[#6750A4]/50 transition-all"
              style={{ fontSize: 11.5, fontWeight: 700 }}
            >
              <Search size={14} /> Find more properties
            </Link>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 px-6 py-16 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#6750A4]/10 text-[#6750A4] flex items-center justify-center">
              <Bookmark size={21} />
            </div>
            <h2 className="text-[#21005D]" style={{ fontSize: 18, fontWeight: 800 }}>No saved properties yet</h2>
            <p className="max-w-sm mx-auto mt-2 text-[#1D1B20]/50" style={{ fontSize: 12, fontWeight: 500 }}>
              Save properties while searching to keep your shortlist together here.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 mt-6 px-4 py-2.5 bg-[#6750A4] text-white rounded-full hover:bg-[#4F378B] transition-colors"
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
