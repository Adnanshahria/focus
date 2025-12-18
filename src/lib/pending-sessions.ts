const PENDING_SESSIONS_KEY = 'focusflow_pending_sessions';

export interface PendingSession {
    id: string;
    userId: string;
    sessionStartTime: number;
    endTime: number;
    durationMinutes: number;
    type: 'pomodoro' | 'shortBreak' | 'longBreak';
    completed: boolean;
    createdAt: number;
}

export function getPendingSessions(): PendingSession[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(PENDING_SESSIONS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function addPendingSession(session: Omit<PendingSession, 'id' | 'createdAt'>) {
    if (typeof window === 'undefined') return;
    const sessions = getPendingSessions();
    sessions.push({
        ...session,
        id: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
    });
    localStorage.setItem(PENDING_SESSIONS_KEY, JSON.stringify(sessions));
}

export function removePendingSession(id: string) {
    if (typeof window === 'undefined') return;
    const sessions = getPendingSessions().filter(s => s.id !== id);
    localStorage.setItem(PENDING_SESSIONS_KEY, JSON.stringify(sessions));
}

export function clearPendingSessions() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PENDING_SESSIONS_KEY);
}
