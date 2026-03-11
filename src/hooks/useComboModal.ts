import { useState, useEffect } from 'react';

const PAGE_SEEN_KEY    = 'skinbella.combo.lastSeen';   // localStorage: páginas vistas hoje
const SESSION_LAST_KEY = 'skinbella.combo.sessionLast'; // sessionStorage: última exibição nesta sessão

// Intervalo mínimo entre exibições em páginas diferentes (evita spam ao navegar rápido)
const MIN_SESSION_INTERVAL_MS = 15 * 60 * 1000; // 15 min

function getTodayPageKey(page: string) {
  return `${page}:${new Date().toDateString()}`;
}

function wasPageSeenToday(page: string): boolean {
  try {
    const stored = localStorage.getItem(PAGE_SEEN_KEY);
    const seen: string[] = stored ? JSON.parse(stored) : [];
    return seen.includes(getTodayPageKey(page));
  } catch {
    return false;
  }
}

function markPageAsSeen(page: string) {
  try {
    const stored = localStorage.getItem(PAGE_SEEN_KEY);
    const seen: string[] = stored ? JSON.parse(stored) : [];
    const key = getTodayPageKey(page);
    if (!seen.includes(key)) {
      seen.push(key);
      localStorage.setItem(PAGE_SEEN_KEY, JSON.stringify(seen));
    }
  } catch { /* ignore */ }
}

function getSessionLastShown(): number {
  try {
    return parseInt(sessionStorage.getItem(SESSION_LAST_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function setSessionLastShown() {
  try {
    sessionStorage.setItem(SESSION_LAST_KEY, String(Date.now()));
  } catch { /* ignore */ }
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useComboModal(page: string, delayMs = 5000) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // 1. Já mostrou nesta página hoje? Não mostra de novo.
    if (wasPageSeenToday(page)) return;

    // 2. Mostrou em outra página nos últimos 15 min nesta sessão? Aguarda.
    const lastShown = getSessionLastShown();
    if (lastShown > 0 && Date.now() - lastShown < MIN_SESSION_INTERVAL_MS) return;

    // 3. Tudo ok — agendar exibição após o delay da página
    const timer = setTimeout(() => {
      setOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [page, delayMs]);

  const close = () => {
    setOpen(false);
    markPageAsSeen(page);
    setSessionLastShown();
  };

  const openModal = () => setOpen(true);

  return { open, close, openModal };
}
