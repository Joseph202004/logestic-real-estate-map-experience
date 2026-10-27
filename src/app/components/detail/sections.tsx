import { useState } from 'react';
import {
  ArrowUpRight, Building2, Calendar, ChevronLeft, ChevronRight, Clock, Leaf,
  MapPin, Navigation, Package, Phone, Plug, Snowflake, Sparkles, Sun, Train, Truck, Users, Zap,
} from 'lucide-react';
import { formatSqft, getStatusLabel } from '../../data/properties';
import type { Property } from '../../data/properties';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const DETAIL_FONT = '"Google Sans", Figtree, Roboto, sans-serif';

const STATUS_COLOR: Record<Property['availabilityStatus'], string> = {
  available: '#2E7D32',
  under_negotiation: '#8C5000',
  coming_soon: '#21005D',
};

/** Card wrapper shared by every panel below. */
export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-2xl border border-[#E7E0EC] ${className}`}>
      {children}
    </section>
  );
}

export function PanelTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-[#21005D]" style={{ fontSize: 14, fontWeight: 800 }}>{children}</h3>
      {hint && <p className="text-[#1D1B20]/45" style={{ fontSize: 11, fontWeight: 500 }}>{hint}</p>}
    </div>
  );
}

/* ── Title row: address, asking rent, and the headline spec icons ── */
export function SummaryHeader({
  property,
  onOpenFullPage,
  onContact,
}: {
  property: Property;
  onOpenFullPage: () => void;
  onContact: () => void;
}) {
  const specs = [
    { icon: Building2, value: formatSqft(property.sizeSqft) },
    { icon: ArrowUpRight, value: `${property.clearHeightFt}' clear` },
    { icon: Truck, value: `${property.dockDoors} docks` },
    { icon: Zap, value: property.powerCapacityAmps ? `${property.powerCapacityAmps.toLocaleString()}A` : 'Power TBC' },
  ];

  return (
    <div className="flex items-start justify-between gap-6 flex-wrap">
      <div className="min-w-0">
        <h2 className="text-[#21005D]" style={{ fontSize: 19, fontWeight: 800 }}>{property.name}</h2>
        <p className="flex items-center gap-1.5 text-[#1D1B20]/55 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
          <MapPin size={12} />
          {property.market}, {property.submarket} · {property.country}
        </p>

        <p className="text-[#2E7D32] mt-1.5" style={{ fontSize: 13, fontWeight: 700 }}>
          {property.rentPsf ? `Asking $${property.rentPsf}/SF` : 'Pricing on request'}
          <span className="text-[#1D1B20]/40" style={{ fontWeight: 500 }}>
            {' '}· {getStatusLabel(property.availabilityStatus)}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
          {specs.map(s => (
            <span key={s.value} className="inline-flex items-center gap-1.5 text-[#1D1B20]/70" style={{ fontSize: 11.5, fontWeight: 600 }}>
              <s.icon size={13} className="text-[#6750A4]" />
              {s.value}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-stretch gap-2">
        <button
          onClick={onContact}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E7D32] text-white rounded-xl hover:brightness-95 transition-all"
          style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.02em' }}
        >
          <Phone size={13} /> CONTACT LEASING TEAM
        </button>
        <button
          onClick={onOpenFullPage}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#E7E0EC] text-[#21005D] rounded-xl hover:border-[#6750A4] transition-colors"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.02em' }}
        >
          OPEN FULL PROPERTY PAGE <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Gallery with paging arrows and dots ── */
export function Gallery({ property }: { property: Property }) {
  const [index, setIndex] = useState(0);
  const images = property.images.length ? property.images : [''];
  const go = (d: number) => setIndex(i => (i + d + images.length) % images.length);

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#E7E0EC] h-[240px]">
      <ImageWithFallback src={images[index]} alt={property.name} className="w-full h-full object-cover" />

      <span
        className="absolute top-3 left-3 inline-flex items-center gap-1.5 pl-2 pr-2.5 h-[22px] rounded-full bg-white/95 text-[#21005D]"
        style={{ fontSize: 10, fontWeight: 700 }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[property.availabilityStatus] }} />
        {getStatusLabel(property.availabilityStatus)}
      </span>

      {images.length > 1 && (
        <>
          <button onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white" aria-label="Previous image">
            <ChevronLeft size={14} className="text-[#21005D]" />
          </button>
          <button onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white" aria-label="Next image">
            <ChevronRight size={14} className="text-[#21005D]" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/45'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── The metric grid beside the gallery ── */
export function KeyMetrics({ property }: { property: Property }) {
  const metrics = [
    { icon: Building2, label: 'Building size', value: formatSqft(property.sizeSqft) },
    { icon: Clock, label: 'Available from', value: new Date(property.availableFrom).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
    { icon: Truck, label: 'Same-day reach', value: property.locationSignals.sameDayReach },
    { icon: Users, label: 'Labor pool score', value: `${property.locationSignals.laborPoolScore}/100` },
    { icon: Navigation, label: 'Highway access', value: property.locationSignals.highwayAccess },
    { icon: Calendar, label: 'Lease terms', value: property.leaseTermOptions.join(', ') },
  ];

  return (
    <div>
      <h3 className="text-[#21005D] mb-1" style={{ fontSize: 14, fontWeight: 800 }}>Operational Fit</h3>
      <p className="text-[#1D1B20]/55 mb-4" style={{ fontSize: 11.5, fontWeight: 500, lineHeight: 1.6 }}>
        {property.bestFor.length
          ? `Suited to ${property.bestFor.join(', ').toLowerCase()}.`
          : 'A logistics facility matched to your operating profile.'}
        {' '}Specifications below reflect the current availability.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
        {metrics.map(m => (
          <div key={m.label}>
            <div className="flex items-center gap-1.5 text-[#1D1B20]/45 mb-0.5" style={{ fontSize: 10, fontWeight: 600 }}>
              <m.icon size={11} className="text-[#6750A4]" />
              {m.label}
            </div>
            <div className="text-[#21005D] truncate" style={{ fontSize: 13, fontWeight: 800 }} title={m.value}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Indicative cost band, echoing the reference's "Potential value" row ── */
export function RentBand({ property }: { property: Property }) {
  const base = property.rentPsf;
  if (!base) return null;

  const annual = (psf: number) => `$${Math.round(psf * property.sizeSqft).toLocaleString()}`;
  const bands = [
    { label: 'Low range', value: `$${(base * 0.92).toFixed(2)}/SF`, sub: annual(base * 0.92) },
    { label: 'Asking', value: `$${base.toFixed(2)}/SF`, sub: annual(base) },
    { label: 'High range', value: `$${(base * 1.08).toFixed(2)}/SF`, sub: annual(base * 1.08) },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4 mt-4 border-t border-[#E7E0EC]">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#6750A4]/10 flex items-center justify-center">
          <Sparkles size={14} className="text-[#6750A4]" />
        </span>
        <div>
          <div className="text-[#21005D]" style={{ fontSize: 12, fontWeight: 800 }}>Indicative cost</div>
          <span className="inline-block px-1.5 py-0.5 bg-[#2E7D32]/10 text-[#2E7D32] rounded" style={{ fontSize: 9, fontWeight: 700 }}>
            ANNUAL BASE RENT
          </span>
        </div>
      </div>

      {bands.map(b => (
        <div key={b.label}>
          <div className="text-[#1D1B20]/45" style={{ fontSize: 10, fontWeight: 600 }}>{b.label}</div>
          <div className="text-[#21005D]" style={{ fontSize: 13, fontWeight: 800 }}>{b.value}</div>
          <div className="text-[#1D1B20]/40" style={{ fontSize: 10, fontWeight: 500 }}>{b.sub}/yr</div>
        </div>
      ))}
    </div>
  );
}

/* ── Essentials + sustainability, the reference's "property information" ── */
export function EssentialsPanel({ property }: { property: Property }) {
  const items = [
    { icon: Package, label: 'Racking', on: property.essentials.racking },
    { icon: Zap, label: 'Automation', on: property.essentials.automation },
    { icon: Sun, label: 'Energy', on: property.essentials.energy },
    { icon: Plug, label: 'EV charging', on: property.essentials.evCharging },
    { icon: Truck, label: 'Move-in services', on: property.essentials.moveInMoveOut },
    { icon: Users, label: 'Workforce', on: property.essentials.workforce },
    { icon: Snowflake, label: 'Cold storage', on: property.coldStorageReady },
    { icon: Train, label: 'Rail access', on: property.railAccess },
  ];

  return (
    <Panel className="p-5">
      <PanelTitle hint="Available during search, not after deal close.">Prologis Essentials</PanelTitle>
      <div className="grid grid-cols-2 gap-2">
        {items.map(i => (
          <div
            key={i.label}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border ${i.on ? 'border-[#6750A4]/30 bg-[#6750A4]/5' : 'border-[#E7E0EC] opacity-45'}`}
          >
            <i.icon size={13} className={i.on ? 'text-[#6750A4]' : 'text-[#1D1B20]/40'} />
            <span className={i.on ? 'text-[#6750A4]' : 'text-[#1D1B20]/50'} style={{ fontSize: 10.5, fontWeight: 700 }}>
              {i.label}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── Scored bars, standing in for the reference's market-insight charts ── */
export function InsightsPanel({ property }: { property: Property }) {
  const scores = [
    { label: 'Carbon score', value: property.sustainability.carbonScore, color: '#2E7D32' },
    { label: 'Energy score', value: property.sustainability.energyScore, color: '#6750A4' },
    { label: 'Labor pool', value: property.locationSignals.laborPoolScore, color: '#21005D' },
  ];

  const distances = [
    property.locationSignals.airportDistanceMiles != null && { label: 'Airport', value: `${property.locationSignals.airportDistanceMiles} mi` },
    property.locationSignals.seaportDistanceMiles != null && { label: 'Seaport', value: `${property.locationSignals.seaportDistanceMiles} mi` },
    property.locationSignals.intermodalDistanceMiles != null && { label: 'Intermodal', value: `${property.locationSignals.intermodalDistanceMiles} mi` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Panel className="p-5">
      <PanelTitle hint={`How ${property.market} scores for this facility.`}>Market insights</PanelTitle>

      <div className="space-y-3.5">
        {scores.map(s => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[#1D1B20]/55" style={{ fontSize: 10.5, fontWeight: 600 }}>{s.label}</span>
              <span className="text-[#21005D]" style={{ fontSize: 11.5, fontWeight: 800 }}>{s.value}/100</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#E7E0EC] overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {distances.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 mt-4 border-t border-[#E7E0EC]">
          {distances.map(d => (
            <div key={d.label}>
              <div className="text-[#1D1B20]/45" style={{ fontSize: 10, fontWeight: 600 }}>{d.label}</div>
              <div className="text-[#21005D]" style={{ fontSize: 12, fontWeight: 800 }}>{d.value}</div>
            </div>
          ))}
        </div>
      )}

      {property.sustainability.certification && (
        <div className="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full" style={{ fontSize: 10, fontWeight: 700 }}>
          <Leaf size={11} /> {property.sustainability.certification}
        </div>
      )}
    </Panel>
  );
}
