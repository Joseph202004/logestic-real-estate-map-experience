import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft, Settings as SettingsIcon, User, Bell, Map as MapIcon,
  Palette, ShieldCheck, ChevronRight, Check,
} from 'lucide-react';
import { personas } from '../personas/personas';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/* ═══════════════════════════════════════════════════════════════
   SETTINGS PAGE — Material 3, matches the app design system
   ═══════════════════════════════════════════════════════════════ */
export function SettingsPage() {
  // Local prototype state — nothing is persisted to a backend.
  const [defaultPersona, setDefaultPersona] = useState(personas[0].id);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [mapStyle, setMapStyle] = useState<'streets' | 'light' | 'satellite'>('streets');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [priceDrops, setPriceDrops] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [autoLayers, setAutoLayers] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <div className="min-h-screen bg-[#FEF7FF]" style={{ fontFamily: FONT }}>
      <div className="max-w-[880px] mx-auto px-4 md:px-8 py-8 md:py-10">

        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-[#1D1B20]/45 hover:text-[#21005D] transition-colors mb-4"
          style={{ fontSize: 11.5, fontWeight: 600 }}
        >
          <ArrowLeft size={13} /> Back to search
        </Link>

        {/* Page header */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-full bg-[#6750A4] text-white flex items-center justify-center shadow-sm">
            <SettingsIcon size={17} />
          </div>
          <div>
            <h1 className="text-[#21005D]" style={{ fontSize: 24, fontWeight: 800 }}>Settings</h1>
            <p className="text-[#1D1B20]/50 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
              Personalise your workspace, alerts and map defaults.
            </p>
          </div>
        </div>

        {/* Account */}
        <Section icon={User} title="Account">
          <Row label="Signed in as" hint="adijosantony@gmail.com">
            <Link to="/signin" className="flex items-center gap-1 text-[#6750A4]" style={{ fontSize: 12, fontWeight: 700 }}>
              Manage <ChevronRight size={13} />
            </Link>
          </Row>
          <Row label="Measurement units" hint="Used for size, clearance and distance">
            <Segmented
              value={units}
              onChange={v => setUnits(v as typeof units)}
              options={[{ id: 'imperial', label: 'Imperial' }, { id: 'metric', label: 'Metric' }]}
            />
          </Row>
        </Section>

        {/* Search defaults */}
        <Section icon={ShieldCheck} title="Search defaults">
          <Row label="Default persona" hint="Pre-selects recommended map layers and match scoring">
            <select
              value={defaultPersona}
              onChange={e => setDefaultPersona(e.target.value as typeof defaultPersona)}
              className="h-10 pl-3 pr-8 rounded-xl bg-[#F7F2FA] border border-transparent focus:border-[#6750A4] focus:bg-white focus:outline-none transition-all text-[#21005D]"
              style={{ fontSize: 12.5, fontWeight: 600 }}
            >
              {personas.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </Row>
        </Section>

        {/* Map */}
        <Section icon={MapIcon} title="Map">
          <Row label="Base map style" hint="Applied to the interactive search map">
            <Segmented
              value={mapStyle}
              onChange={v => setMapStyle(v as typeof mapStyle)}
              options={[
                { id: 'streets', label: 'Streets' },
                { id: 'light', label: 'Light' },
                { id: 'satellite', label: 'Satellite' },
              ]}
            />
          </Row>
          <Row label="Auto-apply persona layers" hint="Turn on recommended data layers when a persona is chosen">
            <Toggle on={autoLayers} onToggle={() => setAutoLayers(v => !v)} />
          </Row>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <Row label="Email alerts" hint="New matches for your saved searches">
            <Toggle on={emailAlerts} onToggle={() => setEmailAlerts(v => !v)} />
          </Row>
          <Row label="Price-drop alerts" hint="When asking rent changes on a saved property">
            <Toggle on={priceDrops} onToggle={() => setPriceDrops(v => !v)} />
          </Row>
          <Row label="Weekly market digest" hint="A Monday summary of new supply in your markets">
            <Toggle on={weeklyDigest} onToggle={() => setWeeklyDigest(v => !v)} />
          </Row>
        </Section>

        {/* Appearance */}
        <Section icon={Palette} title="Appearance">
          <Row label="Reduce motion" hint="Minimise map and panel animations">
            <Toggle on={reduceMotion} onToggle={() => setReduceMotion(v => !v)} />
          </Row>
        </Section>

        {/* Save bar */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button className="px-5 h-11 rounded-full border border-[#CAC4D0] text-[#1D1B20]/60 hover:bg-white transition-colors" style={{ fontSize: 12.5, fontWeight: 700 }}>
            Reset to defaults
          </button>
          <button className="flex items-center gap-2 px-6 h-11 rounded-full bg-[#6750A4] text-white hover:bg-[#4F378B] transition-colors shadow-[0_6px_20px_rgba(103,80,164,0.28)]" style={{ fontSize: 12.5, fontWeight: 700 }}>
            <Check size={15} /> Save changes
          </button>
        </div>

        <p className="text-center mt-8 text-[#1D1B20]/30" style={{ fontSize: 10.5, fontWeight: 500 }}>
          Prototype experience — preferences are not persisted.
        </p>
      </div>
    </div>
  );
}

/* ─── Grouped settings card ─── */
function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-3xl bg-white border border-[#E7E0EC] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E7E0EC]">
        <Icon size={15} className="text-[#6750A4]" />
        <h2 className="text-[#21005D]" style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.01em' }}>{title}</h2>
      </div>
      <div className="divide-y divide-[#F3EDF7]">{children}</div>
    </section>
  );
}

/* ─── One settings row: label + hint on the left, control on the right ─── */
function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <div className="text-[#1D1B20]" style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        {hint && <div className="text-[#1D1B20]/45 mt-0.5" style={{ fontSize: 11.5, fontWeight: 500 }}>{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ─── M3 switch ─── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={`relative w-[52px] h-[32px] rounded-full transition-colors ${on ? 'bg-[#6750A4]' : 'bg-[#E7E0EC] border border-[#CAC4D0]'}`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-all ${
          on ? 'right-1 w-6 h-6 bg-white' : 'left-1.5 w-4 h-4 bg-[#79747E]'
        }`}
      />
    </button>
  );
}

/* ─── M3 segmented control ─── */
function Segmented({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div className="inline-flex p-1 rounded-full bg-[#F3EDF7] border border-[#E7E0EC]">
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-3.5 h-8 rounded-full transition-colors ${
            value === o.id ? 'bg-[#6750A4] text-white shadow-sm' : 'text-[#1D1B20]/55 hover:text-[#21005D]'
          }`}
          style={{ fontSize: 11.5, fontWeight: 700 }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
