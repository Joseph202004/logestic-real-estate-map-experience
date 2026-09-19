import { useEffect, useRef } from 'react';
import {
  ArrowUpRight, Bookmark, GitCompareArrows, MapPin, MoreVertical, Truck,
} from 'lucide-react';
import { getStatusLabel } from '../data/properties';
import type { Property } from '../data/properties';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { matchScore } from '../personas/personas';
import type { Persona } from '../personas/personas';

const FONT = 'Montserrat, sans-serif';

const STATUS_STYLE: Record<Property['availabilityStatus'], string> = {
  available: 'bg-[#00CC66]/12 text-[#00994D]',
  under_negotiation: 'bg-[#B26A00]/12 text-[#B26A00]',
  coming_soon: 'bg-[#0C447C]/10 text-[#0C447C]',
};

/**
 * Compact consignment-style row used in the results column: reference number,
 * status pill, an origin→destination rail, then the figures and actions.
 */
export function PropertyListCard({
  property,
  persona,
  isSelected,
  onSelect,
  onViewDetails,
}: {
  property: Property;
  persona: Persona;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onViewDetails: (id: string) => void;
}) {
  const { toggleCompare, toggleSaved, isInCompare, isSaved } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);
  const score = matchScore(persona, property);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(property.id)}
      className={`
        bg-white rounded-2xl border cursor-pointer transition-all
        ${isSelected
          ? 'border-[#00C2B2] shadow-[0_0_0_3px_rgba(0,194,178,0.12)]'
          : 'border-[#E6F1FB] hover:border-[#00C2B2]/40'
        }
      `}
      style={{ fontFamily: FONT }}
    >
      {/* Reference line */}
      <div className="flex items-center gap-2 px-3.5 pt-3">
        <span className="w-7 h-7 rounded-lg bg-[#F4F8FC] flex items-center justify-center shrink-0">
          <Truck size={13} className="text-[#0C447C]" />
        </span>
        <span className="text-[#0C447C] truncate" style={{ fontSize: 12.5, fontWeight: 800 }}>
          {property.name}
        </span>
        <span
          className={`ml-auto shrink-0 px-2 py-0.5 rounded-md ${STATUS_STYLE[property.availabilityStatus]}`}
          style={{ fontSize: 9.5, fontWeight: 700 }}
        >
          {getStatusLabel(property.availabilityStatus)}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onViewDetails(property.id); }}
          className="shrink-0 text-[#303234]/30 hover:text-[#0C447C] transition-colors"
          aria-label={`Open ${property.name}`}
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Origin → corridor rail */}
      <div className="px-3.5 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00CC66] shrink-0" />
          <span className="flex-1 h-px bg-gradient-to-r from-[#00CC66]/50 to-[#E6F1FB]" />
          <Truck size={12} className="text-[#0C447C]/50 shrink-0" />
          <span className="flex-1 h-px bg-[#E6F1FB]" />
          <span className="w-2 h-2 rounded-full bg-[#0C447C]/30 shrink-0" />
        </div>

        <div className="flex items-start justify-between gap-3 mt-1.5">
          <div className="min-w-0">
            <div className="text-[#303234]/70 flex items-center gap-1 truncate" style={{ fontSize: 10.5, fontWeight: 600 }}>
              <MapPin size={9} className="shrink-0" />
              {property.market}
            </div>
            <div className="text-[#303234]/40 truncate" style={{ fontSize: 10 }}>{property.submarket}</div>
          </div>
          <div className="min-w-0 text-right">
            <div className="text-[#303234]/70 truncate" style={{ fontSize: 10.5, fontWeight: 600 }}>
              {property.locationSignals.highwayAccess}
            </div>
            <div className="text-[#303234]/40 truncate" style={{ fontSize: 10 }}>
              {property.locationSignals.sameDayReach} reach
            </div>
          </div>
        </div>
      </div>

      {/* Figures */}
      <div className="flex items-stretch mx-3.5 mt-3 rounded-xl bg-[#F8FBFE] overflow-hidden">
        {[
          { v: property.rentPsf ? `$${property.rentPsf}` : '—', l: 'Rent / SF', accent: true },
          { v: `${Math.round(property.sizeSqft / 1000)}K`, l: 'SF' },
          { v: `${property.clearHeightFt}'`, l: 'Clear' },
          { v: `${property.dockDoors}`, l: 'Docks' },
        ].map(s => (
          <div key={s.l} className="flex-1 min-w-0 px-2 py-2 text-center border-l border-white first:border-l-0">
            <div className={s.accent ? 'text-[#00994D]' : 'text-[#0C447C]'} style={{ fontSize: 12, fontWeight: 800 }}>{s.v}</div>
            <div className="text-[#303234]/40 truncate" style={{ fontSize: 9, fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Thumbnail, match and actions */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#E6F1FB] shrink-0">
          <ImageWithFallback src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[#0C447C]" style={{ fontSize: 11, fontWeight: 700 }}>{score}% profile match</div>
          <div className="h-1 mt-1 rounded-full bg-[#E6F1FB] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${score}%`, background: score >= 75 ? '#00CC66' : score >= 50 ? '#B26A00' : '#B42318' }}
            />
          </div>
        </div>

        <button
          onClick={e => { e.stopPropagation(); toggleSaved(property.id); }}
          className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
            isSaved(property.id) ? 'border-[#00C2B2] text-[#00C2B2]' : 'border-[#E6F1FB] text-[#303234]/40 hover:border-[#00C2B2]/40'
          }`}
          aria-label={isSaved(property.id) ? 'Remove from saved' : 'Save property'}
        >
          <Bookmark size={12} className={isSaved(property.id) ? 'fill-[#00C2B2]' : ''} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); toggleCompare(property.id); }}
          className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
            isInCompare(property.id) ? 'border-[#00C2B2] bg-[#00C2B2]/10 text-[#1B4D4A]' : 'border-[#E6F1FB] text-[#303234]/40 hover:border-[#00C2B2]/40'
          }`}
          aria-label={isInCompare(property.id) ? 'Remove from compare' : 'Add to compare'}
        >
          <GitCompareArrows size={12} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onViewDetails(property.id); }}
          className="shrink-0 inline-flex items-center gap-1 px-2.5 h-7 rounded-lg bg-[#1B4D4A] text-white hover:bg-[#187770] transition-colors"
          style={{ fontSize: 10.5, fontWeight: 700 }}
        >
          Details <ArrowUpRight size={11} />
        </button>
      </div>
    </div>
  );
}
