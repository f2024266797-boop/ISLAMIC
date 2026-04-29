import { create } from 'zustand';
import { storageService } from '../services/storageService';

const SETTINGS_KEY = '@app_settings';

const useSettingsStore = create((set, get) => ({
  notificationsEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
  quranTranslation: 'en.sahih',
  arabicFont: 'default', // 'default', 'indopak', 'uthmani'
  isLoaded: false,

  loadSettings: async () => {
    const settings = await storageService.load(SETTINGS_KEY, {
      notificationsEnabled: true,
      soundEnabled: true,
      hapticsEnabled: true,
      quranTranslation: 'en.sahih',
      arabicFont: 'default',
    });
    set({ ...settings, isLoaded: true });
  },

  updateSettings: async (updates) => {
    set((state) => {
      const newState = { ...state, ...updates };
      storageService.save(SETTINGS_KEY, {
        notificationsEnabled: newState.notificationsEnabled,
        soundEnabled: newState.soundEnabled,
        hapticsEnabled: newState.hapticsEnabled,
        quranTranslation: newState.quranTranslation,
        arabicFont: newState.arabicFont,
      });
      return updates;
    });
  },

  resetAppData: async (clearHabitStore, clearAuthStore) => {
    // Logic to be called from the UI
    await storageService.save('@islamic_habit_tracker_v1', null);
    await storageService.save('@auth_user', null);
    clearHabitStore();
    clearAuthStore();
  }
}));

export default useSettingsStore;
