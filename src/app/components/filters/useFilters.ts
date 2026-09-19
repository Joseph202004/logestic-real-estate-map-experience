import { useCallback, useMemo, useState } from 'react';
import type { Property } from '../../data/properties';
import { featureDefs, formatSqftShort, leaseTermDefs, possessionDefs } from './definitions';
import { emptyFilters } from './types';
import type { ActiveChip, CategoryId, FeatureId, FilterState, LeaseTermId, PossessionId } from './types';

/** Owns filter state, the predicate over a property, and the active-chip list. */
export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const patch = useCallback(
    (p: Partial<FilterState>) => setFilters(prev => ({ ...prev, ...p })),
    []
  );

  const toggleInList = useCallback(
    <K extends 'possession' | 'leaseTerms' | 'features'>(key: K, id: FilterState[K][number]) =>
      setFilters(prev => {
        const list = prev[key] as string[];
        const next = list.includes(id as string)
          ? list.filter(x => x !== id)
          : [...list, id as string];
        return { ...prev, [key]: next } as FilterState;
      }),
    []
  );

  const clearAll = useCallback(() => setFilters(emptyFilters), []);

  const matches = useCallback(
    (p: Property) => {
      if (p.sizeSqft < filters.minSizeSqft) return false;
      if (p.clearHeightFt < filters.minClearHeight) return false;
      if (p.dockDoors < filters.minDockDoors) return false;
      if (filters.minPower > 0 && (p.powerCapacityAmps || 0) < filters.minPower) return false;

      // Possession and lease terms widen the net (OR); features narrow it (AND).
      if (filters.possession.length > 0 && !filters.possession.includes(p.availabilityStatus)) return false;
      if (filters.leaseTerms.length > 0) {
        const picked = leaseTermDefs.filter(d => filters.leaseTerms.includes(d.id));
        if (!picked.some(d => d.matches(p))) return false;
      }
      if (!featureDefs.filter(d => filters.features.includes(d.id)).every(d => d.matches(p))) return false;

      return true;
    },
    [filters]
  );

  const chips = useMemo<ActiveChip[]>(() => {
    const out: ActiveChip[] = [];

    if (filters.minSizeSqft > 0) {
      out.push({ key: 'size', category: 'size', label: formatSqftShort(filters.minSizeSqft), clear: s => ({ ...s, minSizeSqft: 0 }) });
    }
    if (filters.minClearHeight > 0) {
      out.push({ key: 'clear', category: 'specs', label: `${filters.minClearHeight}'+ Clear`, clear: s => ({ ...s, minClearHeight: 0 }) });
    }
    if (filters.minDockDoors > 0) {
      out.push({ key: 'docks', category: 'specs', label: `${filters.minDockDoors}+ Docks`, clear: s => ({ ...s, minDockDoors: 0 }) });
    }
    if (filters.minPower > 0) {
      out.push({ key: 'power', category: 'specs', label: `${filters.minPower.toLocaleString()}A+ Power`, clear: s => ({ ...s, minPower: 0 }) });
    }
    possessionDefs.filter(d => filters.possession.includes(d.id)).forEach(d =>
      out.push({ key: `poss-${d.id}`, category: 'possession', label: d.label, dot: d.dot, clear: s => ({ ...s, possession: s.possession.filter(x => x !== d.id) }) })
    );
    leaseTermDefs.filter(d => filters.leaseTerms.includes(d.id)).forEach(d =>
      out.push({ key: `lease-${d.id}`, category: 'lease', label: d.label, clear: s => ({ ...s, leaseTerms: s.leaseTerms.filter(x => x !== d.id) }) })
    );
    featureDefs.filter(d => filters.features.includes(d.id)).forEach(d =>
      out.push({ key: `feat-${d.id}`, category: 'features', label: d.label, clear: s => ({ ...s, features: s.features.filter(x => x !== d.id) }) })
    );

    return out;
  }, [filters]);

  const clearChip = useCallback((chip: ActiveChip) => setFilters(prev => chip.clear(prev)), []);

  const chipsByCategory = useMemo(() => {
    const map = {} as Record<CategoryId, ActiveChip[]>;
    chips.forEach(c => { (map[c.category] ||= []).push(c); });
    return map;
  }, [chips]);

  return {
    filters,
    patch,
    togglePossession: (id: PossessionId) => toggleInList('possession', id),
    toggleLeaseTerm: (id: LeaseTermId) => toggleInList('leaseTerms', id),
    toggleFeature: (id: FeatureId) => toggleInList('features', id),
    clearAll,
    clearChip,
    matches,
    chips,
    chipsByCategory,
    activeCount: chips.length,
  };
}

export type UseFilters = ReturnType<typeof useFilters>;
