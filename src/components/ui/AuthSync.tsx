"use client";

import { useEffect } from 'react';

export default function AuthSync() {
  useEffect(() => {
    let canceled = false;

    const sync = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const payload = await response.json();
        if (canceled) return;

        if (payload?.user) {
          localStorage.setItem('bJournalUser', JSON.stringify(payload.user));
        } else {
          localStorage.removeItem('bJournalUser');
        }
      } catch {
        if (!canceled) {
          localStorage.removeItem('bJournalUser');
        }
      }
    };

    sync();
    return () => {
      canceled = true;
    };
  }, []);

  return null;
}
