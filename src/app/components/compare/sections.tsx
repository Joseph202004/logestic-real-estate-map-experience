import { Link } from 'react-router';
import { ArrowUpRight, Building2, Check, X } from 'lucide-react';
import type { Property } from '../../data/properties';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { CompareGroup } from './rows';

export const COMPARE_FONT = 'Montserrat, sans-serif';

/* ── Column header: the property each column belongs to ── */
export function PropertyColumnHead({
  property,
  onRemove,
  onOpen,
}: {
  property: Property;
  onRemove: () => void;
  onOpen: () => void;
}) {
  return (
    // Each property gets its own card so the columns read as separate entities.
    <div className="relative h-full flex flex-col bg-white rounded-2xl shadow-[0_1px_3px_rgba(12,68,124,0.06),0_8px_24px_rgba(12,68,124,0.05)] p-4">
      <button
        onClick={onRemove}
        className="absolute top-6 right-6 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-[#E6F1FB] shadow-sm flex items-center justify-center text-[#303234]/45 hover:text-[#B42318] hover:border-[#B42318]/30 transition-colors"
        aria-label={`Remove ${property.name} from compare`}
      >
        <X size={12} />
      </button>

      <div className="rounded-xl overflow-hidden h-[300px] bg-[#E6F1FB]">
        <ImageWithFallback src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
      </div>

      <button
        onClick={onOpen}
        className="mt-4 text-left group w-full flex-1"
      >
        <div className="text-[#0C447C] group-hover:text-[#00C2B2] transition-colors flex items-center gap-1" style={{ fontSize: 15, fontWeight: 800 }}>
          {property.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="text-[#303234]/45 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
          {property.market}, {property.submarket}
        </div>
      </button>

      <div className="flex items-stretch mt-4 pt-4 border-t border-[#F1F6FB]">
        <HeadStat label="Rent / SF" value={property.rentPsf ? `$${property.rentPsf}` : '—'} accent />
        <HeadStat label="Size" value={`${Math.round(property.sizeSqft / 1000)}K SF`} />
        <HeadStat label="Clear ht." value={`${property.clearHeightFt} ft`} />
      </div>
    </div>
  );
}

/** One figure in a property card's headline strip. */
function HeadStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex-1 min-w-0 px-2.5 first:pl-0 last:pr-0 border-l border-[#F1F6FB] first:border-l-0">
      <div className={`truncate ${accent ? 'text-[#00CC66]' : 'text-[#0C447C]'}`} style={{ fontSize: 13.5, fontWeight: 800 }} title={value}>
        {value}
      </div>
      <div className="text-[#303234]/40 mt-0.5 truncate" style={{ fontSize: 9.5, fontWeight: 600 }}>{label}</div>
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
    <section className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(12,68,124,0.05)] overflow-hidden mb-5">
      <header className="px-6 pt-5 pb-4 border-b border-[#F1F6FB]">
        <h2 className="text-[#0C447C]" style={{ fontSize: 15, fontWeight: 800 }}>{group.title}</h2>
        <p className="text-[#303234]/45 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>{group.blurb}</p>
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
              className={`grid items-center gap-6 px-6 py-3.5 ${i ? 'border-t border-[#F6F9FC]' : ''}`}
              style={{ gridTemplateColumns: columns }}
            >
              <div className="text-[#303234]/45" style={{ fontSize: 11.5, fontWeight: 600 }}>
                {row.label}
                {row.hint && (
                  <span className="block text-[#303234]/30" style={{ fontSize: 9.5, fontWeight: 500 }}>{row.hint}</span>
                )}
              </div>

              {list.map((p, col) => {
                const isBest = top != null && scores[col] === top;
                return (
                  <div key={p.id} className="flex items-center gap-1.5 text-[#0C447C]" style={{ fontSize: 12.5 }}>
                    <span className="min-w-0">{row.render(p)}</span>
                    {isBest && (
                      <span
                        className="shrink-0 inline-flex items-center gap-0.5 px-1.5 h-[16px] rounded-full bg-[#00CC66]/10 text-[#00CC66]"
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
      <div className="w-12 h-12 rounded-full bg-[#E6F1FB] flex items-center justify-center mx-auto mb-4">
        <Building2 size={20} className="text-[#0C447C]" />
      </div>
      <h2 className="text-[#0C447C] mb-1" style={{ fontSize: 15, fontWeight: 800 }}>No properties to compare yet</h2>
      <p className="text-[#303234]/45 mb-5" style={{ fontSize: 12, fontWeight: 500 }}>
        Add up to four facilities from the search results to line them up side by side.
      </p>
      <Link
        to="/search"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00CC66] text-white rounded-xl hover:brightness-95 transition-all"
        style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.02em' }}
      >
        BROWSE PROPERTIES <ArrowUpRight size={14} />
      </Link>
    </section>
  );
}
