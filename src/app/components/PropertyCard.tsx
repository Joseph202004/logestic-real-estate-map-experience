import { useEffect, useRef } from 'react';
import {
  ArrowUpRight, Bookmark, CheckSquare, MapPin, Package, Plug, Snowflake, Sparkles, Square, Sun, Zap,
} from 'lucide-react';
import { formatSqft, getStatusLabel } from '../data/properties';
import type { Property } from '../data/properties';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

const FONT = 'Montserrat, sans-serif';

const STATUS_COLOR: Record<Property['availabilityStatus'], string> = {
  available: '#00CC66',
  under_negotiation: '#B26A00',
  coming_soon: '#0C447C',
};

/** One stat in the divided column strip: value over label. */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 first:pl-0 last:pr-0 border-l border-white/15 first:border-l-0 text-center">
      <div className="text-white whitespace-nowrap" style={{ fontSize: 13, fontWeight: 800 }}>{value}</div>
      <div className="text-white/55 whitespace-nowrap" style={{ fontSize: 9, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

/**
 * Listing card: full-bleed photograph with the facility's headline figures
 * laid over a gradient, then a hairline footer for essentials and actions.
 */
export function PropertyCard({
  property,
  isSelected,
  onSelect,
  onViewDetails,
}: {
  property: Property;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onViewDetails: (id: string) => void;
}) {
  const { toggleCompare, toggleSaved, isInCompare, isSaved } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll into view when selected from the map.
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  const essentials: { icon: any; label: string; active: boolean }[] = [
    { icon: Sun, label: 'Solar', active: property.sustainability.solarReady },
    { icon: Plug, label: 'EV', active: property.sustainability.evReady },
    { icon: Zap, label: 'Automation', active: property.essentials.automation },
    { icon: Package, label: 'Racking', active: property.essentials.racking },
    { icon: Snowflake, label: 'Cold', active: property.coldStorageReady },
  ].filter(e => e.active);

  const headline = property.rentPsf ? `$${property.rentPsf}/SF` : 'Pricing on request';

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(property.id)}
      className={`
        group relative rounded-2xl overflow-hidden cursor-pointer bg-[#0A2338]
        transition-all duration-250 hover:-translate-y-0.5
        ${isSelected
          ? 'ring-2 ring-[#00C2B2] shadow-lg shadow-[#00C2B2]/20'
          : 'ring-1 ring-black/5 shadow-sm hover:ring-[#00C2B2]/40 hover:shadow-xl hover:shadow-[#0C2B45]/20'
        }
      `}
      style={{ fontFamily: FONT }}
    >
      {/* Photograph */}
      <div className="relative z-10 h-[260px]">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Gradient carrying the text over the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2338] via-[#0A2338]/85 via-40% to-transparent" />

        {/* Status pill */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1.5 pl-2 pr-2.5 h-[22px] rounded-full bg-white/95 backdrop-blur-sm text-[#0C447C] shadow-sm"
            style={{ fontSize: 10, fontWeight: 700 }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[property.availabilityStatus] }} />
            {getStatusLabel(property.availabilityStatus)}
          </span>
        </div>

        {/* Save + compare */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={e => { e.stopPropagation(); toggleSaved(property.id); }}
            className="w-[26px] h-[26px] rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            aria-label={isSaved(property.id) ? 'Remove from saved' : 'Save property'}
          >
            <Bookmark size={12} className={isSaved(property.id) ? 'text-[#00C2B2] fill-[#00C2B2]' : 'text-[#0C447C]'} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); toggleCompare(property.id); }}
            className={`
              inline-flex items-center gap-1 px-2 h-[26px] rounded-full backdrop-blur-sm transition-colors
              ${isInCompare(property.id) ? 'bg-[#00C2B2] text-white' : 'bg-white/90 text-[#0C447C] hover:bg-white'}
            `}
            style={{ fontSize: 9.5, fontWeight: 700 }}
          >
            {isInCompare(property.id) ? <CheckSquare size={11} /> : <Square size={11} />}
            Compare
          </button>
        </div>

        {/* Headline block */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="text-white mb-2" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>
            {headline}
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-white truncate" style={{ fontSize: 12.5, fontWeight: 700 }}>
                {property.name}
              </div>
              <div className="text-white/60 flex items-center gap-1 truncate" style={{ fontSize: 10.5, fontWeight: 500 }}>
                <MapPin size={10} className="shrink-0" />
                {property.market}, {property.submarket}
              </div>
            </div>

            <div className="flex items-center shrink-0">
              <Stat value={formatSqft(property.sizeSqft).replace(' SF', '')} label="SF" />
              <Stat value={`${property.clearHeightFt}'`} label="Clear" />
              <Stat value={`${property.dockDoors}`} label="Docks" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer: essentials and the way through to the PDP */}
      {/* -mt-px overlaps the photo by a pixel so no hairline can show through */}
      <div className="relative z-10 -mt-px flex items-center gap-2 px-4 pb-3 pt-1 bg-[#0A2338]">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
          {essentials.slice(0, 2).map(e => (
            <span key={e.label} className="inline-flex items-center gap-1 text-white/55 transition-colors group-hover:text-white/75 whitespace-nowrap" style={{ fontSize: 9.5, fontWeight: 600 }}>
              <e.icon size={10} /> {e.label}
            </span>
          ))}
          {essentials.length > 2 && (
            <span className="text-white/35 whitespace-nowrap" style={{ fontSize: 9.5, fontWeight: 600 }}>
              +{essentials.length - 2}
            </span>
          )}
          {property.sustainability.certification && (
            <span className="inline-flex items-center gap-1 text-[#4ADE80] whitespace-nowrap" style={{ fontSize: 9.5, fontWeight: 700 }}>
              <Sparkles size={10} /> {property.sustainability.certification}
            </span>
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); onViewDetails(property.id); }}
          className="shrink-0 inline-flex items-center gap-1 text-white/85 transition-colors group-hover:text-[#00C2B2] hover:!text-[#00C2B2]"
          style={{ fontSize: 10.5, fontWeight: 700, fontFamily: FONT }}
        >
          View Details <ArrowUpRight size={12} />
        </button>
      </div>

      {/* Hover wash spanning the whole card, footer included */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-white/0 transition-colors duration-250 group-hover:bg-white/[0.07]" />
    </div>
  );
}
