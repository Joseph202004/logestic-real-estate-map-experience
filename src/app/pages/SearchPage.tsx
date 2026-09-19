import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Map as MapIcon, List,
  Sun, Plug, Zap, Building2, Snowflake, Truck, GitCompareArrows, ArrowUpRight,
  Bookmark, Clock, Layers, Navigation, Users, Train, MapPin, Wifi, Package,
  CheckSquare, Square, ChevronRight, Sparkles, ArrowRight
} from 'lucide-react';
import { properties, formatSqft, getStatusLabel, getStatusColor, getEssentialsList } from '../data/properties';
import type { Property } from '../data/properties';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { InteractiveMap } from '../components/InteractiveMap';
import { PropertyListCard } from '../components/PropertyListCard';
import { PropertyDetailModal } from '../components/detail';
import { PersonaBar } from '../components/map/PersonaBar';
import { personaFromParam } from '../personas/personas';
import type { Persona } from '../personas/personas';
import { FilterBar, FilterModal, useFilters } from '../components/filters';
import type { CategoryId } from '../components/filters';

const FONT = 'Montserrat, sans-serif';

/* ═══════════════════════════════════════════════════════════════
   MAIN SEARCH PAGE (Split-Screen Logistics Dashboard)
   ═══════════════════════════════════════════════════════════════ */
export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { compareList } = useApp();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id || null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  const [filterOpen, setFilterOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  // The home page hands over a role; it drives layers, copy and match scoring.
  const [persona, setPersona] = useState<Persona>(() =>
    personaFromParam(searchParams.get('role') || searchParams.get('segment') || searchParams.get('type')));
  const [filterCategory, setFilterCategory] = useState<CategoryId>('size');
  const f = useFilters();

  const filtered = useMemo(
    () => properties.filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.market.toLowerCase().includes(query.toLowerCase())) return false;
      return f.matches(p);
    }),
    [query, f.matches]
  );

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col bg-[#F4F3F3]" style={{ fontFamily: FONT }}>

      {/* ─── Sticky Search Bar ─── */}
      <div className="relative bg-white border-b border-[#E6F1FB] px-4 md:px-6 py-3 z-20">
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="flex-1 relative max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#303234]/30" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search market, city, or property name…"
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F3F3] rounded-xl border border-transparent focus:border-[#00C2B2] focus:bg-white focus:outline-none transition-all"
              style={{ fontSize: 13, fontWeight: 500 }}
            />
          </div>

          {/* Results count */}
          <div className="hidden md:flex items-center gap-1.5 text-[#303234]/40" style={{ fontSize: 12, fontWeight: 600 }}>
            <span className="text-[#0C447C]" style={{ fontWeight: 800 }}>{filtered.length}</span> properties found
          </div>

          <div className="h-5 w-px bg-[#E6F1FB] hidden md:block" />

          {/* Compare badge */}
          {compareList.length > 0 && (
            <button
              onClick={() => navigate('/compare')}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#00C2B2]/10 text-[#1B4D4A] rounded-xl hover:bg-[#00C2B2]/15 transition-colors"
              style={{ fontSize: 11, fontWeight: 700 }}
            >
              <GitCompareArrows size={14} />
              Compare ({compareList.length})
              <ArrowRight size={12} />
            </button>
          )}

          {/* Mobile view toggle */}
          <div className="flex md:hidden gap-1 ml-auto">
            <button onClick={() => setMobileView('list')} className={`p-2 rounded-lg ${mobileView === 'list' ? 'bg-[#1B4D4A] text-white' : 'bg-[#F4F3F3] text-[#303234]/40'}`}>
              <List size={16} />
            </button>
            <button onClick={() => setMobileView('map')} className={`p-2 rounded-lg ${mobileView === 'map' ? 'bg-[#1B4D4A] text-white' : 'bg-[#F4F3F3] text-[#303234]/40'}`}>
              <MapIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Split Screen Body ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ════════════════════════════════════════════
            LEFT PANE (40%) — Filters & Property Cards
            ════════════════════════════════════════════ */}
        <div className={`${mobileView === 'map' ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[40%] lg:w-[38%] border-r border-[#E6F1FB] bg-[#F4F3F3] overflow-hidden`}>

          <PersonaBar persona={persona} onChange={setPersona} />

          {/* Filters — summary bar opens the master/detail dialog */}
          <FilterBar
            filters={f}
            onOpen={category => { setFilterCategory(category ?? 'size'); setFilterOpen(true); }}
          />

          {/* ─── Property Cards List ─── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E6F1FB] flex items-center justify-center">
                  <Search size={24} className="text-[#0C447C]/30" />
                </div>
                <p className="text-[#303234]/60 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>No properties match</p>
                <p className="text-[#303234]/40 mb-4" style={{ fontSize: 12 }}>Try adjusting your logistics filters</p>
                <button onClick={f.clearAll} className="px-4 py-2 bg-[#1B4D4A] text-white rounded-xl" style={{ fontSize: 12, fontWeight: 600 }}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              filtered.map(p => (
                <PropertyListCard
                  key={p.id}
                  property={p}
                  persona={persona}
                  isSelected={p.id === selectedPropertyId}
                  onSelect={setSelectedPropertyId}
                  onViewDetails={setDetailId}
                />
              ))
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            RIGHT PANE (60%) — Interactive Leaflet Map
            ════════════════════════════════════════════ */}
        <div className={`${mobileView === 'list' ? 'hidden md:block' : 'block'} flex-1 p-3`}>
          <InteractiveMap
            properties={filtered}
            selectedId={selectedPropertyId}
            onSelectProperty={setSelectedPropertyId}
            persona={persona}
          />
        </div>
      </div>
      {detailId && (
        <PropertyDetailModal
          property={properties.find(p => p.id === detailId)!}
          onClose={() => setDetailId(null)}
        />
      )}

      {filterOpen && (
        <FilterModal
          filters={f}
          resultCount={filtered.length}
          initialCategory={filterCategory}
          onClose={() => setFilterOpen(false)}
        />
      )}

    </div>
  );
}
