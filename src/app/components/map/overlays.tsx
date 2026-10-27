import { useState } from 'react';
import {
  AlertTriangle, Check, ChevronDown, ChevronUp, Clock, Gauge, Layers, MapPin, Navigation, Ruler, SlidersHorizontal, Sparkles, Square, X,
} from 'lucide-react';
import type { Property } from '../../data/properties';
import { layerDefs, matchScore } from '../../personas/personas';
import type { LayerId, Persona } from '../../personas/personas';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/** Shared card chrome so every floating panel reads as one aligned system. */
const PANEL = 'bg-white/95 backdrop-blur-sm rounded-2xl border border-[#E7E0EC] shadow-[0_8px_28px_rgba(12,68,124,0.12)]';
/** Uppercase muted section label, as in the reference cards. */
const SECTION: React.CSSProperties = { fontSize: 9, fontWeight: 700, letterSpacing: '0.06em' };

/* ── Reach selector ─────────────────────────────────────────────── */

export const REACH_OPTIONS = [
  { id: '30m', label: '30-minute reach', short: '30 min', radiusKm: 35 },
  { id: '1h', label: '1-hour reach', short: '1 hour', radiusKm: 80 },
  { id: '2h', label: '2-hour reach', short: '2 hours', radiusKm: 150 },
  { id: '4h', label: '4-hour reach', short: '4 hours', radiusKm: 280 },
  { id: 'sameday', label: 'Same-day reach', short: 'Same day', radiusKm: 400 },
  { id: 'nextday', label: 'Next-day reach', short: 'Next day', radiusKm: 700 },
] as const;

export type ReachId = typeof REACH_OPTIONS[number]['id'];

