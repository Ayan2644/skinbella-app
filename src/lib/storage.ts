const KEYS = {
  profile: 'skinbella.profile',
  answers: 'skinbella.answers',
  auth: 'skinbella.auth',
  checklist: 'skinbella.checklist',
  streak: 'skinbella.streak',
  routineMorning: 'skinbella.routine.morning',
  routineNight: 'skinbella.routine.night',
  selfieHistory: 'skinbella.selfies',
} as const;

function get<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}
function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  saveAnswers: (a: Record<string, unknown>) => set(KEYS.answers, a),
  getAnswers: () => get<Record<string, unknown>>(KEYS.answers),

  saveProfile: (p: unknown) => set(KEYS.profile, p),
  getProfile: () => get<any>(KEYS.profile),

  login: (name: string, email: string) => set(KEYS.auth, { name, email, loggedIn: true }),
  logout: () => localStorage.removeItem(KEYS.auth),
  getAuth: () => get<{ name: string; email: string; loggedIn: boolean }>(KEYS.auth),
  isLoggedIn: () => get<{ loggedIn: boolean }>(KEYS.auth)?.loggedIn ?? false,

  saveChecklist: (items: { id: string; label: string; done: boolean }[]) => set(KEYS.checklist, items),
  getChecklist: () => get<{ id: string; label: string; done: boolean }[]>(KEYS.checklist),

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
};
