import { create } from 'zustand';
import { storageService, KEYS } from '../services/storageService';
import { format } from 'date-fns';

const useSunnahStore = create((set, get) => ({
  dailySunnahs: {}, // { '2026-04-29': { '1': true, '2': false } }
  isLoaded: false,

  loadSunnahs: async () => {
    try {
      const saved = await storageService.load(KEYS.SUNNAH_HISTORY, {});
      set({ dailySunnahs: saved, isLoaded: true });
    } catch (error) {
      console.error('[SunnahStore] Load Error:', error);
      set({ isLoaded: true });
    }
  },

  toggleSunnah: async (id) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { dailySunnahs } = get();
    
    const todayData = dailySunnahs[today] || {};
    const updatedToday = {
      ...todayData,
      [id]: !todayData[id]
    };

    const updatedHistory = {
      ...dailySunnahs,
      [today]: updatedToday
    };

    set({ dailySunnahs: updatedHistory });
    await storageService.save(KEYS.SUNNAH_HISTORY, updatedHistory);
  },

  getSunnahProgress: (dateStr) => {
    const { dailySunnahs } = get();
    const dateData = dailySunnahs[dateStr] || {};
    const completed = Object.values(dateData).filter(v => v).length;
    return completed;
  }
}));

export default useSunnahStore;