/** Compact analysis toolbar, upper-left of the map (spec §7). */
export function AnalysisToolbar({
  reach,
  onReachChange,
  insetLeft = 0,
  driveTime = false,
  onDriveTimeToggle,
  drawArea = false,
  onDrawAreaToggle,
  drawCount = null,
  filtersOpen,
  onToggleFilters,
}: {
  reach: ReachId;
  onReachChange: (r: ReachId) => void;
  /** px to shift right so the toolbar clears any panels docked on the left. */
  insetLeft?: number;
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
  driveTime?: boolean;
  onDriveTimeToggle?: () => void;
  drawArea?: boolean;
  onDrawAreaToggle?: () => void;
  /** properties inside the drawn area, or null when nothing is drawn. */
  drawCount?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const current = REACH_OPTIONS.find(r => r.id === reach)!;

  return (
    <div className="absolute top-4 z-[1000] flex items-center gap-1.5" style={{ fontFamily: FONT, left: insetLeft + 16 }}>
      {/* Filters — opens the left filters panel; hidden while that panel is open */}
      {onToggleFilters && !filtersOpen && (
        <button
          onClick={onToggleFilters}
          title="Show filters"
          className="flex items-center gap-1.5 px-3 h-[36px] rounded-xl backdrop-blur-sm shadow-[0_6px_20px_rgba(12,68,124,0.12)] border bg-white/95 border-[#E7E0EC] text-[#21005D] hover:border-[#6750A4] transition-colors"
          style={{ fontSize: 11, fontWeight: 700 }}
        >
          <SlidersHorizontal size={13} /> Filters
        </button>
      )}

      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="flex items-center gap-1.5 px-3 h-[36px] rounded-xl bg-white/95 backdrop-blur-sm shadow-[0_6px_20px_rgba(12,68,124,0.12)] border border-[#E7E0EC] text-[#21005D] hover:border-[#6750A4] transition-colors"
          style={{ fontSize: 11, fontWeight: 700 }}
        >
          <Clock size={13} className="text-[#6750A4]" />
          {current.short}
          <ChevronDown size={12} className="text-[#1D1B20]/40" />
        </button>

        {open && (
          <div className="absolute top-[40px] left-0 w-[170px] bg-white rounded-xl shadow-[0_8px_28px_rgba(12,68,124,0.16)] border border-[#E7E0EC] overflow-hidden">
            {REACH_OPTIONS.map(r => (
              <button
                key={r.id}
                onClick={() => { onReachChange(r.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                  r.id === reach ? 'bg-[#E7E0EC] text-[#21005D]' : 'text-[#1D1B20]/60 hover:bg-[#FEF7FF]'
                }`}
                style={{ fontSize: 11, fontWeight: r.id === reach ? 700 : 500 }}
              >
                {r.label}
                {r.id === reach && <Check size={11} className="ml-auto text-[#6750A4]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Drive-time isochrone toggle */}
      <button
        onClick={onDriveTimeToggle}
        aria-pressed={driveTime}
        title="Show drive-time rings and highway corridors around the selected property"
        className={`flex items-center gap-1.5 px-3 h-[36px] rounded-xl backdrop-blur-sm shadow-[0_6px_20px_rgba(12,68,124,0.1)] border transition-colors ${
          driveTime
            ? 'bg-[#6750A4] border-[#6750A4] text-white'
            : 'bg-white/95 border-[#E7E0EC] text-[#21005D] hover:border-[#6750A4]'
        }`}
        style={{ fontSize: 11, fontWeight: 700 }}
      >
        <Ruler size={12} /> Drive time
      </button>

      {/* Draw-area rectangle toggle */}
      <button
        onClick={onDrawAreaToggle}
        aria-pressed={drawArea}
        title="Draw a rectangle on the map to count properties inside it"
        className={`flex items-center gap-1.5 px-3 h-[36px] rounded-xl backdrop-blur-sm shadow-[0_6px_20px_rgba(12,68,124,0.1)] border transition-colors ${
          drawArea
            ? 'bg-[#6750A4] border-[#6750A4] text-white'
            : 'bg-white/95 border-[#E7E0EC] text-[#21005D] hover:border-[#6750A4]'
        }`}
        style={{ fontSize: 11, fontWeight: 700 }}
      >
        <Square size={12} /> {drawArea ? 'Drawing…' : 'Draw area'}
        {drawCount != null && (
          <span
            className="ml-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-white/25 flex items-center justify-center"
            style={{ fontSize: 9, fontWeight: 800 }}
          >
            {drawCount}
          </span>
        )}
      </button>
    </div>
  );
}

/* ── Data layers, grouped by recommendation (spec §12) ──────────── */

export function LayerPanel({
  persona,
  active,
  onToggle,
}: {
  persona: Persona;
  active: Set<LayerId>;
  onToggle: (id: LayerId) => void;
}) {
  const [open, setOpen] = useState(false);

  const Row = ({ id }: { id: LayerId }) => {
    const def = layerDefs[id];
    const on = active.has(id);
    return (
      <button
        key={id}
        onClick={() => def.available && onToggle(id)}
        disabled={!def.available}
        title={def.available ? def.desc : 'Dataset not connected in this prototype'}
        className={`w-full flex items-center gap-2.5 px-4 py-2 transition-colors text-left ${
          !def.available
            ? 'text-[#1D1B20]/30 cursor-not-allowed'
            : on ? 'bg-[#E7E0EC] text-[#21005D]' : 'text-[#1D1B20]/55 hover:bg-[#FEF7FF]'
        }`}
        style={{ fontSize: 11, fontWeight: on ? 700 : 500 }}
      >
        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
          on ? 'bg-[#6750A4] border-[#6750A4]' : 'border-[#CAC4D0]'
        }`}>
          {on && <Check size={10} className="text-white" />}
        </span>
        <span className="min-w-0 flex-1 leading-snug">
          <span className="block truncate">{def.label}</span>
          {!def.available && (
            <span className="block text-[#1D1B20]/25" style={{ fontSize: 9, fontWeight: 500 }}>Data not connected</span>
          )}
        </span>
      </button>
    );
  };

  // Hovering the group opens the panel; leaving closes it (click still toggles).
  return (
    <div
      className="flex justify-end"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className={`flex items-center gap-2 pl-3 pr-3.5 h-11 rounded-full ${PANEL} hover:border-[#6750A4]/40 transition-colors`}
          style={{ fontFamily: FONT }}
        >
          <Layers size={15} className="text-[#6750A4]" />
          <span className="text-[#21005D]" style={{ fontSize: 12, fontWeight: 700 }}>Layers</span>
          {active.size > 0 && (
            <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-[#6750A4] text-white flex items-center justify-center" style={{ fontSize: 9, fontWeight: 800 }}>
              {active.size}
            </span>
          )}
        </button>
      ) : (
        <div className={`w-56 flex flex-col overflow-hidden ${PANEL}`} style={{ fontFamily: FONT }}>
          <div className="px-4 py-3 border-b border-[#E7E0EC] flex items-center gap-1.5 shrink-0">
            <Layers size={13} className="text-[#6750A4]" />
            <span className="text-[#21005D]" style={{ fontSize: 11.5, fontWeight: 800 }}>Data Layers</span>
            <button onClick={() => setOpen(false)} className="ml-auto text-[#1D1B20]/40 hover:text-[#21005D] transition-colors" aria-label="Collapse data layers">
              <X size={14} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[46vh] py-1">
            <div className="px-4 pt-2 pb-1 text-[#1D1B20]/35" style={SECTION}>RECOMMENDED</div>
            {persona.recommended.map(id => <Row key={id} id={id} />)}

            <div className="px-4 pt-3 pb-1 mt-1 border-t border-[#E7E0EC] text-[#1D1B20]/35" style={SECTION}>ADDITIONAL</div>
            {persona.additional.map(id => <Row key={id} id={id} />)}
            <div className="h-1" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Why this location fits (spec §11) ──────────────────────────── */

export function MatchPanel({
  persona,
  property,
  reachLabel,
  onCompare,
  onSave,
  saved,
  inCompare,
}: {
  persona: Persona;
  property: Property;
  reachLabel: string;
  onCompare: () => void;
  onSave: () => void;
  saved: boolean;
  inCompare: boolean;
}) {
  const [open, setOpen] = useState(false);
  const score = matchScore(persona, property);
  const signals = persona.signals(property);

  const stats = [
    { icon: Navigation, label: 'Highway', value: property.locationSignals.highwayAccess },
    { icon: Clock, label: reachLabel, value: property.locationSignals.sameDayReach },
    { icon: Gauge, label: 'Labor', value: `${property.locationSignals.laborPoolScore}/100` },
  ];

  const badgeColor = score >= 75 ? '#2E7D32' : score >= 50 ? '#8C5000' : '#B3261E';
  const btn = (active: boolean) =>
    `flex-1 px-4 py-2 rounded-full border transition-colors ${
      active ? 'bg-[#6750A4]/10 border-[#6750A4] text-[#6750A4]' : 'border-[#E7E0EC] text-[#1D1B20]/60 hover:border-[#6750A4]/40'
    }`;

  // Collapsed: a compact pill so the map stays clean; expands to the full card.
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 pl-3 pr-3 h-11 rounded-full ${PANEL} hover:border-[#6750A4]/40 transition-colors`}
        style={{ fontFamily: FONT }}
      >
        <Sparkles size={14} className="text-[#6750A4] shrink-0" />
        <span className="text-[#21005D] truncate max-w-[170px]" style={{ fontSize: 12, fontWeight: 700 }}>{property.name}</span>
        <span className="shrink-0 px-2 py-0.5 rounded-full" style={{ fontSize: 9.5, fontWeight: 800, color: badgeColor, background: `${badgeColor}14` }}>
          {score}%
        </span>
        <ChevronUp size={14} className="text-[#1D1B20]/40 shrink-0" />
      </button>
    );
  }

  return (
    <div className={`w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden ${PANEL}`} style={{ fontFamily: FONT }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2.5 border-b border-[#ECE6F0]">
        <div className="flex items-center gap-2">
          <span className="text-[#1D1B20]/40" style={SECTION}>WHY THIS LOCATION FITS</span>
          <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full" style={{ fontSize: 9.5, fontWeight: 800, color: badgeColor, background: `${badgeColor}14` }}>
            {score}%
          </span>
          <button onClick={() => setOpen(false)} className="text-[#1D1B20]/40 hover:text-[#21005D] transition-colors" aria-label="Collapse">
            <ChevronDown size={15} />
          </button>
        </div>
        <div className="text-[#21005D] truncate mt-1" style={{ fontSize: 14, fontWeight: 800 }}>{property.name}</div>
        <div className="text-[#1D1B20]/45 flex items-center gap-1 truncate mt-0.5" style={{ fontSize: 11, fontWeight: 500 }}>
          <MapPin size={10} className="shrink-0" />
          {property.market}, {property.submarket}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-2.5">
          {stats.map(s => (
            <div key={s.label} className="min-w-0">
              <div className="flex items-center gap-1 text-[#1D1B20]/40" style={{ fontSize: 8.5, fontWeight: 600 }}>
                <s.icon size={9} className="text-[#6750A4] shrink-0" /> {s.label}
              </div>
              <div className="text-[#21005D] truncate mt-0.5" style={{ fontSize: 11, fontWeight: 800 }} title={s.value}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Signals */}
      <ul className="px-4 py-3 space-y-1.5">
        {signals.map(s => (
          <li key={s.text} className="flex items-start gap-2">
            {s.ok
              ? <Check size={13} className="text-[#2E7D32] mt-px shrink-0" />
              : <AlertTriangle size={13} className="text-[#8C5000] mt-px shrink-0" />}
            <span className={`leading-snug ${s.ok ? 'text-[#1D1B20]/75' : 'text-[#8C5000]'}`} style={{ fontSize: 11, fontWeight: 500 }}>
              {s.text}
            </span>
          </li>
        ))}
      </ul>
      <p className="px-4 pb-2 text-[#1D1B20]/30" style={{ fontSize: 9.5, fontWeight: 500 }}>
        {reachLabel} shown as a straight-line estimate, not a routed isochrone.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-[#ECE6F0]">
        <button onClick={onCompare} className={btn(inCompare)} style={{ fontSize: 11, fontWeight: 700 }}>
          {inCompare ? 'In compare' : 'Compare'}
        </button>
        <button onClick={onSave} className={btn(saved)} style={{ fontSize: 11, fontWeight: 700 }}>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
