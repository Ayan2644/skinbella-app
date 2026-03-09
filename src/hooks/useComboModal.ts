import { useState, useEffect } from 'react';

const STORAGE_KEY = 'skinbella.combo.lastSeen';

function getTodayKey(page: string) {
  return `${page}:${new Date().toDateString()}`;
}

export function useComboModal(page: string, delayMs = 4000) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = getTodayKey(page);
    const stored = localStorage.getItem(STORAGE_KEY);
    let seen: string[] = [];
    try { seen = stored ? JSON.parse(stored) : []; } catch { seen = []; }

    if (seen.includes(key)) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [page, delayMs]);

  const close = () => {
    setOpen(false);
    const key = getTodayKey(page);
    const stored = localStorage.getItem(STORAGE_KEY);
    let seen: string[] = [];
    try { seen = stored ? JSON.parse(stored) : []; } catch { seen = []; }
    if (!seen.includes(key)) {
      seen.push(key);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
    }
  };

  const openModal = () => setOpen(true);

  return { open, close, openModal };
}
