import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import {
  Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Map as MapIcon, List,
  Sun, Plug, Zap, Building2, Snowflake, Truck, GitCompareArrows, ArrowUpRight,
  Bookmark, Clock, Layers, Navigation, Users, Train, MapPin, Wifi, Package,
  CheckSquare, Square, ChevronRight, Sparkles, ArrowRight, User,
  Pin, PinOff, PanelLeftClose, PanelLeftOpen
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
import { FilterModal, FilterPanel, useFilters } from '../components/filters';
import type { CategoryId } from '../components/filters';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

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
  // Collapsible filters card — starts collapsed, opened via the toolbar Filters button.
  const [panelsOpen, setPanelsOpen] = useState(false);
  // Right-docked results panel: hover gives a temporary peek, click pins it open.
  const [listingPinned, setListingPinned] = useState(false);
  const [listingPeek, setListingPeek] = useState(true);
  const listingOpen = listingPinned || listingPeek;
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
    <div className="h-screen flex flex-col bg-[#FEF7FF]" style={{ fontFamily: FONT }}>

      {/* ─── Sticky Search Bar ─── */}
      <div className="relative bg-white border-b border-[#E7E0EC] px-4 md:px-6 py-3 z-20">
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="flex-1 relative max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1D1B20]/30" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search market, city, or property name…"
              className="w-full pl-10 pr-4 py-2.5 bg-[#FEF7FF] rounded-xl border border-transparent focus:border-[#6750A4] focus:bg-white focus:outline-none transition-all"
              style={{ fontSize: 13, fontWeight: 500 }}
            />
          </div>

          {/* Results count */}
          <div className="hidden md:flex items-center gap-1.5 text-[#1D1B20]/40" style={{ fontSize: 12, fontWeight: 600 }}>
            <span className="text-[#21005D]" style={{ fontWeight: 800 }}>{filtered.length}</span> properties found
          </div>

          <div className="h-5 w-px bg-[#E7E0EC] hidden md:block" />

          {/* Compare badge */}
          {compareList.length > 0 && (
            <button
              onClick={() => navigate('/compare')}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#6750A4]/10 text-[#6750A4] rounded-xl hover:bg-[#6750A4]/15 transition-colors"
              style={{ fontSize: 11, fontWeight: 700 }}
            >
              <GitCompareArrows size={14} />
              Compare ({compareList.length})
              <ArrowRight size={12} />
            </button>
          )}

          {/* Mobile view toggle */}
          <div className="flex md:hidden gap-1 ml-auto">
            <button onClick={() => setMobileView('list')} className={`p-2 rounded-lg ${mobileView === 'list' ? 'bg-[#6750A4] text-white' : 'bg-[#FEF7FF] text-[#1D1B20]/40'}`}>
              <List size={16} />
            </button>
            <button onClick={() => setMobileView('map')} className={`p-2 rounded-lg ${mobileView === 'map' ? 'bg-[#6750A4] text-white' : 'bg-[#FEF7FF] text-[#1D1B20]/40'}`}>
              <MapIcon size={16} />
            </button>
          </div>

          {/* Sign in — relocated here from the removed top nav */}
          <button
            onClick={() => navigate('/signin')}
            className="ml-auto shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[#6750A4] text-white rounded-full hover:bg-[#4F378B] transition-colors"
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            <User size={14} /> Sign In
          </button>
        </div>
      </div>

      {/* ─── Filters (collapsible) · Map · Results (right, auto-hide) ─── */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2 relative">

        {/* Filters toggle + card — hovering the group opens it, leaving closes it */}
        <div
          className="hidden md:flex items-stretch gap-2 shrink-0"
          onMouseEnter={() => setPanelsOpen(true)}
          onMouseLeave={() => setPanelsOpen(false)}
        >
          {/* Single toggle button, docked next to the side rail */}
          <div className="flex items-center">
            <button
              onClick={() => setPanelsOpen(o => !o)}
              className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-[0_4px_14px_rgba(29,27,32,0.16)] transition-colors ${
                panelsOpen
                  ? 'bg-[#6750A4] border-[#6750A4] text-white hover:bg-[#4F378B]'
                  : 'bg-white border-[#E7E0EC] text-[#6750A4] hover:bg-[#F3EDF7]'
              }`}
              aria-label={panelsOpen ? 'Hide filters' : 'Show filters'}
              title={panelsOpen ? 'Hide filters' : 'Show filters'}
            >
              {panelsOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
            </button>
          </div>

          {/* Filters card — slides open beside the toggle, leaving results in place */}
          <aside
            className={`flex flex-col rounded-3xl bg-white border border-[#E7E0EC] shadow-sm overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.05,0.7,0.1,1)] ${panelsOpen ? 'w-[264px]' : 'w-0 border-0'}`}
          >
            <PersonaBar persona={persona} onChange={setPersona} />
            <div className="p-4 overflow-y-auto">
              <FilterPanel filters={f} />
            </div>
          </aside>
        </div>

        {/* Map — fills the middle; interacting with it hides the results panel */}
        <div
          className={`${mobileView === 'list' ? 'hidden md:block' : 'block'} flex-1 min-w-0 relative`}
          onMouseEnter={() => setListingPeek(false)}
          onMouseDown={() => { setListingPeek(false); setListingPinned(false); }}
        >
          <InteractiveMap
            properties={filtered}
            selectedId={selectedPropertyId}
            onSelectProperty={setSelectedPropertyId}
            persona={persona}
          />
        </div>

        {/* Results card — docked on the right, auto-hides over the map, returns on hover */}
        <aside
          onMouseEnter={() => setListingPeek(true)}
          className={`${mobileView === 'map' ? 'hidden md:flex' : 'flex'} flex-col w-full shrink-0 rounded-3xl bg-white border border-[#E7E0EC] shadow-sm overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.05,0.7,0.1,1)] ${listingOpen ? 'md:w-[320px]' : 'md:w-0 md:border-0'}`}
        >
          <div className="px-4 py-3 border-b border-[#E7E0EC] flex items-center justify-between gap-2 shrink-0">
            <span className="text-[#21005D]" style={{ fontSize: 13, fontWeight: 700 }}>
              {filtered.length} Results
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#1D1B20]/45" style={{ fontSize: 11, fontWeight: 500 }}>Best match first</span>
              <button
                onClick={() => setListingPinned(p => !p)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  listingPinned ? 'bg-[#E8DEF8] text-[#6750A4]' : 'text-[#1D1B20]/40 hover:bg-[#F3EDF7] hover:text-[#6750A4]'
                }`}
                aria-pressed={listingPinned}
                aria-label={listingPinned ? 'Unpin results panel' : 'Pin results panel open'}
                title={listingPinned ? 'Unpin — panel will auto-hide over the map' : 'Pin panel open'}
              >
                {listingPinned ? <Pin size={14} /> : <PinOff size={14} />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E7E0EC] flex items-center justify-center">
                  <Search size={24} className="text-[#21005D]/30" />
                </div>
                <p className="text-[#1D1B20]/60 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>No properties match</p>
                <p className="text-[#1D1B20]/40 mb-4" style={{ fontSize: 12 }}>Try adjusting your logistics filters</p>
                <button onClick={f.clearAll} className="px-4 py-2 bg-[#6750A4] text-white rounded-full" style={{ fontSize: 12, fontWeight: 600 }}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 content-start">
                {filtered.map(p => (
                  <PropertyListCard
                    key={p.id}
                    property={p}
                    persona={persona}
                    isSelected={p.id === selectedPropertyId}
                    onSelect={setSelectedPropertyId}
                    onViewDetails={setDetailId}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right-edge strip — hover peeks the results panel, click pins it open */}
        {!listingOpen && (
          <button
            onMouseEnter={() => setListingPeek(true)}
            onClick={() => setListingPinned(true)}
            className="hidden md:flex items-center justify-center absolute top-0 right-0 h-full w-5 z-[560] cursor-pointer group"
            aria-label="Show results panel"
            title="Hover to peek · click to pin open"
          >
            <span className="w-1 h-16 rounded-full bg-[#6750A4]/30 group-hover:bg-[#6750A4]/60 transition-colors" />
          </button>
        )}
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
