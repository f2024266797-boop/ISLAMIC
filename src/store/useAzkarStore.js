import { create } from 'zustand';
import { storageService } from '../services/storageService';
import { format } from 'date-fns';

const AZKAR_KEY = '@azkar_history';

const useAzkarStore = create((set, get) => ({
  history: {}, // { '2024-04-24': { morning: true, evening: false } }
  isLoaded: false,

  loadHistory: async () => {
    const history = await storageService.load(AZKAR_KEY, {});
    set({ history, isLoaded: true });
  },

  markAsRead: async (type) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { history } = get();
    
    const newHistory = {
      ...history,
      [today]: {
        ...history[today],
        [type]: true
      }
    };
    
    set({ history: newHistory });
    await storageService.save(AZKAR_KEY, newHistory);
  },

  hasReadToday: (type) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { history } = get();
    return !!history[today]?.[type];
  },

  shouldShowAzkar: () => {
    const hour = new Date().getHours();
    const { hasReadToday } = get();
    
    // Morning window: 4 AM to 11 AM
    if (hour >= 4 && hour < 11 && !hasReadToday('morning')) {
      return 'morning';
    }
    
    // Evening window: 4 PM to 10 PM (Asr onwards)
    if (hour >= 16 && hour < 22 && !hasReadToday('evening')) {
      return 'evening';
    }
    
    return null;
  }
}));

export default useAzkarStore;
