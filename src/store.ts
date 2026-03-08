import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Dialect = 'ASL' | 'BSL' | 'ISL';

interface AppState {
    dialect: Dialect;
    setDialect: (dialect: Dialect) => void;

    streak: number;
    lastPlayedDate: string | null;
    lessonsCompletedToday: number;
    updateStreak: () => void;

    xp: number;
    addXp: (amount: number) => void;

    achievements: string[];
    unlockAchievement: (id: string) => void;

    completeLesson: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            dialect: 'ASL',
            setDialect: (dialect) => set({ dialect }),

            streak: 0,
            lastPlayedDate: null,
            lessonsCompletedToday: 0,
            updateStreak: () => {
                const today = new Date().toDateString();
                const { lastPlayedDate, streak } = get();

                if (lastPlayedDate !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (lastPlayedDate === yesterday.toDateString()) {
                        // Consecutive day
                        set({ streak: streak + 1, lastPlayedDate: today, lessonsCompletedToday: 0 });
                    } else {
                        // Streak broken or first time
                        set({ streak: 1, lastPlayedDate: today, lessonsCompletedToday: 0 });
                    }
                }
            },

            xp: 0,
            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            achievements: [],
            unlockAchievement: (id) => {
                const { achievements } = get();
                if (!achievements.includes(id)) {
                    set({ achievements: [...achievements, id] });
                }
            },

            completeLesson: () => {
                set((state) => ({
                    lessonsCompletedToday: state.lessonsCompletedToday + 1,
                    lastPlayedDate: new Date().toDateString()
                }));
            }
        }),
        {
            name: 'mano-ai-gamification-storage',
        }
    )
);
