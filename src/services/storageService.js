import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_VERSION = 'v1.1';
const PREFIX = `@islamic_habit_tracker_${APP_VERSION}:`;

export const KEYS = {
  HABITS: 'habits',
  COMPLETION_HISTORY: 'completion_history',
  STREAKS: 'streaks',
  TOTAL_POINTS: 'total_points',
  AUTH_USER: 'auth_user',
  SETTINGS: 'settings',
  QURAN_BOOKMARKS: 'quran_bookmarks',
  AZKAR_HISTORY: 'azkar_history',
  PRAYER_SETTINGS: 'prayer_settings',
  JOURNAL_ENTRIES: 'journal_entries',
  SUNNAH_HISTORY: 'sunnah_history',
  QURAN_CACHE: 'quran_cache',
  ALL_USERS: 'all_users'
};

/**
 * Production-grade Storage Service with Schema Validation
 */
export const storageService = {
  save: async (key, value) => {
    try {
      if (value === undefined || value === null) {
        console.warn(`[StorageService] Attempted to save null/undefined for key: ${key}`);
        return false;
      }
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(`${PREFIX}${key}`, stringValue);
      return true;
    } catch (error) {
      console.error(`[StorageService] Save Error [${key}]:`, error);
      return false;
    }
  },

  load: async (key, defaultValue = null) => {
    try {
      const value = await AsyncStorage.getItem(`${PREFIX}${key}`);
      if (value === null) return defaultValue;

      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch (parseError) {
        console.error(`[StorageService] Corruption [${key}]. Resetting.`);
        await AsyncStorage.removeItem(`${PREFIX}${key}`);
        return defaultValue;
      }

      // Basic Type Validation
      if (defaultValue !== null && typeof parsed !== typeof defaultValue) {
        console.warn(`[StorageService] Type Mismatch [${key}]. Expected ${typeof defaultValue}, got ${typeof parsed}.`);
        return defaultValue;
      }

      return parsed;
    } catch (error) {
      console.error(`[StorageService] Load Error [${key}]:`, error);
      return defaultValue;
    }
  },

  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(`${PREFIX}${key}`);
      return true;
    } catch (error) {
      return false;
    }
  },

  clearAll: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(k => k.startsWith(PREFIX));
      await AsyncStorage.multiRemove(appKeys);
      return true;
    } catch (error) {
      return false;
    }
  }
};
