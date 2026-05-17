"use client";

import { useEffect } from 'react';

export default function ThemeSync() {
  useEffect(() => {
    const applyTheme = () => {
      const mode = localStorage.getItem('bJournalAppMode') || 'light';
      document.documentElement.classList.toggle('dark', mode === 'dark');
    };

    applyTheme();

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'bJournalAppMode') applyTheme();
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null;
}
