import {
  Building2, ArrowUpRight, Truck, Zap, Clock, CalendarClock, Snowflake, Sun, Plug, Train, Package,
} from 'lucide-react';
import type { Property } from '../../data/properties';
import type { CategoryId, FeatureId, LeaseTermId, PossessionId } from './types';

/** Left-rail categories, in display order. */
export const categoryDefs: { id: CategoryId; label: string; icon: any; blurb: string }[] = [
  { id: 'size', label: 'Building Size', icon: Building2, blurb: 'Set the minimum footprint you need.' },
  { id: 'specs', label: 'Logistics Specs', icon: ArrowUpRight, blurb: 'Clear height, dock doors and power capacity.' },
  { id: 'possession', label: 'Possession Status', icon: CalendarClock, blurb: 'When the facility can be occupied.' },
  { id: 'lease', label: 'Lease Terms', icon: Clock, blurb: 'How long — and how flexibly — you want to commit.' },
  { id: 'features', label: 'Facility Features', icon: Snowflake, blurb: 'Capabilities the building must already have.' },
];

/** Possession dots match the map legend so both read as one vocabulary. */
export const possessionDefs: { id: PossessionId; label: string; dot: string }[] = [
  { id: 'available', label: 'Available Now', dot: '#2E7D32' },
  { id: 'under_negotiation', label: 'Under Negotiation', dot: '#8C5000' },
  { id: 'coming_soon', label: 'Coming Soon', dot: '#21005D' },
];

/** The dataset stores raw term lengths ('3 Year', …) plus a btsAvailable flag. */
export const leaseTermDefs: { id: LeaseTermId; label: string; hint: string; matches: (p: Property) => boolean }[] = [
  { id: 'short', label: 'Short Term', hint: '3 years or less', matches: p => p.leaseTermOptions.some(t => parseInt(t, 10) <= 3) },
  { id: 'long', label: 'Long Term', hint: '10 years or more', matches: p => p.leaseTermOptions.some(t => parseInt(t, 10) >= 10) },
  { id: 'flexible', label: 'Flexible', hint: '3+ term options', matches: p => p.leaseTermOptions.length >= 3 },
  { id: 'bts', label: 'Build-to-Suit', hint: 'Built to your spec', matches: p => p.btsAvailable },
];

export const featureDefs: { id: FeatureId; label: string; icon: any; matches: (p: Property) => boolean }[] = [
  { id: 'cold', label: 'Cold Storage', icon: Snowflake, matches: p => p.coldStorageReady },
  { id: 'solar', label: 'Solar', icon: Sun, matches: p => p.sustainability.solarReady },
  { id: 'ev', label: 'EV Ready', icon: Plug, matches: p => p.sustainability.evReady },
  { id: 'rail', label: 'Rail Access', icon: Train, matches: p => p.railAccess },
  { id: 'automation', label: 'Automation', icon: Zap, matches: p => p.essentials.automation },
  { id: 'racking', label: 'Racking', icon: Package, matches: p => p.essentials.racking },
];

/** Compact SF label, e.g. 250K SF+ */
export function formatSqftShort(n: number): string {
  return `${n >= 1000 ? `${n / 1000}K` : n} SF+`;
}

export { Truck };
