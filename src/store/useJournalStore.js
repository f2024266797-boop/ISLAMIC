import { create } from 'zustand';
import { storageService, KEYS } from '../services/storageService';

const CORE_TASKS = [
  { id: 'fajr_prayer', title: 'Fajr Prayer', completed: false, isCore: true },
  { id: 'dhuhr_prayer', title: 'Dhuhr Prayer', completed: false, isCore: true },
  { id: 'asr_prayer', title: 'Asr Prayer', completed: false, isCore: true },
  { id: 'maghrib_prayer', title: 'Maghrib Prayer', completed: false, isCore: true },
  { id: 'isha_prayer', title: 'Isha Prayer', completed: false, isCore: true },
];

const useJournalStore = create((set, get) => ({
  tasks: [], 
  dailyZikr: 0,
  dailyZikrDetails: {}, // e.g., { 'Subhanallah': 33 }
  history: {}, // { [dateString]: { tasks: [], zikr: 0, zikrDetails: {} } }
  viewDate: new Date().toDateString(),
  lastDate: new Date().toDateString(),
  isLoaded: false,

  loadEntries: async () => {
    try {
      const savedTasks = await storageService.load('daily_planner_tasks', CORE_TASKS);
      const savedZikr = await storageService.load('daily_zikr_count', 0);
      const savedZikrDetails = await storageService.load('daily_zikr_details', {});
      const savedDate = await storageService.load('daily_planner_date', new Date().toDateString());
      const savedHistory = await storageService.load('daily_planner_history', {});
      
      const today = new Date().toDateString();
      let activeTasks = savedTasks;
      let activeZikr = savedZikr;
      let activeZikrDetails = savedZikrDetails;
      let historyObj = { ...savedHistory };

      // Cleanup "General Dhikr" if it exists in today's data
      if (activeZikrDetails['General Dhikr']) {
        activeZikr -= activeZikrDetails['General Dhikr'];
        delete activeZikrDetails['General Dhikr'];
        // Save cleaned data
        await storageService.save('daily_zikr_count', activeZikr);
        await storageService.save('daily_zikr_details', activeZikrDetails);
      }

      // If it's a new day, archive the old day and reset
      if (savedDate !== today) {
        // Archive the full state of the day before resetting
        historyObj[savedDate] = { 
          tasks: savedTasks, 
          zikr: savedZikr, 
          zikrDetails: savedZikrDetails 
        };
        
        // Reset everything for the fresh day
        activeTasks = savedTasks.map(t => ({ ...t, completed: false }));
        activeZikr = 0;
        activeZikrDetails = {};
        
        await storageService.save('daily_planner_history', historyObj);
        await storageService.save('daily_planner_date', today);
        await storageService.save('daily_planner_tasks', activeTasks);
        await storageService.save('daily_zikr_count', 0);
        await storageService.save('daily_zikr_details', {});
      }

      set({ 
        tasks: activeTasks, 
        dailyZikr: activeZikr,
        dailyZikrDetails: activeZikrDetails,
        history: historyObj,
        lastDate: today, 
        viewDate: today,
        isLoaded: true 
      });
    } catch (error) {
      console.error('[PlannerStore] Load Error:', error);
      set({ tasks: CORE_TASKS, dailyZikr: 0, dailyZikrDetails: {}, isLoaded: true });
    }
  },

  incrementZikr: async (amount = 1, name = '') => {
    const { dailyZikr, dailyZikrDetails } = get();
    const newVal = dailyZikr + amount;
    const newDetails = { ...dailyZikrDetails };
    
    const zikrName = name || 'Other';
    newDetails[zikrName] = (newDetails[zikrName] || 0) + amount;
    
    set({ dailyZikr: newVal, dailyZikrDetails: newDetails });
    await storageService.save('daily_zikr_count', newVal);
    await storageService.save('daily_zikr_details', newDetails);
  },

  setViewDate: (dateStr) => {
    set({ viewDate: dateStr });
  },

  addTask: async (title) => {
    const { tasks } = get();
    const newTask = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      completed: false,
      isCore: false
    };

    const updated = [...tasks, newTask];
    set({ tasks: updated });
    await storageService.save('daily_planner_tasks', updated);
  },

  toggleTask: async (id) => {
    const { tasks } = get();
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    set({ tasks: updated });
    await storageService.save('daily_planner_tasks', updated);
  },

  deleteTask: async (id) => {
    const { tasks } = get();
    const updated = tasks.filter(t => t.id !== id);
    set({ tasks: updated });
    await storageService.save('daily_planner_tasks', updated);
  },

  resetToday: async () => {
    const today = new Date().toDateString();
    const resetTasks = CORE_TASKS.map(t => ({ ...t, completed: false }));
    
    set({ 
      tasks: resetTasks,
      dailyZikr: 0,
      dailyZikrDetails: {},
    });
    
    await storageService.save('daily_planner_tasks', resetTasks);
    await storageService.save('daily_zikr_count', 0);
    await storageService.save('daily_zikr_details', {});
  }
}));

export default useJournalStore;

