import {
  Briefcase, Building2, Factory, ShoppingBag, Snowflake, Truck,
} from 'lucide-react';
import type { Property } from '../data/properties';

/** Analytical layers the map can draw. `available: false` ones are declared so
 *  the control can explain the gap rather than render a broken layer (spec §12). */
export type LayerId =
  | 'reach' | 'highway' | 'labor' | 'transit'
  | 'parcel' | 'demand' | 'suppliers' | 'stores' | 'coldChain' | 'rent' | 'risk';

export const layerDefs: Record<LayerId, { label: string; desc: string; available: boolean; color: string }> = {
  reach: { label: 'Delivery reach', desc: 'Isochrone around the selected property', available: true, color: '#6750A4' },
  highway: { label: 'Highway proximity', desc: 'Major interstate corridors', available: true, color: '#6750A4' },
  labor: { label: 'Labor availability', desc: 'Metro workforce size & scores', available: true, color: '#6750A4' },
  transit: { label: 'Intermodal & ports', desc: 'Rail terminals and port facilities', available: true, color: '#21005D' },
  parcel: { label: 'Parcel hubs', desc: 'Carrier sortation facilities', available: true, color: '#E8963A' },
  demand: { label: 'Customer demand', desc: 'Consumer density heatmap', available: true, color: '#C74B78' },
  suppliers: { label: 'Supplier network', desc: 'Upstream supplier locations', available: true, color: '#2E7D5B' },
  stores: { label: 'Store network', desc: 'Your retail locations', available: true, color: '#3E6DB5' },
  coldChain: { label: 'Cold-chain network', desc: 'Refrigerated facilities and reefer plugs', available: true, color: '#1B7A8C' },
  rent: { label: 'Asking-rent heatmap', desc: 'Market rent by submarket', available: true, color: '#B3261E' },
  risk: { label: 'Outage & flood risk', desc: 'Natural hazard exposure', available: true, color: '#8C5000' },
};

/** One line in the "why this location fits" panel. */
export interface MatchSignal {
  ok: boolean;
  text: string;
  /** Contribution to the match score, 0–1 weighted. */
  weight: number;
}

export interface Persona {
  id: PersonaId;
  label: string;
  tagline: string;
  icon: any;
  /** At most three, per spec §5. */
  recommended: LayerId[];
  additional: LayerId[];
  signals: (p: Property) => MatchSignal[];
}

export type PersonaId =
  | 'ecommerce' | '3pl' | 'manufacturer' | 'retailer' | 'coldchain' | 'broker';

const reach = (p: Property) => p.locationSignals.sameDayReach;

