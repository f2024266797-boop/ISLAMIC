import { Coordinates, CalculationMethod, PrayerTimes, SunnahTimes } from 'adhan';
import { format } from 'date-fns';

/**
 * Production-grade Prayer Times Service
 * Uses the adhan library for offline-first, accurate calculations.
 */
export const prayerService = {
  /**
   * Calculates prayer times for a given location and date
   */
  getPrayerTimes: (coords, date = new Date(), method = 'MuslimWorldLeague') => {
    try {
      const coordinates = new Coordinates(coords.latitude, coords.longitude);
      
      // Map string method names to adhan functions safely
      const getParams = (name) => {
        const methods = {
          MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
          NorthAmerica: CalculationMethod.NorthAmerica,
          Egyptian: CalculationMethod.Egyptian,
          UmmAlQura: CalculationMethod.UmmAlQura,
          Karachi: CalculationMethod.Karachi,
          Moonsighting: CalculationMethod.Moonsighting,
          Dubai: CalculationMethod.Dubai,
          Kuwait: CalculationMethod.Kuwait,
          Qatar: CalculationMethod.Qatar,
          Singapore: CalculationMethod.Singapore,
        };
        const methodFn = methods[name] || CalculationMethod.MuslimWorldLeague;
        return methodFn();
      };

      const params = getParams(method);
      const prayerTimes = new PrayerTimes(coordinates, date, params);

      return {
        fajr: prayerTimes.fajr,
        sunrise: prayerTimes.sunrise,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        maghrib: prayerTimes.maghrib,
        isha: prayerTimes.isha,
        current: prayerTimes.currentPrayer(),
        next: prayerTimes.nextPrayer(),
      };
    } catch (error) {
      console.error('[PrayerService] Calculation Error:', error);
      return null;
    }
  },

  /**
   * Calculates Qiyam and midnight times
   */
  getSunnahTimes: (coords, date = new Date(), method = 'MuslimWorldLeague') => {
    try {
      const coordinates = new Coordinates(coords.latitude, coords.longitude);
      const getParams = (name) => {
        const methods = {
          MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
          NorthAmerica: CalculationMethod.NorthAmerica,
          Egyptian: CalculationMethod.Egyptian,
          UmmAlQura: CalculationMethod.UmmAlQura,
          Karachi: CalculationMethod.Karachi,
          Moonsighting: CalculationMethod.Moonsighting,
          Dubai: CalculationMethod.Dubai,
          Kuwait: CalculationMethod.Kuwait,
          Qatar: CalculationMethod.Qatar,
          Singapore: CalculationMethod.Singapore,
        };
        const methodFn = methods[name] || CalculationMethod.MuslimWorldLeague;
        return methodFn();
      };

      const params = getParams(method);
      const prayerTimes = new PrayerTimes(coordinates, date, params);
      const sunnahTimes = new SunnahTimes(prayerTimes);

      return {
        middleOfTheNight: sunnahTimes.middleOfTheNight,
        lastThirdOfTheNight: sunnahTimes.lastThirdOfTheNight,
      };
    } catch (error) {
      console.error('[PrayerService] Sunnah Calculation Error:', error);
      return null;
    }
  },

  /**
   * Helper to format prayer time for display
   */
  formatTime: (date) => {
    if (!date) return '--:--';
    return format(date, 'hh:mm a');
  },

  /**
   * Available Calculation Methods for UI
   */
  getMethods: () => [
    { label: 'Muslim World League', value: 'MuslimWorldLeague' },
    { label: 'Islamic Society of North America (ISNA)', value: 'NorthAmerica' },
    { label: 'Egyptian General Authority of Survey', value: 'Egyptian' },
    { label: 'Umm al-Qura University, Makkah', value: 'UmmAlQura' },
    { label: 'University of Islamic Sciences, Karachi', value: 'Karachi' },
    { label: 'Moonsighting Committee', value: 'Moonsighting' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'Kuwait', value: 'Kuwait' },
    { label: 'Qatar', value: 'Qatar' },
    { label: 'Singapore', value: 'Singapore' },
  ]
};
