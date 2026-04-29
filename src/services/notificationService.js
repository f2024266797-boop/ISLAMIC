import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { storageService, KEYS } from './storageService';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const INSPIRING_AYAT = [
  "Indeed, with hardship [will be] ease. (94:6)",
  "And He found you lost and guided [you]. (93:7)",
  "So remember Me; I will remember you. (2:152)",
  "My mercy encompasses all things. (7:156)",
  "Allah does not burden a soul beyond that it can bear. (2:286)",
  "And whoever relies upon Allah - then He is sufficient for him. (65:3)",
];

/**
 * Check if we are running inside Expo Go.
 * expo-notifications local scheduling (DAILY) requires a development build in SDK 53+.
 */
function isExpoGo() {
  return Constants.executionEnvironment === 'storeClient';
}

class NotificationService {
  /**
   * Register for push notifications. Returns false if not supported.
   */
  async registerForPushNotificationsAsync() {
    try {
      if (isExpoGo()) {
        console.warn('[NotificationService] Expo Go detected — notification scheduling limited.');
        return false;
      }

      if (!Device.isDevice) return false;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') return false;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'General',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      return true;
    } catch (e) {
      console.warn('[NotificationService] Registration skipped:', e.message);
      return false;
    }
  }

  /**
   * Synchronize notification schedules.
   */
  async synchronizeSchedules(habits = []) {
    try {
      if (isExpoGo()) {
        console.log('[NotificationService] Skipping in Expo Go — use a dev build for notifications.');
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();
      await this.safeScheduleDailyAyah();

      const settings = await storageService.load(KEYS.SETTINGS, { notificationsEnabled: true });
      if (settings.notificationsEnabled) {
        const uniqueHabits = [...new Map(habits.map(h => [h.id, h])).values()];
        for (const habit of uniqueHabits) {
          if (habit.reminderHour !== undefined && !habit.archived) {
            await this.safeScheduleHabitReminder(habit);
          }
        }
      }

      console.log(`[NotificationService] Synced ${habits.length} triggers.`);
    } catch (error) {
      console.warn('[NotificationService] Sync error:', error.message);
    }
  }

  async safeScheduleDailyAyah() {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    const randomAyah = INSPIRING_AYAT[dayOfYear % INSPIRING_AYAT.length];

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Inspiration',
          body: randomAyah,
          data: { type: 'daily_ayah' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 8,
          minute: 30,
        },
      });
    } catch (e) {
      console.warn('[NotificationService] Daily Ayah skipped:', e.message);
    }
  }

  async safeScheduleHabitReminder(habit) {
    if (!habit?.name || habit.reminderHour === undefined) return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Islamic Habit Reminder',
          body: `It is time for: ${habit.name}.`,
          data: { habitId: habit.id, type: 'habit' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: Math.min(23, Math.max(0, habit.reminderHour)),
          minute: Math.min(59, Math.max(0, habit.reminderMinute || 0)),
        },
      });
    } catch (e) {
      console.warn(`[NotificationService] Habit [${habit.id}] skipped:`, e.message);
    }
  }

  async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const notificationService = new NotificationService();
