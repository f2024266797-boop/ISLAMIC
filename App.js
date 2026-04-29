import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, AppState, Text, Platform, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import useHabitStore from './src/store/useHabitStore';
import useAuthStore from './src/store/useAuthStore';
import useSettingsStore from './src/store/useSettingsStore';
import useAzkarStore from './src/store/useAzkarStore';
import usePrayerStore from './src/store/usePrayerStore';
import useJournalStore from './src/store/useJournalStore';
import { THEME } from './src/constants/theme';
import { notificationService } from './src/services/notificationService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { IslamicPattern } from './src/components/IslamicPattern';
import { useFonts } from 'expo-font';
import { PTSans_400Regular } from '@expo-google-fonts/pt-sans';
import { Lustria_400Regular } from '@expo-google-fonts/lustria';

export default function App() {
  const { loadData, isLoaded: habitsLoaded } = useHabitStore();
  const { loadAuth, isLoaded: authLoaded } = useAuthStore();
  const { loadSettings, isLoaded: settingsLoaded } = useSettingsStore();
  const { loadHistory: loadAzkar, isLoaded: azkarLoaded } = useAzkarStore();
  const { loadSettings: loadPrayers, isLoaded: prayersLoaded, calculateTimes } = usePrayerStore();
  const { loadEntries: loadJournal, isLoaded: journalLoaded } = useJournalStore();

  let [fontsLoaded] = useFonts({
    PTSans_400Regular,
    Lustria_400Regular,
  });

  useEffect(() => {
    async function init() {
      // Load persisted data
      await Promise.all([
        loadData(),
        loadAuth(),
        loadSettings(),
        loadAzkar(),
        loadPrayers(),
        loadJournal()
      ]);

      // Initialize notifications (Temporarily disabled for efficiency)
      /*
      const hasPermission = await notificationService.registerForPushNotificationsAsync();
      if (hasPermission) {
        const currentHabits = useHabitStore.getState().habits;
        await notificationService.synchronizeSchedules(currentHabits);
      }
      */

      // Automatically request and update location on startup
      usePrayerStore.getState().updateLocation();
    }

    init();

    // AppState listener for refreshing prayer times
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        calculateTimes();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const appReady = habitsLoaded && authLoaded && settingsLoaded && azkarLoaded && prayersLoaded && journalLoaded && fontsLoaded;

  if (!appReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
        <IslamicPattern opacity={0.15} />
        <View style={styles.loadingContent}>
          <Text style={styles.bismillah}>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>
          <ActivityIndicator size="large" color={THEME.gold} style={{ marginVertical: 24 }} />
          <Text style={styles.loadingText}>Initializing Spiritual Journey...</Text>
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  bismillah: {
    fontFamily: Platform.OS === 'ios' ? 'Amiri' : 'serif',
    fontSize: 26,
    color: THEME.gold,
    textAlign: 'center'
  },
  loadingText: {
    color: THEME.gray,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1
  },
});
