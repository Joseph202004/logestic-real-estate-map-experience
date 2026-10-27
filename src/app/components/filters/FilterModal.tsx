import { useEffect, useState } from 'react';
import { ArrowUpRight, Building2, ChevronRight, Truck, X, Zap } from 'lucide-react';
import { categoryDefs, featureDefs, formatSqftShort, leaseTermDefs, possessionDefs } from './definitions';
import { ChipPill, FilterSlider, OptionRow } from './controls';
import type { CategoryId } from './types';
import type { UseFilters } from './useFilters';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/** Master/detail filter dialog: category rail on the left, its controls on the right. */
export function FilterModal({
  filters: f,
  resultCount,
  onClose,
  initialCategory = 'size',
}: {
  filters: UseFilters;
  resultCount: number;
  onClose: () => void;
  /** Category to land on — set when opened from an applied chip. */
  initialCategory?: CategoryId;
}) {
  const [category, setCategory] = useState<CategoryId>(initialCategory);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const active = categoryDefs.find(c => c.id === category)!;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-[#21005D]/30 backdrop-blur-sm"
      // Leaflet's map panes sit at z-index 400–700, so the dialog has to clear them.
      style={{ fontFamily: FONT, zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[860px] max-h-[86vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Logistics filters"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#E7E0EC]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[#21005D]" style={{ fontSize: 18, fontWeight: 800 }}>Logistics Filters</h2>
              <p className="text-[#1D1B20]/50 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
                Narrow the map and list by how the building has to run.
              </p>
            </div>
            <button onClick={onClose} className="text-[#1D1B20]/40 hover:text-[#21005D] transition-colors" aria-label="Close filters">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Left rail: categories */}
          <div className="w-[42%] max-w-[320px] border-r border-[#E7E0EC] overflow-y-auto p-4 bg-[#F7F2FA]">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[#21005D]" style={{ fontSize: 12, fontWeight: 800 }}>Filters</span>
              {f.activeCount > 0 && (
                <button
                  onClick={f.clearAll}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#6750A4]/10 text-[#6750A4] rounded-full hover:bg-[#6750A4]/20 transition-colors"
                  style={{ fontSize: 10, fontWeight: 700 }}
                >
                  {f.activeCount} applied <X size={10} />
                </button>
              )}
            </div>

            <div className="space-y-2">
              {categoryDefs.map(c => {
                const chips = f.chipsByCategory[c.id] || [];
                const selected = category === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`
                      rounded-xl border cursor-pointer transition-all bg-white
                      ${selected ? 'border-[#6750A4] shadow-sm' : 'border-[#E7E0EC] hover:border-[#6750A4]/40'}
                    `}
                  >
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <c.icon size={14} className={selected ? 'text-[#6750A4]' : 'text-[#1D1B20]/40'} />
                      <span className={selected ? 'text-[#21005D]' : 'text-[#1D1B20]/70'} style={{ fontSize: 12, fontWeight: 700 }}>
                        {c.label}
                      </span>
                      <ChevronRight size={14} className="ml-auto text-[#1D1B20]/30" />
                    </div>
                    {chips.length > 0 && (
                      <div className="flex flex-wrap gap-1 px-3 pb-2.5">
                        {chips.map(chip => (
                          <ChipPill key={chip.key} chip={chip} onClear={() => f.clearChip(chip)} compact />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right pane: the selected category */}
          <div className="flex-1 overflow-y-auto p-5">
            <h3 className="text-[#21005D]" style={{ fontSize: 15, fontWeight: 800 }}>{active.label}</h3>
            <p className="text-[#1D1B20]/50 mb-4" style={{ fontSize: 12, fontWeight: 500 }}>{active.blurb}</p>

            {category === 'size' && (
              <FilterSlider
                label="Minimum building size"
                min={0} max={600000} step={25000}
                value={f.filters.minSizeSqft}
                onChange={v => f.patch({ minSizeSqft: v })}
                icon={Building2}
                format={formatSqftShort}
              />
            )}

            {category === 'specs' && (
              <div className="space-y-5">
                <FilterSlider
                  label="Clear height" min={0} max={44} step={2}
                  value={f.filters.minClearHeight}
                  onChange={v => f.patch({ minClearHeight: v })}
                  icon={ArrowUpRight}
                  format={v => `${v}′+`}
                />
                <FilterSlider
                  label="Dock doors" min={0} max={100} step={5}
                  value={f.filters.minDockDoors}
                  onChange={v => f.patch({ minDockDoors: v })}
                  icon={Truck}
                  format={v => `${v}+`}
                />
                <FilterSlider
                  label="Power capacity" min={0} max={10000} step={1000}
                  value={f.filters.minPower}
                  onChange={v => f.patch({ minPower: v })}
                  icon={Zap}
                  format={v => `${v.toLocaleString()}A+`}
                />
              </div>
            )}

            {category === 'possession' && (
              <div className="space-y-2">
                {possessionDefs.map(o => (
                  <OptionRow
                    key={o.id}
                    label={o.label}
                    dot={o.dot}
                    active={f.filters.possession.includes(o.id)}
                    onClick={() => f.togglePossession(o.id)}
                  />
                ))}
                <p className="text-[#1D1B20]/40 pt-1" style={{ fontSize: 10.5 }}>
                  Pick several to widen the results.
                </p>
              </div>
            )}

            {category === 'lease' && (
              <div className="space-y-2">
                {leaseTermDefs.map(o => (
                  <OptionRow
                    key={o.id}
                    label={o.label}
                    hint={o.hint}
                    active={f.filters.leaseTerms.includes(o.id)}
                    onClick={() => f.toggleLeaseTerm(o.id)}
                  />
                ))}
                <p className="text-[#1D1B20]/40 pt-1" style={{ fontSize: 10.5 }}>
                  Pick several to widen the results.
                </p>
              </div>
            )}

            {category === 'features' && (
              <div className="space-y-2">
                {featureDefs.map(o => (
                  <OptionRow
                    key={o.id}
                    label={o.label}
                    icon={o.icon}
                    variant="switch"
                    active={f.filters.features.includes(o.id)}
                    onClick={() => f.toggleFeature(o.id)}
                  />
                ))}
                <p className="text-[#1D1B20]/40 pt-1" style={{ fontSize: 10.5 }}>
                  Every feature you switch on must be present.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E7E0EC] flex items-center justify-between bg-white">
          <button
            onClick={f.clearAll}
            disabled={f.activeCount === 0}
            className="text-[#B3261E] disabled:text-[#1D1B20]/25 hover:underline disabled:no-underline"
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#6750A4] text-white rounded-xl hover:bg-[#4F378B] transition-colors"
            style={{ fontSize: 12, fontWeight: 700 }}
          >
            Show {resultCount} {resultCount === 1 ? 'property' : 'properties'}
          </button>
        </div>
      </div>
    </div>
  );
}
