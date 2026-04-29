import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import usePrayerStore from '../store/usePrayerStore';

function PrayerTile({ name, time, isNext, isPast }) {
  return (
    <View style={[styles.tile, isNext && styles.tileNext, isPast && styles.tilePast]}>
      <View style={styles.tileLeft}>
        <View style={[styles.indicator, isNext && styles.indicatorActive]} />
        <Text style={[styles.prayerName, isNext && styles.textGold]}>{(name || '').toUpperCase()}</Text>
      </View>
      <View style={styles.tileRight}>
        <Text style={[styles.prayerTime, isNext && styles.textGold]}>{time}</Text>
        {isNext && (
          <View style={styles.nextBadge}>
            <Text style={styles.nextText}>NEXT</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function PrayerTimesScreen({ navigation }) {
  const { times, nextPrayer, location } = usePrayerStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={THEME.white} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.micro}>ASTRONOMICAL DATA</Text>
          <Text style={styles.title}>PRAYER TIMES</Text>
        </View>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="location-outline" size={20} color={THEME.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.locationCard}>
          <Text style={styles.locMicro}>DETECTION POINT</Text>
          <Text style={styles.locVal}>{(location?.city || '').toUpperCase() || 'SEARCHING...'}, {(location?.country || '').toUpperCase() || 'CONNECTING'}</Text>
        </View>

        <View style={styles.grid}>
          {times && Object.entries(times).map(([name, time]) => (
            <PrayerTile 
              key={name} 
              name={name} 
              time={time} 
              isNext={nextPrayer?.name === name} 
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>CALCULATION: HANAFI / MWL</Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24 },
  headerTitle: { alignItems: 'center' },
  micro: { color: THEME.gold, fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  title: { color: THEME.white, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#111' },

  scroll: { paddingHorizontal: 24 },
  locationCard: { backgroundColor: '#070707', padding: 24, borderRadius: 20, borderWidth: 1, borderColor: '#111', marginBottom: 24 },
  locMicro: { color: '#333', fontSize: 7, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  locVal: { color: THEME.white, fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },

  grid: { gap: 8 },
  tile: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0A0A0A', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#111'
  },
  tileNext: { borderColor: THEME.gold, backgroundColor: '#0D0B00' },
  tileLeft: { flexDirection: 'row', alignItems: 'center' },
  indicator: { width: 2, height: 12, backgroundColor: '#222', marginRight: 16, borderRadius: 1 },
  indicatorActive: { backgroundColor: THEME.gold },
  prayerName: { color: '#444', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  textGold: { color: THEME.gold },
  
  tileRight: { flexDirection: 'row', alignItems: 'center' },
  prayerTime: { color: THEME.white, fontSize: 16, fontWeight: '900', fontVariant: ['tabular-nums'] },
  nextBadge: { backgroundColor: THEME.gold, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 12 },
  nextText: { color: '#000', fontSize: 7, fontWeight: '900' },

  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { color: '#111', fontSize: 7, fontWeight: '900', letterSpacing: 2 },
});
