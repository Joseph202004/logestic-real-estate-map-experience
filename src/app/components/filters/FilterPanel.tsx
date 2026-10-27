import { ArrowUpRight, Building2, Truck, X, Zap } from 'lucide-react';
import { FilterSlider, OptionRow } from './controls';
import { featureDefs, formatSqftShort, leaseTermDefs, possessionDefs } from './definitions';
import type { UseFilters } from './useFilters';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[#21005D] mb-2.5" style={{ fontSize: 12, fontWeight: 700 }}>{title}</div>
      {children}
    </div>
  );
}

/**
 * Inline filter controls for the left column (reference: the expanded filter
 * panel). Reuses the filter definitions/controls and the shared useFilters
 * state, so it stays in sync with the dialog. Sections reveal on mount.
 */
export function FilterPanel({ filters: f, onClose }: { filters: UseFilters; onClose?: () => void }) {
  return (
    <div style={{ fontFamily: FONT }}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-[#21005D]" style={{ fontSize: 14, fontWeight: 800 }}>Filters</span>
        <div className="flex items-center gap-1.5">
          {f.activeCount > 0 && (
            <button
              onClick={f.clearAll}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8DEF8] text-[#21005D] hover:bg-[#D8C9F0] transition-colors"
              style={{ fontSize: 10.5, fontWeight: 700 }}
            >
              {f.activeCount} · Clear <X size={10} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#1D1B20]/40 hover:bg-[#F3EDF7] hover:text-[#6750A4] transition-colors"
              aria-label="Close filters"
              title="Close filters"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="md-reveal space-y-5">
        <Section title="Building size">
          <FilterSlider
            label="Minimum size" min={0} max={600000} step={25000}
            value={f.filters.minSizeSqft} onChange={v => f.patch({ minSizeSqft: v })}
            icon={Building2} format={formatSqftShort}
          />
        </Section>

        <Section title="Logistics specs">
          <div className="space-y-4">
            <FilterSlider label="Clear height" min={0} max={44} step={2}
              value={f.filters.minClearHeight} onChange={v => f.patch({ minClearHeight: v })}
              icon={ArrowUpRight} format={v => `${v}′+`} />
            <FilterSlider label="Dock doors" min={0} max={100} step={5}
              value={f.filters.minDockDoors} onChange={v => f.patch({ minDockDoors: v })}
              icon={Truck} format={v => `${v}+`} />
            <FilterSlider label="Power" min={0} max={10000} step={1000}
              value={f.filters.minPower} onChange={v => f.patch({ minPower: v })}
              icon={Zap} format={v => `${v.toLocaleString()}A+`} />
          </div>
        </Section>

        <Section title="Possession status">
          <div className="space-y-2">
            {possessionDefs.map(o => (
              <OptionRow key={o.id} label={o.label} dot={o.dot}
                active={f.filters.possession.includes(o.id)} onClick={() => f.togglePossession(o.id)} />
            ))}
          </div>
        </Section>

        <Section title="Lease terms">
          <div className="space-y-2">
            {leaseTermDefs.map(o => (
              <OptionRow key={o.id} label={o.label} hint={o.hint}
                active={f.filters.leaseTerms.includes(o.id)} onClick={() => f.toggleLeaseTerm(o.id)} />
            ))}
          </div>
        </Section>

        <Section title="Facility features">
          <div className="space-y-2">
            {featureDefs.map(o => (
              <OptionRow key={o.id} label={o.label} icon={o.icon} variant="switch"
                active={f.filters.features.includes(o.id)} onClick={() => f.toggleFeature(o.id)} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
