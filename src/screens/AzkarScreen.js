import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform, StatusBar, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { MORNING_AZKAR, EVENING_AZKAR } from '../constants/azkar';
import useAzkarStore from '../store/useAzkarStore';
import useHabitStore from '../store/useHabitStore';
import useSettingsStore from '../store/useSettingsStore';

export default function AzkarScreen({ route, navigation }) {
  const { type = 'morning' } = route.params || {};
  const { arabicFont } = useSettingsStore();
  const azkarList = type === 'morning' ? MORNING_AZKAR : EVENING_AZKAR;

  const [idx, setIdx] = useState(0);
  const [counts, setCounts] = useState(azkarList.map(a => a.count));
  const { markAsRead } = useAzkarStore();
  const { addPoints } = useHabitStore();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const current = azkarList[idx];
  const remaining = counts[idx];

  const handlePress = () => {
    if (Platform.OS !== 'web') Vibration.vibrate(10);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 50, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();

    const newCounts = [...counts];
    if (newCounts[idx] > 0) {
      newCounts[idx]--;
      setCounts(newCounts);
      if (newCounts[idx] === 0) {
        if (idx < azkarList.length - 1) {
          Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
            setIdx(i => i + 1);
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
          });
        } else {
          handleFinish();
        }
      }
    }
  };

  const handleFinish = () => {
    markAsRead(type);
    addPoints(50);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={THEME.white} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.microHeader}>{(type || '').toUpperCase()} PROTOCOL</Text>
          <Text style={styles.title}>{type === 'morning' ? 'MORNING' : 'EVENING'}</Text>
        </View>
        <View style={styles.counterBox}>
          <Text style={styles.countText}>{idx + 1}</Text>
          <Text style={styles.totalText}>/{azkarList.length}</Text>
        </View>
      </View>

      <View style={styles.main}>
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <View style={styles.cardContent}>
            <View style={styles.indicatorContainer}>
              <View style={styles.indicator} />
            </View>
            
            <View style={styles.titleWrapper}>
              <Text style={styles.mainTitle}>{current.title}</Text>
              <View style={styles.titleDivider} />
              <Text style={styles.subSubtitle}>RECITATION MODE</Text>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color={THEME.gold} />
              <Text style={styles.infoText}>Tap the counter below after each recitation.</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.actionArea}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
            <TouchableOpacity 
              onPress={() => {
                if (idx > 0) {
                  Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
                    setIdx(i => i - 1);
                    const newCounts = [...counts];
                    newCounts[idx - 1] = azkarList[idx - 1].count;
                    setCounts(newCounts);
                    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
                  });
                }
              }} 
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE', opacity: idx > 0 ? 1 : 0.3 }}
              disabled={idx === 0}
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePress} activeOpacity={1} style={{ marginBottom: 0 }}>
              <Animated.View style={[styles.tapInner, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.remainingText}>{remaining}</Text>
                <Text style={styles.tapLabel}>RECITATIONS</Text>
              </Animated.View>
            </TouchableOpacity>

            <View style={{ width: 44, height: 44 }} />
          </View>
          <TouchableOpacity style={styles.finishLink} onPress={handleFinish}>
            <Text style={styles.finishText}>TERMINATE SESSION</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24 },
  headerTitle: { alignItems: 'center' },
  microHeader: { color: THEME.gold, fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#000', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  counterBox: { flexDirection: 'row', alignItems: 'baseline' },
  countText: { color: '#000', fontSize: 16, fontWeight: '900' },
  totalText: { color: '#888', fontSize: 10, fontWeight: '700' },

  main: { flex: 1, padding: 24, justifyContent: 'space-between' },
  card: { height: '50%', backgroundColor: '#FFF', borderRadius: 32, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  cardContent: { flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' },
  
  indicatorContainer: { position: 'absolute', top: 20 },
  indicator: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#F0F0F0' },

  titleWrapper: { alignItems: 'center', marginVertical: 40 },
  mainTitle: { fontFamily: 'PTSans_400Regular', color: '#000', fontSize: 28, fontWeight: '900', letterSpacing: -1, textAlign: 'center' },
  titleDivider: { width: 30, height: 2, backgroundColor: THEME.gold, marginVertical: 16, borderRadius: 1 },
  subSubtitle: { fontFamily: 'PTSans_400Regular', color: '#AAA', fontSize: 10, fontWeight: '900', letterSpacing: 2 },

  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAFAFA', padding: 12, borderRadius: 12, marginTop: 20 },
  infoText: { fontFamily: 'PTSans_400Regular', color: '#888', fontSize: 11, marginLeft: 8, fontWeight: '600' },

  actionArea: { alignItems: 'center', marginBottom: 20 },
  tapInner: { width: 140, height: 140, borderRadius: 40, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: THEME.gold, shadowColor: THEME.gold, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  remainingText: { color: '#000', fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  tapLabel: { color: THEME.gold, fontSize: 9, fontWeight: '900', letterSpacing: 2, marginTop: -4 },
  finishLink: { padding: 16 },
  finishText: { color: '#FF3B30', fontSize: 10, fontWeight: '900', letterSpacing: 2, opacity: 0.6 },
});
