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

const FONT = 'Montserrat, sans-serif';

/* ═══════════════════════════════════════════════════════════════
   Property Result Card (redesigned for dashboard)
   ═══════════════════════════════════════════════════════════════ */
function DashboardPropertyCard({
  property,
  isSelected,
  onSelect,
}: {
  property: Property;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const { toggleCompare, toggleSaved, isInCompare, isSaved } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll into view when selected via map click
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  const essentialBadges: { icon: any; label: string; active: boolean }[] = [
    { icon: Sun, label: 'Solar', active: property.sustainability.solarReady },
    { icon: Plug, label: 'EV Ready', active: property.sustainability.evReady },
    { icon: Zap, label: 'Automation', active: property.essentials.automation },
    { icon: Package, label: 'Racking', active: property.essentials.racking },
    { icon: Snowflake, label: 'Cold', active: property.coldStorageReady },
  ];

  const activeBadges = essentialBadges.filter(b => b.active);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(property.id)}
      className={`
        bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-250
        ${isSelected
          ? 'border-[#00C2B2] shadow-lg shadow-[#00C2B2]/10 ring-1 ring-[#00C2B2]/20'
          : 'border-transparent shadow-sm hover:shadow-md hover:border-[#E6F1FB]'
        }
      `}
      style={{ fontFamily: FONT }}
    >
      <div className="flex gap-0">
        {/* Thumbnail */}
        <div className="relative w-[140px] shrink-0 overflow-hidden">
          <ImageWithFallback
            src={property.images[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          {/* Availability pill */}
          <div className="absolute top-2 left-2">
            <span
              className={`
                inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                ${property.availabilityStatus === 'available'
                  ? 'bg-[#00CC66] text-white'
                  : property.availabilityStatus === 'under_negotiation'
                  ? 'bg-[#B26A00] text-white'
                  : 'bg-[#0C447C] text-white'}
              `}
              style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.02em' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              {getStatusLabel(property.availabilityStatus)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="min-w-0">
              <h3 className="text-[#0C447C] truncate" style={{ fontSize: 14, fontWeight: 700 }}>
                {property.name}
              </h3>
              <p className="text-[#303234]/50 flex items-center gap-1" style={{ fontSize: 11, fontWeight: 500 }}>
                <MapPin size={10} />
                {property.market}, {property.submarket}
              </p>
            </div>
            {/* Compare checkbox */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleCompare(property.id); }}
              className={`
                shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg border transition-all
                ${isInCompare(property.id)
                  ? 'bg-[#00C2B2]/10 border-[#00C2B2]/30 text-[#1B4D4A]'
                  : 'border-[#E6F1FB] text-[#303234]/40 hover:border-[#00C2B2]/30 hover:text-[#1B4D4A]'
                }
              `}
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              {isInCompare(property.id)
                ? <CheckSquare size={12} className="text-[#00C2B2]" />
                : <Square size={12} />
              }
              Compare
            </button>
          </div>

          {/* Key specs — bold data */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2.5">
            <span className="text-[#0C447C]" style={{ fontSize: 13, fontWeight: 800 }}>
              {property.sizeSqft.toLocaleString()} <span className="text-[#303234]/40" style={{ fontSize: 10, fontWeight: 600 }}>SF</span>
            </span>
            <span className="text-[#0C447C]" style={{ fontSize: 13, fontWeight: 800 }}>
              {property.clearHeightFt}' <span className="text-[#303234]/40" style={{ fontSize: 10, fontWeight: 600 }}>Clear</span>
            </span>
            <span className="text-[#0C447C]" style={{ fontSize: 13, fontWeight: 800 }}>
              {property.dockDoors} <span className="text-[#303234]/40" style={{ fontSize: 10, fontWeight: 600 }}>Docks</span>
            </span>
            {property.powerCapacityAmps && (
              <span className="text-[#0C447C] flex items-center gap-0.5" style={{ fontSize: 13, fontWeight: 800 }}>
                <Zap size={11} className="text-[#B26A00]" />
                {property.powerCapacityAmps.toLocaleString()} <span className="text-[#303234]/40" style={{ fontSize: 10, fontWeight: 600 }}>A</span>
              </span>
            )}
          </div>

          {/* Essentials badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activeBadges.map(b => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E6F1FB] text-[#0C447C] rounded-full"
                style={{ fontSize: 9, fontWeight: 700 }}
              >
                <b.icon size={10} /> {b.label}
              </span>
            ))}
            {property.sustainability.certification && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00CC66]/10 text-[#00CC66] rounded-full"
                style={{ fontSize: 9, fontWeight: 700 }}
              >
                <Sparkles size={10} /> {property.sustainability.certification}
              </span>
            )}
          </div>

          {/* Action row */}
          <div className="flex items-center gap-2">
            <Link
              to={`/property/${property.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#1B4D4A] text-white rounded-xl hover:bg-[#187770] transition-colors"
              style={{ fontSize: 11, fontWeight: 700 }}
            >
              View Details <ArrowUpRight size={12} />
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSaved(property.id); }}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved(property.id) ? 'bg-[#1B4D4A] border-[#1B4D4A] text-white' : 'border-[#E6F1FB] text-[#303234]/30 hover:text-[#1B4D4A] hover:border-[#1B4D4A]/20'
              }`}
            >
              <Bookmark size={13} />
            </button>
            {property.rentPsf && (
              <span className="ml-auto text-[#00CC66]" style={{ fontSize: 12, fontWeight: 800 }}>
                ${property.rentPsf}/SF
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   Filter Slider Component
   ═══════════════════════════════════════════════════════════════ */
function FilterSlider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
  icon: Icon,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  icon: any;
}) {
  return (
    <div className="flex-1 min-w-[140px]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-1 text-[#303234]/60" style={{ fontSize: 10, fontWeight: 600 }}>
          <Icon size={11} className="text-[#1B4D4A]" />
          {label}
        </span>
        <span className="text-[#0C447C]" style={{ fontSize: 11, fontWeight: 800 }}>
          {value > min ? `${value.toLocaleString()}${unit}+` : 'Any'}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full h-1.5 bg-[#E6F1FB] rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-[#1B4D4A] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:hover:bg-[#187770] [&::-webkit-slider-thumb]:transition-colors"
      />
    </div>
  );
}


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

  // Filters
  const [minClearHeight, setMinClearHeight] = useState(0);
  const [minDockDoors, setMinDockDoors] = useState(0);
  const [minPower, setMinPower] = useState(0);
  const [coldStorage, setColdStorage] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.market.toLowerCase().includes(query.toLowerCase())) return false;
      if (p.clearHeightFt < minClearHeight) return false;
      if (p.dockDoors < minDockDoors) return false;
      if (minPower > 0 && (p.powerCapacityAmps || 0) < minPower) return false;
      if (coldStorage && !p.coldStorageReady) return false;
      return true;
    });
  }, [query, minClearHeight, minDockDoors, minPower, coldStorage]);

  const hasActiveFilters = minClearHeight > 0 || minDockDoors > 0 || minPower > 0 || coldStorage;

  const clearAllFilters = () => {
    setMinClearHeight(0);
    setMinDockDoors(0);
    setMinPower(0);
    setColdStorage(false);
  };

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col bg-[#F4F3F3]" style={{ fontFamily: FONT }}>

      {/* ─── Sticky Search Bar ─── */}
      <div className="bg-white border-b border-[#E6F1FB] px-4 md:px-6 py-3 z-20">
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

          {/* Pre-filtered banner */}
          <div className="px-4 py-2.5 bg-[#E6F1FB] border-b border-[#00C2B2]/10 flex items-center gap-2">
            <Sparkles size={13} className="text-[#00C2B2]" />
            <span className="text-[#0C447C]" style={{ fontSize: 11, fontWeight: 600 }}>Pre-filtered based on your profile</span>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="ml-auto text-[#B42318] hover:underline" style={{ fontSize: 10, fontWeight: 600 }}>
                Clear filters
              </button>
            )}
          </div>

          {/* Filter sliders */}
          <div className="px-4 py-4 bg-white border-b border-[#E6F1FB]">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between mb-3"
            >
              <span className="flex items-center gap-1.5 text-[#0C447C]" style={{ fontSize: 12, fontWeight: 700 }}>
                <SlidersHorizontal size={13} /> Logistics Filters
              </span>
              {showFilters ? <ChevronUp size={14} className="text-[#303234]/40" /> : <ChevronDown size={14} className="text-[#303234]/40" />}
            </button>

            {showFilters && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <FilterSlider
                    label="Clear Height"
                    unit="'"
                    min={0} max={44} step={2}
                    value={minClearHeight}
                    onChange={setMinClearHeight}
                    icon={ArrowUpRight}
                  />
                  <FilterSlider
                    label="Dock Doors"
                    unit=""
                    min={0} max={100} step={5}
                    value={minDockDoors}
                    onChange={setMinDockDoors}
                    icon={Truck}
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <FilterSlider
                    label="Power"
                    unit="A"
                    min={0} max={10000} step={1000}
                    value={minPower}
                    onChange={setMinPower}
                    icon={Zap}
                  />
                  <div className="flex-1 min-w-[140px] flex items-end">
                    <button
                      onClick={() => setColdStorage(!coldStorage)}
                      className={`
                        w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all
                        ${coldStorage
                          ? 'bg-[#00C2B2]/10 border-[#00C2B2] text-[#1B4D4A]'
                          : 'border-[#E6F1FB] text-[#303234]/40 hover:border-[#00C2B2]/30 hover:text-[#303234]/60'
                        }
                      `}
                      style={{ fontSize: 11, fontWeight: 700 }}
                    >
                      <Snowflake size={14} className={coldStorage ? 'text-[#00C2B2]' : ''} />
                      Cold Storage
                      <span className={`
                        w-8 h-[18px] rounded-full flex items-center px-0.5 transition-colors
                        ${coldStorage ? 'bg-[#00C2B2] justify-end' : 'bg-[#E6F1FB] justify-start'}
                      `}>
                        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Active filter chips */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {minClearHeight > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E6F1FB] text-[#0C447C] rounded-full" style={{ fontSize: 10, fontWeight: 700 }}>
                        {minClearHeight}'+ Clear Height
                        <button onClick={() => setMinClearHeight(0)}><X size={10} /></button>
                      </span>
                    )}
                    {minDockDoors > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E6F1FB] text-[#0C447C] rounded-full" style={{ fontSize: 10, fontWeight: 700 }}>
                        {minDockDoors}+ Docks
                        <button onClick={() => setMinDockDoors(0)}><X size={10} /></button>
                      </span>
                    )}
                    {minPower > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E6F1FB] text-[#0C447C] rounded-full" style={{ fontSize: 10, fontWeight: 700 }}>
                        {minPower.toLocaleString()}A+ Power
                        <button onClick={() => setMinPower(0)}><X size={10} /></button>
                      </span>
                    )}
                    {coldStorage && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E6F1FB] text-[#0C447C] rounded-full" style={{ fontSize: 10, fontWeight: 700 }}>
                        Cold Storage
                        <button onClick={() => setColdStorage(false)}><X size={10} /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── Property Cards List ─── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E6F1FB] flex items-center justify-center">
                  <Search size={24} className="text-[#0C447C]/30" />
                </div>
                <p className="text-[#303234]/60 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>No properties match</p>
                <p className="text-[#303234]/40 mb-4" style={{ fontSize: 12 }}>Try adjusting your logistics filters</p>
                <button onClick={clearAllFilters} className="px-4 py-2 bg-[#1B4D4A] text-white rounded-xl" style={{ fontSize: 12, fontWeight: 600 }}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              filtered.map(p => (
                <DashboardPropertyCard
                  key={p.id}
                  property={p}
                  isSelected={p.id === selectedPropertyId}
                  onSelect={setSelectedPropertyId}
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
          />
        </div>
      </div>
    </div>
  );
}