export const personas: Persona[] = [
  {
    id: 'ecommerce',
    label: 'E-commerce operator',
    tagline: 'Delivery reach · Drive time · Labor',
    icon: ShoppingBag,
    recommended: ['reach', 'labor', 'parcel'],
    additional: ['demand', 'transit', 'rent'],
    signals: p => [
      { ok: true, text: `${reach(p)} reachable same day`, weight: 0.3 },
      { ok: p.dockDoors >= 40, text: p.dockDoors >= 40 ? `${p.dockDoors} dock doors for parcel throughput` : `Only ${p.dockDoors} dock doors for parcel throughput`, weight: 0.2 },
      { ok: p.locationSignals.laborPoolScore >= 80, text: `Warehouse labor pool ${p.locationSignals.laborPoolScore}/100${p.locationSignals.laborPoolScore >= 80 ? '' : ' — below target'}`, weight: 0.25 },
      { ok: p.essentials.automation, text: p.essentials.automation ? 'Automation ready' : 'No automation fit-out in place', weight: 0.15 },
      { ok: p.availabilityStatus === 'available', text: p.availabilityStatus === 'available' ? 'Available now' : 'Not yet available for occupation', weight: 0.1 },
    ],
  },
  {
    id: '3pl',
    label: '3PL provider',
    tagline: 'Drive time · Intermodal · Multi-market',
    icon: Truck,
    recommended: ['transit', 'reach', 'labor'],
    additional: ['demand', 'rent', 'risk'],
    signals: p => [
      { ok: p.locationSignals.intermodalDistanceMiles != null && p.locationSignals.intermodalDistanceMiles <= 20,
        text: p.locationSignals.intermodalDistanceMiles != null
          ? `Intermodal terminal ${p.locationSignals.intermodalDistanceMiles} mi away`
          : 'No intermodal terminal recorded', weight: 0.25 },
      { ok: p.leaseTermOptions.length >= 3, text: `${p.leaseTermOptions.length} lease term option${p.leaseTermOptions.length === 1 ? '' : 's'}${p.leaseTermOptions.length >= 3 ? '' : ' — limited flexibility'}`, weight: 0.2 },
      { ok: p.railAccess, text: p.railAccess ? 'Rail served' : 'No rail spur', weight: 0.15 },
      { ok: true, text: `Serves ${reach(p)} same day`, weight: 0.25 },
      { ok: p.dockDoors >= 36, text: `${p.dockDoors} docks${p.dockDoors >= 36 ? ' for multi-client flow' : ' — limited for multi-client flow'}`, weight: 0.15 },
    ],
  },
  {
    id: 'manufacturer',
    label: 'Manufacturer',
    tagline: 'Power · Rail · Skilled labor',
    icon: Factory,
    recommended: ['labor', 'transit', 'suppliers'],
    additional: ['risk', 'rent', 'reach'],
    signals: p => [
      { ok: (p.powerCapacityAmps || 0) >= 6000,
        text: !p.powerCapacityAmps ? 'Power capacity not stated'
          : (p.powerCapacityAmps >= 6000
            ? `${p.powerCapacityAmps.toLocaleString()}A power capacity`
            : `${p.powerCapacityAmps.toLocaleString()}A — below heavy-manufacturing draw`), weight: 0.35 },
      { ok: p.railAccess, text: p.railAccess ? 'Rail spur on site' : 'No rail spur for inbound material', weight: 0.2 },
      { ok: p.locationSignals.laborPoolScore >= 78, text: `Skilled labor pool ${p.locationSignals.laborPoolScore}/100${p.locationSignals.laborPoolScore >= 78 ? '' : ' — below target'}`, weight: 0.2 },
      { ok: p.btsAvailable, text: p.btsAvailable ? 'Build-to-suit available' : 'No build-to-suit option', weight: 0.15 },
      { ok: (p.landSizeAcres || 0) >= 15, text: !p.landSizeAcres ? 'Land area not stated' : `${p.landSizeAcres} acres${p.landSizeAcres >= 15 ? ' with expansion room' : ' — little expansion room'}`, weight: 0.1 },
    ],
  },
  {
    id: 'retailer',
    label: 'Retailer / distributor',
    tagline: 'Store network · Replenishment · Coverage',
    icon: Building2,
    recommended: ['reach', 'demand', 'stores'],
    additional: ['labor', 'transit', 'rent'],
    signals: p => [
      { ok: true, text: `Replenishment reach: ${reach(p)}`, weight: 0.3 },
      { ok: p.sizeSqft >= 200000, text: `${p.sizeSqft.toLocaleString()} SF${p.sizeSqft >= 200000 ? ' for seasonal inventory' : ' — tight for seasonal peaks'}`, weight: 0.25 },
      { ok: p.clearHeightFt >= 36, text: `${p.clearHeightFt} ft clear${p.clearHeightFt >= 36 ? ' for racked storage' : ' — limits racking height'}`, weight: 0.2 },
      { ok: p.availabilityStatus === 'available', text: p.availabilityStatus === 'available' ? 'Available now' : 'Timing may miss peak season', weight: 0.15 },
      { ok: p.essentials.racking, text: p.essentials.racking ? 'Racking in place' : 'Racking not included', weight: 0.1 },
    ],
  },
  {
    id: 'coldchain',
    label: 'Cold-chain operator',
    tagline: 'Temperature · Power reliability · Reefer access',
    icon: Snowflake,
    recommended: ['coldChain', 'reach', 'labor'],
    additional: ['risk', 'transit', 'rent'],
    signals: p => [
      { ok: p.coldStorageReady, text: p.coldStorageReady ? 'Cold-storage ready' : 'Not cold-storage ready — conversion required', weight: 0.4 },
      { ok: (p.powerCapacityAmps || 0) >= 6000,
        text: !p.powerCapacityAmps ? 'Power capacity not stated'
          : (p.powerCapacityAmps >= 6000
            ? `${p.powerCapacityAmps.toLocaleString()}A supports refrigeration load`
            : `${p.powerCapacityAmps.toLocaleString()}A may be tight for refrigeration load`), weight: 0.25 },
      { ok: p.essentials.energy, text: p.essentials.energy ? 'Energy package available' : 'No energy package', weight: 0.15 },
      { ok: true, text: `Distribution reach: ${reach(p)}`, weight: 0.2 },
    ],
  },
  {
    id: 'broker',
    label: 'Broker / tenant rep',
    tagline: 'Availability · Match score · Asking rent',
    icon: Briefcase,
    recommended: ['reach', 'rent', 'demand'],
    additional: ['labor', 'transit', 'risk'],
    signals: p => [
      { ok: p.availabilityStatus === 'available', text: `Status: ${p.availabilityStatus.replace('_', ' ')}`, weight: 0.25 },
      { ok: p.rentPsf != null, text: p.rentPsf ? `Asking $${p.rentPsf}/SF` : 'Rent on request — harder to benchmark', weight: 0.25 },
      { ok: p.sustainability.certification != null, text: p.sustainability.certification ? `${p.sustainability.certification} certified` : 'No sustainability certification', weight: 0.15 },
      { ok: p.leaseTermOptions.length >= 3, text: `${p.leaseTermOptions.length} lease structures to present`, weight: 0.2 },
      { ok: true, text: `Same-day reach: ${reach(p)}`, weight: 0.15 },
    ],
  },
];

export const defaultPersona = personas[0];

export function getPersona(id: PersonaId | null | undefined): Persona {
  return personas.find(p => p.id === id) || defaultPersona;
}

/** Home page sends its own ids; map them onto the persona set. */
export function personaFromParam(param: string | null): Persona {
  if (!param) return defaultPersona;
  const map: Record<string, PersonaId> = {
    'ecommerce-operator': 'ecommerce',
    '3pl-provider': '3pl',
    'manufacturer': 'manufacturer',
    'retailer': 'retailer',
    'broker': 'broker',
    'cold-chain': 'coldchain',
  };
  return getPersona(map[param] ?? (param as PersonaId));
}

/** Weighted share of satisfied signals, as a whole percentage. */
export function matchScore(persona: Persona, property: Property): number {
  const signals = persona.signals(property);
  const total = signals.reduce((s, x) => s + x.weight, 0) || 1;
  const met = signals.reduce((s, x) => s + (x.ok ? x.weight : 0), 0);
  return Math.round((met / total) * 100);
}
