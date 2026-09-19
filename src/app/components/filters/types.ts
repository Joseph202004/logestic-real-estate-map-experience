import type { Property } from '../../data/properties';

export type LeaseTermId = 'short' | 'long' | 'flexible' | 'bts';
export type FeatureId = 'cold' | 'solar' | 'ev' | 'rail' | 'automation' | 'racking';
export type PossessionId = Property['availabilityStatus'];
export type CategoryId = 'size' | 'specs' | 'possession' | 'lease' | 'features';

/** Everything the results list filters on, except the free-text query. */
export interface FilterState {
  minSizeSqft: number;
  minClearHeight: number;
  minDockDoors: number;
  minPower: number;
  possession: PossessionId[];
  leaseTerms: LeaseTermId[];
  features: FeatureId[];
}

export const emptyFilters: FilterState = {
  minSizeSqft: 0,
  minClearHeight: 0,
  minDockDoors: 0,
  minPower: 0,
  possession: [],
  leaseTerms: [],
  features: [],
};

/** One removable pill: which category it belongs to and how to undo it. */
export interface ActiveChip {
  key: string;
  category: CategoryId;
  label: string;
  dot?: string;
  clear: (s: FilterState) => FilterState;
}
