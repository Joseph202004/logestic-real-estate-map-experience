import { useEffect, useRef } from 'react';
import { ArrowUpRight, GitCompareArrows, Heart, Star } from 'lucide-react';
import { getStatusLabel } from '../data/properties';
import type { Property } from '../data/properties';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { matchScore } from '../personas/personas';
import type { Persona } from '../personas/personas';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

const STATUS_COLOR: Record<Property['availabilityStatus'], string> = {
  available: '#146C2E',
  under_negotiation: '#8C5000',
  coming_soon: '#21005D',
};

/**
 * Listing card in the reference's photo-first style: a large image with a save
 * heart, then title + rating, spec line, availability and price. Kept on the M3
 * design system (Google Sans, M3 color roles, pill actions, tonal chips).
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
  const saved = isSaved(property.id);
  const availableFrom = new Date(property.availableFrom).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

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
        group bg-white rounded-[20px] border p-2.5 cursor-pointer transition-all
        ${isSelected
          ? 'border-[#6750A4] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_10px_28px_rgba(103,80,164,0.14)]'
          : 'border-[#E7E0EC] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:border-[#CAC4D0]'
        }
      `}
      style={{ fontFamily: FONT }}
    >
      {/* Photo */}
      <div className="relative rounded-2xl overflow-hidden bg-[#E8DEF8] aspect-[4/3]">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Status chip */}
        <span
          className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 pl-2 pr-2.5 h-[24px] rounded-full bg-white/95 backdrop-blur-sm"
          style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLOR[property.availabilityStatus] }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[property.availabilityStatus] }} />
          {getStatusLabel(property.availabilityStatus)}
        </span>

        {/* Save heart */}
        <button
          onClick={e => { e.stopPropagation(); toggleSaved(property.id); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          aria-label={saved ? 'Remove from saved' : 'Save property'}
        >
          <Heart size={15} className={saved ? 'fill-[#6750A4] text-[#6750A4]' : 'text-[#1D1B20]/60'} />
        </button>
      </div>

      {/* Content */}
      <div className="px-1.5 pt-3 pb-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[#21005D] truncate" style={{ fontSize: 14, fontWeight: 700 }}>{property.name}</h3>
          <span className="shrink-0 inline-flex items-center gap-0.5 text-[#1D1B20]/80" style={{ fontSize: 12, fontWeight: 600 }}>
            <Star size={11} className="fill-[#6750A4] text-[#6750A4]" /> {(score / 20).toFixed(1)}
          </span>
        </div>

        <div className="text-[#1D1B20]/50 truncate mt-0.5" style={{ fontSize: 12 }}>
          {property.market}, {property.submarket}
        </div>
        <div className="text-[#1D1B20]/50 truncate" style={{ fontSize: 12 }}>
          {Math.round(property.sizeSqft / 1000)}K SF · {property.clearHeightFt}′ clear · {property.dockDoors} docks
        </div>
        <div className="text-[#1D1B20]/50 truncate" style={{ fontSize: 12 }}>
          Available {availableFrom}
        </div>

        <div className="flex items-end justify-between gap-2 mt-2">
          <div className="min-w-0">
            <span className="text-[#21005D]" style={{ fontSize: 15, fontWeight: 800 }}>
              {property.rentPsf ? `$${property.rentPsf}` : 'On request'}
            </span>
            {property.rentPsf && <span className="text-[#1D1B20]/50" style={{ fontSize: 12, fontWeight: 500 }}> /SF</span>}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={e => { e.stopPropagation(); toggleCompare(property.id); }}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                isInCompare(property.id) ? 'bg-[#E8DEF8] border-[#6750A4] text-[#21005D]' : 'border-[#CAC4D0] text-[#1D1B20]/45 hover:border-[#6750A4]/50'
              }`}
              aria-label={isInCompare(property.id) ? 'Remove from compare' : 'Add to compare'}
            >
              <GitCompareArrows size={13} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onViewDetails(property.id); }}
              className="inline-flex items-center gap-1 px-3 h-8 rounded-full bg-[#6750A4] text-white hover:bg-[#4F378B] transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              Details <ArrowUpRight size={12} />
            </button>
          </div>
        </div>

        {/* Match chip */}
        <span className="inline-flex items-center px-2.5 py-1 mt-2.5 rounded-full bg-[#E8DEF8] text-[#21005D]" style={{ fontSize: 10.5, fontWeight: 600 }}>
          {score}% profile match
        </span>
      </div>
    </div>
  );
}
