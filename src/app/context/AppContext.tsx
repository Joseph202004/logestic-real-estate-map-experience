import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Property } from '../data/properties';

interface AppState {
  compareList: string[];
  savedProperties: string[];
  toggleCompare: (id: string) => void;
  toggleSaved: (id: string) => void;
  isInCompare: (id: string) => boolean;
  isSaved: (id: string) => boolean;
}

const AppContext = createContext<AppState | null>(null);

/** Read a persisted string array, tolerant of private mode / cleared storage. */
function loadIds(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Persist the shortlist + saved set so they survive a refresh.
  const [compareList, setCompareList] = useState<string[]>(() => loadIds('prologis.compare'));
  const [savedProperties, setSavedProperties] = useState<string[]>(() => loadIds('prologis.saved'));

  useEffect(() => {
    try { localStorage.setItem('prologis.compare', JSON.stringify(compareList)); } catch { /* ignore */ }
  }, [compareList]);
  useEffect(() => {
    try { localStorage.setItem('prologis.saved', JSON.stringify(savedProperties)); } catch { /* ignore */ }
  }, [savedProperties]);

  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedProperties(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const isInCompare = useCallback((id: string) => compareList.includes(id), [compareList]);
  const isSaved = useCallback((id: string) => savedProperties.includes(id), [savedProperties]);

  return (
    <AppContext.Provider value={{ compareList, savedProperties, toggleCompare, toggleSaved, isInCompare, isSaved }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
