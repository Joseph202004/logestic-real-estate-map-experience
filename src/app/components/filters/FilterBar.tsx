import { SlidersHorizontal } from 'lucide-react';
import { ChipPill } from './controls';
import type { CategoryId } from './types';
import type { UseFilters } from './useFilters';

const FONT = 'Montserrat, sans-serif';

/** Collapsed filter summary in the results rail: opens the modal, shows what is applied. */
export function FilterBar({
  filters: f,
  onOpen,
}: {
  filters: UseFilters;
  /** Opens the dialog, optionally jumping straight to one category. */
  onOpen: (category?: CategoryId) => void;
}) {
  return (
    <div className="px-4 py-2.5 bg-white border-b border-[#E6F1FB]" style={{ fontFamily: FONT }}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpen()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E6F1FB] text-[#0C447C] hover:border-[#00C2B2] hover:bg-[#00C2B2]/5 transition-all"
          style={{ fontSize: 11, fontWeight: 700 }}
        >
          <SlidersHorizontal size={12} />
          Logistics Filters
          {f.activeCount > 0 && (
            <span
              className="ml-0.5 min-w-[15px] px-1 py-0.5 bg-[#00C2B2] text-white rounded-full text-center leading-none"
              style={{ fontSize: 9, fontWeight: 800 }}
            >
              {f.activeCount}
            </span>
          )}
        </button>

        {f.activeCount > 0 && (
          <button
            onClick={f.clearAll}
            className="ml-auto shrink-0 text-[#B42318] hover:underline whitespace-nowrap"
            style={{ fontSize: 10, fontWeight: 600 }}
          >
            Clear filters
          </button>
        )}
      </div>

      {f.chips.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {f.chips.map(chip => (
            <ChipPill
              key={chip.key}
              chip={chip}
              onClear={() => f.clearChip(chip)}
              onEdit={() => onOpen(chip.category)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
