const KEYS = {
  profile: 'skinbella.profile',
  answers: 'skinbella.answers',
  auth: 'skinbella.auth',
  checklist: 'skinbella.checklist',
  checklistDate: 'skinbella.checklist.date',
  streak: 'skinbella.streak',
  streakData: 'skinbella.streak.data',
  routineMorning: 'skinbella.routine.morning',
  routineNight: 'skinbella.routine.night',
  routineStepsMorning: 'skinbella.routine.steps.morning',
  routineStepsNight: 'skinbella.routine.steps.night',
  selfieHistory: 'skinbella.selfies',
} as const;

function get<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}
function set(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // QuotaExceededError — clear old selfies/heavy data and retry
    console.warn('[storage] Quota exceeded, clearing old data…');
    try {
      localStorage.removeItem(KEYS.selfieHistory);
      localStorage.removeItem(KEYS.answers);
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('[storage] Still over quota after cleanup');
    }
  }
}

export const storage = {
  saveAnswers: (a: Record<string, unknown>) => set(KEYS.answers, a),
  getAnswers: () => get<Record<string, unknown>>(KEYS.answers),

  saveProfile: (p: unknown) => set(KEYS.profile, p),
  getProfile: () => get<any>(KEYS.profile),

  login: (name: string, email: string, isAdmin = false) => set(KEYS.auth, { name, email, loggedIn: true, isAdmin }),
  logout: () => localStorage.removeItem(KEYS.auth),
  getAuth: () => get<{ name: string; email: string; loggedIn: boolean; isAdmin?: boolean }>(KEYS.auth),
  isLoggedIn: () => get<{ loggedIn: boolean }>(KEYS.auth)?.loggedIn ?? false,
  isAdmin: () => get<{ isAdmin?: boolean }>(KEYS.auth)?.isAdmin ?? false,

  saveChecklist: (items: { id: string; label: string; done: boolean }[]) => {
    // Sanitize before saving
    const safe = Array.isArray(items) ? items.map(i => ({ id: String(i.id), label: String(i.label), done: Boolean(i.done) })) : [];
    set(KEYS.checklist, safe);
  },
  getChecklist: (): { id: string; label: string; done: boolean }[] => {
    const defaultChecklist = [
      { id: '1', label: 'Beber 2L de água 💧', done: false },
      { id: '2', label: 'Aplicar protetor solar ☀️', done: false },
      { id: '3', label: 'Fazer rotina da manhã 🌅', done: false },
      { id: '4', label: 'Fazer rotina da noite 🌙', done: false },
      { id: '5', label: 'Dormir 8 horas 😴', done: false },
      { id: '6', label: 'Evitar açúcar e alimentos processados 🥗', done: false },
    ];

    try {
      // Reset diário: se mudou o dia, zera os itens concluídos
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem(KEYS.checklistDate);
      if (storedDate !== today) {
        localStorage.setItem(KEYS.checklistDate, today);
        const raw = localStorage.getItem(KEYS.checklist);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            const items = Array.isArray(parsed) ? parsed : (parsed?.items ?? []);
            const reset = items
              .filter((i: any) => i && 'id' in i && 'label' in i)
              .map((i: any) => ({ id: String(i.id), label: String(i.label), done: false }));
            if (reset.length > 0) {
              set(KEYS.checklist, reset);
              return reset;
            }
          } catch { /* ignore, fall through to default */ }
        }
        set(KEYS.checklist, defaultChecklist);
        return defaultChecklist;
      }

      const raw = localStorage.getItem(KEYS.checklist);
      if (!raw) {
        set(KEYS.checklist, defaultChecklist);
        return defaultChecklist;
      }
      const parsed = JSON.parse(raw);

      // Normalize: must be array of valid items
      if (!Array.isArray(parsed)) {
        // Try legacy format { items: [...] }
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
          const migrated = parsed.items.filter((i: any) => i && typeof i === 'object' && 'id' in i && 'label' in i)
            .map((i: any) => ({ id: String(i.id), label: String(i.label), done: Boolean(i.done) }));
          if (migrated.length > 0) {
            set(KEYS.checklist, migrated);
            return migrated;
          }
        }
        // Unrecoverable - reset
        set(KEYS.checklist, defaultChecklist);
        return defaultChecklist;
      }

      // Validate each item in array
      const validated = parsed.filter((i: any) => i && typeof i === 'object' && 'id' in i && 'label' in i)
        .map((i: any) => ({ id: String(i.id), label: String(i.label), done: Boolean(i.done) }));

      if (validated.length === 0) {
        set(KEYS.checklist, defaultChecklist);
        return defaultChecklist;
      }

      return validated;
    } catch {
      set(KEYS.checklist, defaultChecklist);
      return defaultChecklist;
    }
  },

  saveStreak: (n: number) => set(KEYS.streak, n),
  getStreak: () => get<number>(KEYS.streak) ?? 0,

  saveRoutineStatus: (type: 'morning' | 'night', done: boolean) => {
    const key = type === 'morning' ? KEYS.routineMorning : KEYS.routineNight;
    set(key, { done, date: new Date().toDateString() });
  },
  getRoutineStatus: (type: 'morning' | 'night') => {
    const key = type === 'morning' ? KEYS.routineMorning : KEYS.routineNight;
    const v = get<{ done: boolean; date: string }>(key);
    if (v && v.date === new Date().toDateString()) return v.done;
    return false;
  },

  saveSelfie: (dataUrl: string) => {
    const history = get<{ date: string; url: string }[]>(KEYS.selfieHistory) ?? [];
    history.push({ date: new Date().toISOString(), url: dataUrl });
    set(KEYS.selfieHistory, history);
  },
  getSelfies: () => get<{ date: string; url: string }[]>(KEYS.selfieHistory) ?? [],

  getLatestSelfie: (): string | null => {
    const selfies = get<{ date: string; url: string }[]>(KEYS.selfieHistory);
    if (selfies && selfies.length > 0) return selfies[selfies.length - 1].url;
    const answers = get<Record<string, unknown>>(KEYS.answers);
    if (answers && typeof answers.selfie === 'string') return answers.selfie;
    return null;
  },

  // Routine Steps (BUG FIX)
  getRoutineSteps: (type: 'morning' | 'night') => {
    const key = type === 'morning' ? KEYS.routineStepsMorning : KEYS.routineStepsNight;
    return get<Record<string, boolean>>(key) ?? {};
  },
  saveRoutineSteps: (type: 'morning' | 'night', steps: Record<string, boolean>) => {
    const key = type === 'morning' ? KEYS.routineStepsMorning : KEYS.routineStepsNight;
    set(key, steps);
  },

  // Streak Data (BUG FIX)
  getStreakData: () => {
    const data = get<{ lastDate: string; completedToday: boolean }>(KEYS.streakData);
    if (!data) {
      return { lastDate: '', completedToday: false };
    }
    // Verificar se é hoje
    const today = new Date().toDateString();
    if (data.lastDate !== today) {
      return { lastDate: data.lastDate, completedToday: false };
    }
    return data;
  },
  incrementStreakIfNewDay: () => {
    const today = new Date().toDateString();
    const streakData = get<{ lastDate: string; completedToday: boolean }>(KEYS.streakData);

    // Se já completou hoje, não incrementa
    if (streakData && streakData.lastDate === today && streakData.completedToday) {
      return false;
    }

    const currentStreak = get<number>(KEYS.streak) ?? 0;
    const newStreak = currentStreak + 1;

    set(KEYS.streak, newStreak);
    set(KEYS.streakData, { lastDate: today, completedToday: true });

    return true;
  },
};
