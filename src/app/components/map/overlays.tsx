import { useState } from 'react';
import {
  AlertTriangle, Check, ChevronDown, Clock, Gauge, Layers, Lock, MapPin, Navigation, Ruler, Square,
} from 'lucide-react';
import type { Property } from '../../data/properties';
import { layerDefs, matchScore } from '../../personas/personas';
import type { LayerId, Persona } from '../../personas/personas';

const FONT = 'Montserrat, sans-serif';

/** Shared card chrome so every floating panel reads as one aligned system. */
const PANEL = 'bg-white/95 backdrop-blur-sm rounded-2xl border border-[#E6F1FB] shadow-[0_8px_28px_rgba(12,68,124,0.12)]';
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
}: {
  reach: ReachId;
  onReachChange: (r: ReachId) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = REACH_OPTIONS.find(r => r.id === reach)!;

  return (
    <div className="absolute top-4 left-4 z-[1000] flex items-center gap-1.5" style={{ fontFamily: FONT }}>
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="flex items-center gap-1.5 px-3 h-[36px] rounded-xl bg-white/95 backdrop-blur-sm shadow-[0_6px_20px_rgba(12,68,124,0.12)] border border-[#E6F1FB] text-[#0C447C] hover:border-[#00C2B2] transition-colors"
          style={{ fontSize: 11, fontWeight: 700 }}
        >
          <Clock size={13} className="text-[#00C2B2]" />
          {current.short}
          <ChevronDown size={12} className="text-[#303234]/40" />
        </button>

        {open && (
          <div className="absolute top-[40px] left-0 w-[170px] bg-white rounded-xl shadow-[0_8px_28px_rgba(12,68,124,0.16)] border border-[#E6F1FB] overflow-hidden">
            {REACH_OPTIONS.map(r => (
              <button
                key={r.id}
                onClick={() => { onReachChange(r.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                  r.id === reach ? 'bg-[#E6F1FB] text-[#0C447C]' : 'text-[#303234]/60 hover:bg-[#F4F3F3]'
                }`}
                style={{ fontSize: 11, fontWeight: r.id === reach ? 700 : 500 }}
              >
                {r.label}
                {r.id === reach && <Check size={11} className="ml-auto text-[#00C2B2]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Declared but not yet wired — labelled rather than silently dead (spec §17) */}
      {[
        { icon: Ruler, label: 'Drive time' },
        { icon: Square, label: 'Draw area' },
      ].map(tool => (
        <button
          key={tool.label}
          disabled
          title="Needs a routing service — not available in this prototype"
          className="flex items-center gap-1.5 px-3 h-[36px] rounded-xl bg-white/80 backdrop-blur-sm shadow-[0_6px_20px_rgba(12,68,124,0.08)] border border-[#E6F1FB] text-[#303234]/35 cursor-not-allowed"
          style={{ fontSize: 11, fontWeight: 600 }}
        >
          <tool.icon size={12} /> {tool.label} <Lock size={9} />
        </button>
      ))}
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
            ? 'text-[#303234]/30 cursor-not-allowed'
            : on ? 'bg-[#E6F1FB] text-[#0C447C]' : 'text-[#303234]/55 hover:bg-[#F4F3F3]'
        }`}
        style={{ fontSize: 11, fontWeight: on ? 700 : 500 }}
      >
        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
          on ? 'bg-[#00C2B2] border-[#00C2B2]' : 'border-[#D5DDD5]'
        }`}>
          {on && <Check size={10} className="text-white" />}
        </span>
        <span className="min-w-0 flex-1 leading-snug">
          <span className="block truncate">{def.label}</span>
          {!def.available && (
            <span className="block text-[#303234]/25" style={{ fontSize: 9, fontWeight: 500 }}>Data not connected</span>
          )}
        </span>
      </button>
    );
  };

  return (
    <div
      className={`h-full flex flex-col overflow-hidden ${PANEL}`}
      style={{ fontFamily: FONT }}
    >
      <div className="px-4 py-3 border-b border-[#E6F1FB] flex items-center gap-1.5 shrink-0">
        <Layers size={13} className="text-[#1B4D4A]" />
        <span className="text-[#0C447C]" style={{ fontSize: 11.5, fontWeight: 800 }}>Data Layers</span>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <div className="px-4 pt-2 pb-1 text-[#303234]/35" style={SECTION}>RECOMMENDED</div>
        {persona.recommended.map(id => <Row key={id} id={id} />)}

        <div className="px-4 pt-3 pb-1 mt-1 border-t border-[#E6F1FB] text-[#303234]/35" style={SECTION}>ADDITIONAL</div>
        {persona.additional.map(id => <Row key={id} id={id} />)}
        <div className="h-1" />
      </div>
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
  const score = matchScore(persona, property);
  const signals = persona.signals(property);

  const stats = [
    { icon: Navigation, label: 'Highway', value: property.locationSignals.highwayAccess },
    { icon: Clock, label: reachLabel, value: property.locationSignals.sameDayReach },
    { icon: Gauge, label: 'Labor', value: `${property.locationSignals.laborPoolScore}/100` },
  ];

  return (
    // Full-width bar along the bottom of the map grid (reference: TRUCK/DRIVER row).
    <div
      className={`flex items-stretch gap-4 px-4 py-3 overflow-hidden ${PANEL}`}
      style={{ fontFamily: FONT }}
    >
      {/* Property + match + stats */}
      <div className="w-[200px] shrink-0 pr-4 border-r border-[#E6F1FB]">
        <div className="flex items-center gap-2">
          <span className="text-[#303234]/40" style={SECTION}>WHY THIS LOCATION FITS</span>
          <span
            className="ml-auto px-2 py-0.5 rounded-full"
            style={{
              fontSize: 9.5, fontWeight: 800,
              color: score >= 75 ? '#00CC66' : score >= 50 ? '#B26A00' : '#B42318',
              background: score >= 75 ? '#00CC6615' : score >= 50 ? '#B26A0015' : '#B4231815',
            }}
          >
            {score}% MATCH
          </span>
        </div>
        <div className="text-[#0C447C] truncate mt-1" style={{ fontSize: 13, fontWeight: 800 }}>{property.name}</div>
        <div className="text-[#303234]/45 flex items-center gap-1 truncate" style={{ fontSize: 10.5, fontWeight: 500 }}>
          <MapPin size={9} className="shrink-0" />
          {property.market}, {property.submarket}
        </div>

        <div className="flex items-stretch mt-2 rounded-lg bg-[#F8FBFE] overflow-hidden">
          {stats.map(s => (
            <div key={s.label} className="flex-1 min-w-0 px-2 py-1 border-l border-white first:border-l-0">
              <div className="flex items-center gap-0.5 text-[#303234]/40" style={{ fontSize: 8, fontWeight: 600 }}>
                <s.icon size={8} className="text-[#00C2B2]" /> {s.label}
              </div>
              <div className="text-[#0C447C] truncate" style={{ fontSize: 10, fontWeight: 800 }} title={s.value}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Signals, laid out across the width (single column when tight, two when wide) */}
      <div className="flex-1 min-w-0">
        <ul className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-1">
          {signals.map(s => (
            <li key={s.text} className="flex items-start gap-1.5">
              {s.ok
                ? <Check size={12} className="text-[#00CC66] mt-px shrink-0" />
                : <AlertTriangle size={12} className="text-[#B26A00] mt-px shrink-0" />}
              <span className={`leading-tight ${s.ok ? 'text-[#303234]/75' : 'text-[#B26A00]'}`} style={{ fontSize: 10.5, fontWeight: 500 }}>
                {s.text}
              </span>
            </li>
          ))}
        </ul>
        <div className="text-[#303234]/30 mt-1.5" style={{ fontSize: 9, fontWeight: 500 }}>
          {reachLabel} shown as a straight-line estimate, not a routed isochrone.
        </div>
      </div>

      {/* Actions */}
      <div className="w-[110px] shrink-0 flex flex-col justify-center gap-1.5 pl-4 border-l border-[#E6F1FB]">
        <button
          onClick={onCompare}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            inCompare ? 'bg-[#00C2B2]/10 border-[#00C2B2] text-[#1B4D4A]' : 'border-[#E6F1FB] text-[#303234]/60 hover:border-[#00C2B2]/40'
          }`}
          style={{ fontSize: 10.5, fontWeight: 700 }}
        >
          {inCompare ? 'In compare' : 'Compare'}
        </button>
        <button
          onClick={onSave}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            saved ? 'bg-[#00C2B2]/10 border-[#00C2B2] text-[#1B4D4A]' : 'border-[#E6F1FB] text-[#303234]/60 hover:border-[#00C2B2]/40'
          }`}
          style={{ fontSize: 10.5, fontWeight: 700 }}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
