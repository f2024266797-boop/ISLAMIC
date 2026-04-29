import { create } from 'zustand';
import * as Location from 'expo-location';
import { storageService, KEYS } from '../services/storageService';
import { prayerService } from '../services/prayerService';
import { notificationService } from '../services/notificationService';

const usePrayerStore = create((set, get) => ({
  prayerTimes: null,
  location: null, // { latitude, longitude, city }
  calculationMethod: 'MuslimWorldLeague',
  isLoaded: false,

  loadSettings: async () => {
    try {
      const settings = await storageService.load(KEYS.PRAYER_SETTINGS, {
        calculationMethod: 'MuslimWorldLeague',
        location: null
      });
      
      set({ 
        calculationMethod: settings.calculationMethod,
        location: settings.location
      });

      if (settings.location) {
        get().calculateTimes();
      }
      set({ isLoaded: true });
    } catch (error) {
      console.error('[PrayerStore] Load Error:', error);
      set({ isLoaded: true });
    }
  },

  updateLocation: async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        return { success: false, error: 'Location services are disabled' };
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return { success: false, error: 'Permission denied' };

      let loc;
      try {
        // Try getting current position with a timeout
        loc = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.Balanced,
          timeout: 5000 
        });
      } catch (e) {
        // Fallback to last known position
        loc = await Location.getLastKnownPositionAsync();
      }

      if (!loc) {
        throw new Error('Current location is unavailable. Make sure that location services are enabled');
      }

      const [rev] = await Location.reverseGeocodeAsync(loc.coords);
      
      const locationData = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        city: rev?.city || rev?.region || 'Unknown Location'
      };

      set({ location: locationData });
      get().calculateTimes();
      
      await storageService.save(KEYS.PRAYER_SETTINGS, {
        calculationMethod: get().calculationMethod,
        location: locationData
      });

      return { success: true };
    } catch (error) {
      console.error('[PrayerStore] Update Location Error:', error);
      return { success: false, error: error.message };
    }
  },

  setMethod: async (method) => {
    set({ calculationMethod: method });
    get().calculateTimes();
    await storageService.save(KEYS.PRAYER_SETTINGS, {
      calculationMethod: method,
      location: get().location
    });
  },

  calculateTimes: () => {
    const { location, calculationMethod } = get();
    if (!location) return;

    const times = prayerService.getPrayerTimes(location, new Date(), calculationMethod);
    set({ prayerTimes: times });
    
    // Auto-schedule next Athan if enabled in settings
    // (Actual logic would check user preference for each prayer)
  }
}));

export default usePrayerStore;
