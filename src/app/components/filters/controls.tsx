import { X } from 'lucide-react';
import type { ActiveChip } from './types';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/** Labelled range input used by the size and spec categories. */
export function FilterSlider({
  label, min, max, step, value, onChange, icon: Icon, format,
}: {
  label: string;
  min: number; max: number; step: number;
  value: number;
  onChange: (v: number) => void;
  icon: any;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-[#1D1B20]/70" style={{ fontSize: 11, fontWeight: 600 }}>
          <Icon size={12} className="text-[#6750A4]" />
          {label}
        </span>
        <span className="text-[#21005D]" style={{ fontSize: 12, fontWeight: 800 }}>
          {value > min ? (format ? format(value) : `${value.toLocaleString()}+`) : 'Any'}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full h-1.5 bg-[#E7E0EC] rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-[#6750A4] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
      />
      <div className="flex justify-between mt-1 text-[#1D1B20]/35" style={{ fontSize: 9, fontWeight: 600 }}>
        <span>Any</span>
        <span>{format ? format(max) : max.toLocaleString()}</span>
      </div>
    </div>
  );
}

/** Selectable option row — radio-ish for OR groups, switch for AND features. */
export function OptionRow({
  label, hint, active, onClick, icon: Icon, dot, variant = 'check',
}: {
  label: string;
  hint?: string;
  active: boolean;
  onClick: () => void;
  icon?: any;
  dot?: string;
  variant?: 'check' | 'switch';
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left
        ${active
          ? 'bg-[#6750A4]/8 border-[#6750A4]'
          : 'bg-white border-[#E7E0EC] hover:border-[#6750A4]/40'
        }
      `}
      style={{ fontFamily: FONT }}
    >
      {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />}
      {Icon && <Icon size={14} className={active ? 'text-[#6750A4]' : 'text-[#1D1B20]/35'} />}

      <span className="min-w-0 flex-1">
        <span className={`block truncate ${active ? 'text-[#6750A4]' : 'text-[#1D1B20]/70'}`} style={{ fontSize: 12, fontWeight: 700 }}>
          {label}
        </span>
        {hint && (
          <span className="block text-[#1D1B20]/40" style={{ fontSize: 10, fontWeight: 500 }}>{hint}</span>
        )}
      </span>

      {variant === 'switch' ? (
        <span className={`w-8 h-[18px] rounded-full flex items-center px-0.5 shrink-0 transition-colors ${active ? 'bg-[#6750A4] justify-end' : 'bg-[#E7E0EC] justify-start'}`}>
          <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
        </span>
      ) : (
        <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${active ? 'border-[#6750A4]' : 'border-[#E7E0EC]'}`}>
          {active && <span className="w-2 h-2 rounded-full bg-[#6750A4]" />}
        </span>
      )}
    </button>
  );
}

/**
 * Removable pill for one applied value. With `onEdit`, the label itself is a
 * button that jumps straight to that chip's category; the × still clears it.
 */
export function ChipPill({
  chip, onClear, onEdit, compact,
}: {
  chip: ActiveChip;
  onClear: () => void;
  onEdit?: () => void;
  compact?: boolean;
}) {
  const size = compact ? 9 : 9.5;
  const dot = chip.dot && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: chip.dot }} />;

  return (
    <span
      className={`
        inline-flex items-center gap-1 pl-2 pr-1 bg-[#E7E0EC] text-[#21005D] rounded-full leading-none
        ${compact ? 'h-[17px]' : 'h-[19px]'}
        ${onEdit ? 'hover:bg-[#6750A4]/15 transition-colors' : ''}
      `}
      style={{ fontSize: size, fontWeight: 700, fontFamily: FONT }}
    >
      {onEdit ? (
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          className="inline-flex items-center gap-1 leading-none cursor-pointer"
          // Buttons do not inherit the chip's font, so restate it here.
          style={{ fontSize: size, fontWeight: 700, fontFamily: FONT, color: 'inherit' }}
          title={`Edit ${chip.label}`}
        >
          {dot}
          {chip.label}
        </button>
      ) : (
        <>
          {dot}
          {chip.label}
        </>
      )}
      <button
        onClick={e => { e.stopPropagation(); onClear(); }}
        className="flex items-center opacity-50 hover:opacity-100 transition-opacity"
        aria-label={`Remove ${chip.label}`}
      >
        <X size={compact ? 8 : 9} />
      </button>
    </span>
  );
}
