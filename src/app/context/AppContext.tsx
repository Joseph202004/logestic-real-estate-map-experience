import React, { createContext, useContext, useState, useCallback } from 'react';
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);

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
