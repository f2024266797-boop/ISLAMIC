import { create } from 'zustand';
import { storageService, KEYS } from '../services/storageService';
import { format, subDays, parseISO, isSameDay, differenceInDays } from 'date-fns';
import { DEFAULT_HABITS, LEVELS } from '../constants/islamicContent';

/**
 * Normalizes a date to YYYY-MM-DD string for consistent keys
 */
const getDayKey = (date = new Date()) => format(date, 'yyyy-MM-dd');

const useHabitStore = create((set, get) => ({
  habits: DEFAULT_HABITS,
  completionHistory: {}, // { '2024-04-24': [habitId1, habitId2] }
  streaks: {}, // { habitId: 5 }
  totalPoints: 0,
  isLoaded: false,

  loadData: async () => {
    try {
      const habits = await storageService.load(KEYS.HABITS, DEFAULT_HABITS);
      const history = await storageService.load(KEYS.COMPLETION_HISTORY, {});
      const streaks = await storageService.load(KEYS.STREAKS, {});
      const points = await storageService.load(KEYS.TOTAL_POINTS, 0);

      set({ habits, completionHistory: history, streaks, totalPoints: points, isLoaded: true });
      
      // Auto-validate streaks on load (handle missed days)
      get().validateStreaks();
    } catch (error) {
      console.error('[HabitStore] Load Error:', error);
      set({ isLoaded: true }); // Still allow app to run
    }
  },

  /**
   * Validates and updates streaks based on missed days.
   * Resets streaks to 0 if a habit was not completed yesterday (and not today).
   */
  validateStreaks: () => {
    const { habits, completionHistory, streaks } = get();
    const yesterday = getDayKey(subDays(new Date(), 1));
    const today = getDayKey();
    
    let newStreaks = { ...streaks };
    let changed = false;

    habits.forEach(habit => {
      const completedYesterday = (completionHistory[yesterday] || []).includes(habit.id);
      const completedToday = (completionHistory[today] || []).includes(habit.id);
      
      // If missed yesterday AND not completed today, streak is broken
      // Exception: If they just started today, don't reset
      if (!completedYesterday && !completedToday && (newStreaks[habit.id] || 0) > 0) {
        newStreaks[habit.id] = 0;
        changed = true;
      }
    });

    if (changed) {
      set({ streaks: newStreaks });
      storageService.save(KEYS.STREAKS, newStreaks);
    }
  },

  toggleHabit: async (habitId) => {
    const { habits, completionHistory, streaks, totalPoints } = get();
    const today = getDayKey();
    const yesterday = getDayKey(subDays(new Date(), 1));
    
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const currentDayCompletions = completionHistory[today] || [];
    const isCompleted = currentDayCompletions.includes(habitId);

    // If already completed, don't allow unchecking (as per user request)
    if (isCompleted) return;

    let newHistory = { ...completionHistory };
    let newStreaks = { ...streaks };
    let newPoints = totalPoints;

    // Check habit
    newHistory[today] = [...currentDayCompletions, habitId];
    newPoints = totalPoints + habit.points;
    
    const completedYesterday = (completionHistory[yesterday] || []).includes(habitId);
    newStreaks[habitId] = completedYesterday ? (streaks[habitId] || 0) + 1 : 1;

    set({ completionHistory: newHistory, streaks: newStreaks, totalPoints: newPoints });
    
    // Batch save for efficiency
    await Promise.all([
      storageService.save(KEYS.COMPLETION_HISTORY, newHistory),
      storageService.save(KEYS.STREAKS, newStreaks),
      storageService.save(KEYS.TOTAL_POINTS, newPoints)
    ]);
  },

  addCustomHabit: async (name) => {
    const { habits } = get();
    const newHabit = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      nameAr: '',
      icon: '⭐',
      category: 'lifestyle',
      points: 10,
    };

    const newHabits = [...habits, newHabit];
    set({ habits: newHabits });
    await storageService.save(KEYS.HABITS, newHabits);
  },

  addPoints: async (amount) => {
    const { totalPoints } = get();
    const newPoints = totalPoints + amount;
    set({ totalPoints: newPoints });
    await storageService.save(KEYS.TOTAL_POINTS, newPoints);
  },

  removeHabit: async (habitId) => {
    const { habits, streaks } = get();
    const newHabits = habits.filter(h => h.id !== habitId);
    const newStreaks = { ...streaks };
    delete newStreaks[habitId];

    set({ habits: newHabits, streaks: newStreaks });
    await Promise.all([
      storageService.save(KEYS.HABITS, newHabits),
      storageService.save(KEYS.STREAKS, newStreaks)
    ]);
  },

  restoreDefaultHabits: async () => {
    const { habits } = get();
    // Only add defaults that aren't already in the list
    const missingDefaults = DEFAULT_HABITS.filter(
      defHabit => !habits.some(h => h.id === defHabit.id)
    );
    
    if (missingDefaults.length > 0) {
      const newHabits = [...habits, ...missingDefaults];
      set({ habits: newHabits });
      await storageService.save(KEYS.HABITS, newHabits);
    }
  },

  resetStore: async () => {
    set({
      habits: DEFAULT_HABITS,
      completionHistory: {},
      streaks: {},
      totalPoints: 0
    });
    await storageService.clearAll();
  },

  getLevel: () => {
    const { totalPoints } = get();
    return LEVELS.reduce((acc, level) => totalPoints >= level.minPoints ? level : acc, LEVELS[0]);
  }
}));

export default useHabitStore;
