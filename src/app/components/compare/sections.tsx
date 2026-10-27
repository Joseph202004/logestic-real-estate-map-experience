import { Link } from 'react-router';
import { ArrowUpRight, Building2, Check, X } from 'lucide-react';
import type { Property } from '../../data/properties';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { CompareGroup } from './rows';

export const COMPARE_FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/* ── Column header: the property each column belongs to (compact, sticky) ── */
export function PropertyColumnHead({
  property,
  rank,
  onRemove,
  onOpen,
}: {
  property: Property;
  rank?: number;
  onRemove: () => void;
  onOpen: () => void;
}) {
  return (
    // Each property gets its own card so the columns read as separate entities.
    <div className="relative h-full flex flex-col bg-white rounded-2xl border border-[#E7E0EC] shadow-[0_1px_3px_rgba(12,68,124,0.06),0_6px_18px_rgba(12,68,124,0.05)] p-2.5">
      <div className="relative rounded-xl overflow-hidden h-[104px] bg-[#E7E0EC] shrink-0">
        <ImageWithFallback src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
        {rank != null && (
          <span
            className="absolute top-2 left-2 min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#21005D] text-white flex items-center justify-center"
            style={{ fontSize: 10, fontWeight: 800 }}
            title={`Column ${rank}`}
          >
            {rank}
          </span>
        )}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm border border-[#E7E0EC] shadow-sm flex items-center justify-center text-[#1D1B20]/45 hover:text-[#B3261E] hover:border-[#B3261E]/30 transition-colors"
          aria-label={`Remove ${property.name} from compare`}
        >
          <X size={11} />
        </button>
      </div>

      <button onClick={onOpen} className="mt-2.5 text-left group w-full flex-1">
        <div className="text-[#21005D] group-hover:text-[#6750A4] transition-colors flex items-center gap-1 leading-tight" style={{ fontSize: 13, fontWeight: 800 }}>
          <span className="truncate">{property.name}</span>
          <ArrowUpRight size={11} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="text-[#1D1B20]/45 mt-0.5 truncate" style={{ fontSize: 11, fontWeight: 500 }}>
          {property.market}, {property.submarket}
        </div>
      </button>

      <div className="flex items-stretch mt-2.5 pt-2.5 border-t border-[#F3EDF7]">
        <HeadStat label="Rent/SF" value={property.rentPsf ? `$${property.rentPsf}` : '—'} accent />
        <HeadStat label="Size" value={`${Math.round(property.sizeSqft / 1000)}K`} />
        <HeadStat label="Clear" value={`${property.clearHeightFt}′`} />
      </div>
    </div>
  );
}

/** One figure in a property card's headline strip. */
function HeadStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex-1 min-w-0 px-2 first:pl-0 last:pr-0 border-l border-[#F3EDF7] first:border-l-0">
      <div className={`truncate ${accent ? 'text-[#2E7D32]' : 'text-[#21005D]'}`} style={{ fontSize: 12.5, fontWeight: 800 }} title={value}>
        {value}
      </div>
      <div className="text-[#1D1B20]/40 mt-0.5 truncate" style={{ fontSize: 9, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

/* ── One grouped panel of rows ── */
export function CompareGroupPanel({
  group,
  properties: list,
}: {
  group: CompareGroup;
  properties: Property[];
}) {
  const columns = `minmax(130px, 170px) repeat(${list.length}, minmax(0, 1fr))`;

  return (
    <section className="bg-white rounded-2xl border border-[#E7E0EC] shadow-[0_1px_3px_rgba(12,68,124,0.05)] overflow-hidden">
      <header className="px-6 pt-5 pb-4 border-b border-[#F3EDF7]">
        <h2 className="text-[#21005D]" style={{ fontSize: 15, fontWeight: 800 }}>{group.title}</h2>
        <p className="text-[#1D1B20]/45 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>{group.blurb}</p>
      </header>

      <div>
        {group.rows.map((row, i) => {
          // Flag the leading cell, but only when the properties actually differ.
          const scores = row.best ? list.map(row.best) : [];
          const valid = scores.filter((s): s is number => s != null);
          const top = valid.length > 1 && new Set(valid).size > 1 ? Math.max(...valid) : null;

          return (
            <div
              key={row.label}
              className={`grid items-center gap-6 px-6 py-3 ${i ? 'border-t border-[#F7F2FA]' : ''} ${i % 2 ? 'bg-[#FCFAFE]' : ''}`}
              style={{ gridTemplateColumns: columns }}
            >
              <div className="text-[#1D1B20]/45" style={{ fontSize: 11.5, fontWeight: 600 }}>
                {row.label}
                {row.hint && (
                  <span className="block text-[#1D1B20]/30" style={{ fontSize: 9.5, fontWeight: 500 }}>{row.hint}</span>
                )}
              </div>

              {list.map((p, col) => {
                const isBest = top != null && scores[col] === top;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-1.5 text-[#21005D] rounded-lg px-2 -mx-2 py-1 ${
                      isBest ? 'bg-[#2E7D32]/8 ring-1 ring-[#2E7D32]/20' : ''
                    }`}
                    style={{ fontSize: 12.5 }}
                  >
                    <span className="min-w-0">{row.render(p)}</span>
                    {isBest && (
                      <span
                        className="shrink-0 inline-flex items-center gap-0.5 px-1.5 h-[16px] rounded-full bg-[#2E7D32] text-white ml-auto"
                        style={{ fontSize: 8.5, fontWeight: 800 }}
                        title="Best of the shortlist"
                      >
                        <Check size={8} /> BEST
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Nothing shortlisted yet ── */
export function CompareEmptyState() {
  return (
    <section className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(12,68,124,0.05)] p-14 text-center">
      <div className="w-12 h-12 rounded-full bg-[#E7E0EC] flex items-center justify-center mx-auto mb-4">
        <Building2 size={20} className="text-[#21005D]" />
      </div>
      <h2 className="text-[#21005D] mb-1" style={{ fontSize: 15, fontWeight: 800 }}>No properties to compare yet</h2>
      <p className="text-[#1D1B20]/45 mb-5" style={{ fontSize: 12, fontWeight: 500 }}>
        Add up to four facilities from the search results to line them up side by side.
      </p>
      <Link
        to="/search"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6750A4] text-white rounded-full hover:bg-[#4F378B] transition-colors shadow-[0_6px_20px_rgba(103,80,164,0.28)]"
        style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.02em' }}
      >
        Browse properties <ArrowUpRight size={14} />
      </Link>
    </section>
  );
}
